// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BetContract {
    struct Bet {
        address gambler;
        uint8 bet;
        uint256 betValue;
        uint256 currentOdd;
    }

    struct Event {
        address creator;
        string eventType;
        uint8 result;
        bool isClosed;
        uint256 amount;
    }

    struct Account {
        bool created;
        uint256 amount;
    }

    struct Odd {
        uint8 prediction;
        uint256 odd;
    }
    mapping(uint256 => mapping(uint8 => uint256)) odds;
    mapping(uint256 => Bet[]) eventParticipants;
    mapping(address => Account) wallets;
    Event[] allEvents;

    event EventCreated(uint256 indexed id, string eventType, Odd[] odds);
    event BetClosed(uint256 indexed id, uint8 result);
    event UserRegistered(address indexed client);
    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);
    event OddChange(uint256 eventId, uint256 newOdd);
    event EventStarted(uint256 indexed eventId);

    modifier onlyCreator(uint256 _betId) {
        require(
            msg.sender == allEvents[_betId].creator,
            "Apenas o criador pode realizar esta acao"
        );
        _;
    }

    modifier creatorCanNotBet(uint256 _betId) {
        require(
            msg.sender != allEvents[_betId].creator,
            "Criador da aposta nao pode apostar"
        );
        _;
    }

    modifier betIsActive(uint256 _betId) {
        require(allEvents[_betId].isClosed, "A aposta nao esta mais ativa");
        _;
    }

    modifier onlyRegistered() {
        require(wallets[msg.sender].created, "Usuario nao registrado");
        _;
    }

    function register() public {
        require(!wallets[msg.sender].created, "Usuario ja existe");
        wallets[msg.sender] = Account({created: true, amount: 0});
        emit UserRegistered(msg.sender);
    }

    function deposit() public payable onlyRegistered {
        require(msg.value > 0, "Valor deve ser maior que 0");
        wallets[msg.sender].amount += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) public onlyRegistered {
        require(
            wallets[msg.sender].amount >= amount,
            "Saldo do contrato insuficiente"
        );
        require(amount > 0, "Valor deve ser maior que 0");

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Falha ao transferir fundos");

        emit Withdrawal(msg.sender, amount);
    }

    function getBalance() public view onlyRegistered returns (uint256) {
        return wallets[msg.sender].amount;
    }

    function createEvent(
        string memory eventType,
        Odd[] memory eventOdds
    ) public onlyRegistered {
        Event memory newEvent;
        newEvent.creator = msg.sender;
        newEvent.eventType = eventType;
        allEvents.push(newEvent);
        emit EventCreated(allEvents.length - 1, eventType, eventOdds);
        for (uint i = 0; i < eventOdds.length; i++) {
            odds[allEvents.length - 1][eventOdds[i].prediction] = eventOdds[i]
                .odd;
        }
    }

    function bet(
        uint256 eventId,
        uint8 prediction,
        uint256 betValue
    ) public creatorCanNotBet(eventId) betIsActive(eventId) onlyRegistered {
        require(betValue > 0, "Valor nao permitido");
        require(
            wallets[msg.sender].amount >= betValue,
            "Saldo insuficiente no contrato"
        );

        wallets[msg.sender].amount -= betValue;

        allEvents[eventId].amount += betValue;

        eventParticipants[eventId].push(
            Bet({
                gambler: msg.sender,
                bet: prediction,
                betValue: betValue,
                currentOdd: odds[eventId][prediction]
            })
        );
    }

    function startEvent(
        uint256 eventId
    ) public onlyRegistered onlyCreator(eventId) betIsActive(eventId) {
        emit EventStarted(eventId);
    }

    function closeEvent(
        uint256 eventId
    ) public onlyRegistered onlyCreator(eventId) betIsActive(eventId) {
        allEvents[eventId].isClosed = true;
    }

    function payWinners(
        uint256 eventId,
        uint8 result
    ) public onlyRegistered onlyCreator(eventId) {
        require(allEvents[eventId].isClosed, "still opened event");
        Bet[] storage participants = eventParticipants[eventId];
        for (uint i = 0; i < participants.length; i++) {
            Bet storage b = participants[i];
            if (b.bet == result) {
                uint256 payout = b.currentOdd * b.betValue;
                require(
                    allEvents[eventId].amount >= payout,
                    "Insufficient funds to pay winners"
                );
                allEvents[eventId].amount -= payout;
                wallets[b.gambler].amount += payout;
            }
        }
        wallets[allEvents[eventId].creator].amount += allEvents[eventId].amount;
    }

    function closeEventAndPayWinners(
        uint256 eventId,
        uint8 result
    ) public onlyRegistered onlyCreator(eventId) betIsActive(eventId) {
        Bet[] storage participants = eventParticipants[eventId];
        for (uint i = 0; i < participants.length; i++) {
            Bet storage b = participants[i];
            if (b.bet == result) {
                uint256 payout = b.currentOdd * b.betValue;
                require(
                    allEvents[eventId].amount >= payout,
                    "Insufficient funds to pay winners"
                );
                allEvents[eventId].amount -= payout;
                wallets[b.gambler].amount += payout;
            }
        }
        allEvents[eventId].isClosed = true;
        wallets[allEvents[eventId].creator].amount += allEvents[eventId].amount;

        emit BetClosed(eventId, result);
    }

    function changeOdd(
        uint256 eventId,
        uint8 prediction,
        uint256 newOdd
    ) public onlyCreator(eventId) {
        odds[eventId][prediction] = newOdd;
        emit OddChange(eventId, newOdd);
    }
}
