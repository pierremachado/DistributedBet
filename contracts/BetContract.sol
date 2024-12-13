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

    mapping(address => Account) public wallets;

    Event[] allEvents;

    event EventCreated(uint256 indexed id, string eventType, uint256 odd);
    event BetClosed(uint256 indexed id, uint8 result);
    event UserRegistered(address indexed client);
    event OddChange(uint256 eventId, uint256 newOdd);

    modifier isRegistered(address client) {
        require(wallets[msg.sender].created, "Cliente ainda nao cadastrado.");
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
        require(wallets[msg.sender].created == false, "Usuario ja existe");
        wallets[msg.sender] = Account({created: true, amount: 0});

        emit UserRegistered(msg.sender);
    }

    function getWallet()
        public
        view
        isRegistered(msg.sender)
        returns (uint256)
    {
        return wallets[msg.sender].amount;
    }

    function deposit() public payable isRegistered(msg.sender) {
        require(msg.value > 0, "Valor deve ser maior que 0");
        wallets[msg.sender].amount += msg.value;
    }

    function withdraw(uint256 value) public isRegistered(msg.sender) {
        require(value <= wallets[msg.sender].amount, "Saldo insuficiente");
        wallets[msg.sender].amount -= value;
        (bool success, ) = msg.sender.call{value: value}("");
        require(success, "Falha ao transferir fundos");
    }

    function createEvent(string memory eventType, uint256 odd) public {
        Event memory newEvent;
        newEvent.creator = msg.sender;
        newEvent.odd = odd;
        newEvent.eventType = eventType;
        allEvents.push(newEvent);
        emit EventCreated(allEvents.length - 1, eventType, odd);
    }

    function bet(
        uint256 eventId,
        uint8 prediction,
        uint256 betValue
    )
        public
        creatorCanNotBet(eventId)
        betIsActive(eventId)
        isRegistered(msg.sender)
    {
        require(betValue > 0, "Valor nao permitido");
        require(betValue <= wallets[msg.sender].amount, "Saldo insuficiente");

        wallets[msg.sender].amount -= betValue;
        allEvents[eventId].amount += betValue;

        allEvents[eventId].participants.push(
            Bet({
                gambler: msg.sender,
                bet: prediction,
                betValue: betValue,
                currentOdd: allEvents[eventId].odd
            })
        );
    }

    function closeEventAndPayWinners(
        uint256 eventId,
        uint8 result
    )
        public
        onlyCreator(eventId)
        isRegistered(msg.sender)
        betIsActive(eventId)
    {
        for (uint i = 0; i < allEvents[eventId].participants.length; i++) {
            Bet memory b = allEvents[eventId].participants[i];
            if (b.bet == result) {
                uint256 payout = b.currentOdd * b.betValue;
                require(
                    allEvents[eventId].amount >= payout,
                    "Insufficient funds to pay winners"
                );
                wallets[b.gambler].amount += payout;
                allEvents[eventId].amount -= payout;
            }
        }
        allEvents[eventId].isClosed = true;
        wallets[allEvents[eventId].creator].amount += allEvents[eventId].amount;
        emit BetClosed(eventId, result);
    }

    function changeOdd(
        uint256 eventId,
        uint256 newOdd
    ) public onlyCreator(eventId) {
        allEvents[eventId].odd = newOdd;
        emit OddChange(eventId, newOdd);
    }
}
