// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BetContract {
    struct Bet {
        address gambler;
        uint8 bet;
        uint256 betValue;
    }

    struct Event {
        address creator;
        uint256 odd;
        string eventType;
        uint8 result;
        bool isClosed;
        uint256 amount;
        Bet[] participants;
    }

    struct Account {
        bool created;
        uint256 amount;
    }

    mapping(uint256 => Event) public allEvents;
    mapping(address => Account) public wallets;

    event BetCreated(uint256 indexed id, string eventType, uint256 odd);
    event BetClosed(uint256 indexed id, string eventType, uint8 result);
    event UserRegistered(address indexed client);

    modifier isRegistered(address client) {
        require(
            wallets[msg.sender].created,
            "Cliente ainda nao cadastrado."
        );
        _;
    }

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

    function register() public {
        wallets[msg.sender] = Account({created: true, amount: 0});

        emit UserRegistered(msg.sender);
    }

    function getWallet() public isRegistered(msg.sender) view returns (uint256) {
        return wallets[msg.sender].amount;
    }

    function deposit() public payable isRegistered(msg.sender) {
        require(msg.value > 0, "Valor deve ser maior que 0");
        wallets[msg.sender].amount += msg.value;
    }

    function withdraw(uint256 value) public isRegistered(msg.sender) {
        require(value <= wallets[msg.sender].amount, "Cliente nao ha saldo suficiente");
        payable(msg.sender).transfer(value);
    }
}
