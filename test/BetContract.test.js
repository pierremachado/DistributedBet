const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BetContract", function () {
  let betContract;
  let owner;
  let gambler;
  let creator;
  let otherUser;
  let betValue = ethers.parseEther("1"); // 1 ether
  let eventId = 0;
  let prediction = 1;
  let odd = 2;

  beforeEach(async function () {
    [owner, gambler, creator, otherUser] = await ethers.getSigners();

    const BetContract = await ethers.getContractFactory("BetContract");
    betContract = await BetContract.deploy();

    console.log("Contrato implantado:", betContract.address);
    console.log("Métodos disponíveis:", Object.keys(betContract));
  });

  describe("Register", function () {
    it("should allow a user to register", async function () {
      await expect(betContract.connect(gambler).register())
      .to.emit(betContract, "UserRegistered")
      .withArgs(gambler.address);
    });

    it("should not allow the same user to register twice", async function () {
      await betContract.connect(gambler).register();
      await expect(betContract.connect(gambler).register()).to.be.revertedWith(
        "Usuario ja existe"
      );
    });
  });

  describe("Deposit", function () {
    it("should allow a registered user to deposit", async function () {
      await betContract.connect(gambler).register();
      await betContract.connect(gambler).deposit({ value: betValue });
      const balance = await betContract.connect(gambler).getBalance();
      expect(balance).to.equal(betValue);
    });

    it("should not allow an unregistered user to deposit", async function () {
      await expect(
        betContract.connect(otherUser).deposit({ value: betValue })
      ).to.be.revertedWith("Usuario nao registrado");
    });
  });

  describe("Create Event", function () {
    it("should not allow an unregistered user to create an event", async function () {
      await expect(
        betContract
          .connect(otherUser) // Usuário não registrado
          .createEvent("Football Match", [{ prediction: 1, odd: 2 }])
      ).to.be.revertedWith("Usuario nao registrado"); // Mensagem esperada
    });

    it("should emit an EventCreated event", async function () {
      await betContract.connect(creator).register();
      await expect(
        betContract
          .connect(creator)
          .createEvent("Football Match", [{ prediction: 1, odd: 2 }])
      ).to.emit(betContract, "EventCreated");
    });
  });

  describe("Bet", function () {
    beforeEach(async function () {
      await betContract.connect(creator).register();
      await betContract
        .connect(creator)
        .createEvent("Football Match", [{ prediction: 1, odd: 2 }, { prediction: 2, odd: 2 }]);
      await betContract.connect(gambler).register();
      await betContract.connect(gambler).deposit({ value: betValue });
      await betContract.connect(otherUser).register();
      await betContract.connect(otherUser).deposit({value : betValue});
    });

    it("should allow a registered user to place a bet", async function () {
      await expect(betContract.connect(gambler).bet(eventId, prediction, betValue))
      .to.emit(betContract, "BetPlaced")
      .withArgs(gambler.address, eventId, prediction, betValue);
    });

    it("should not allow the creator to place a bet", async function () {
      await expect(
        betContract.connect(creator).bet(eventId, prediction, betValue)
      ).to.be.revertedWith("Criador da aposta nao pode apostar");
    });

    it("should not allow betting on a closed event", async function () {
      await betContract.connect(gambler).bet(eventId, prediction, betValue);
      await betContract.connect(otherUser).bet(eventId, prediction + 1, betValue);
      await betContract
        .connect(creator)
        .closeEventAndPayWinners(eventId, prediction);
      await expect(
        betContract.connect(gambler).bet(eventId, prediction, betValue)
      ).to.be.revertedWith("A aposta nao esta mais ativa");
    });
  });

  describe("Close Event and Pay Winners", function () {
    beforeEach(async function () {
      await betContract.connect(creator).register();
      await betContract
        .connect(creator)
        .createEvent("Football Match", [{ prediction: 1, odd: 2 }, { prediction: 2, odd: 2 }]);
        await betContract
        .connect(creator)
        .createEvent("Football Match", [{ prediction: 1, odd: 2 }, { prediction: 2, odd: 2 }]);
      await betContract.connect(gambler).register();
      await betContract.connect(gambler).deposit({ value: betValue });
      await betContract.connect(otherUser).register();
      await betContract.connect(otherUser).deposit({value : betValue});
      await betContract.connect(gambler).bet(eventId, prediction, betValue);
      await betContract.connect(otherUser).bet(eventId, prediction + 1, betValue);
    });

    it("should allow the creator to close an event and pay winners", async function () {
      await betContract
        .connect(creator)
        .closeEventAndPayWinners(eventId, prediction);
      const gamblerBalance = await betContract.connect(gambler).getBalance();
      expect(gamblerBalance).to.equal(ethers.parseEther("2")); // original bet + winnings
    });

    it("should not allow a non-creator to close the event", async function () {
      await expect(
        betContract
          .connect(gambler)
          .closeEventAndPayWinners(eventId, prediction)
      ).to.be.revertedWith("Apenas o criador pode realizar esta acao");
    });

    it("should emit a BetClosed event", async function () {
      await expect(
        betContract
          .connect(creator)
          .closeEventAndPayWinners(eventId, prediction)
      ).to.emit(betContract, "BetClosed");
    });
  });

  describe("Change Odd", function () {
    beforeEach(async function () {
      await betContract.connect(creator).register();
      await betContract
        .connect(creator)
        .createEvent("Football Match", [{ prediction: 1, odd: 2 }]);
    });

    it("should emit an OddChange event", async function () {
      await expect(
        betContract.connect(creator).changeOdd(eventId, prediction, 3)
      ).to.emit(betContract, "OddChange");
    });

    it("should allow the creator to change the odds", async function () {
      await expect(
        betContract.connect(creator).changeOdd(eventId, prediction, 3)
      )
        .to.emit(betContract, "OddChange")
        .withArgs(eventId, 3);
    });

    it("should not allow non-creators to change the odds", async function () {
      await expect(
        betContract.connect(gambler).changeOdd(eventId, prediction, 3)
      ).to.be.revertedWith("Apenas o criador pode realizar esta acao");
    });
  });
});