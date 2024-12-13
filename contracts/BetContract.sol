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
        uint256 odd;
        bool isClosed;
        uint256 amount;
        Bet[] participants;
    }

    Event[] allEvents;

    event EventCreated(uint256 indexed id, string eventType, uint256 odd);
    event BetClosed(uint256 indexed id, uint8 result);
    event UserRegistered(address indexed client);
    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);
    event OddChange(uint256 eventId, uint256 newOdd);

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


    mapping(address => bool) public isRegistered;

    modifier onlyRegistered() {
        require(isRegistered[msg.sender], "Usuario nao registrado");
        _;
    }

    function register() public {
        require(!isRegistered[msg.sender], "Usuario ja existe");
        isRegistered[msg.sender] = true;

        emit UserRegistered(msg.sender);
    }

    function deposit() public payable onlyRegistered {
        require(msg.value > 0, "Valor deve ser maior que 0");
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) public onlyRegistered {
        require(
            address(this).balance >= amount,
            "Saldo do contrato insuficiente"
        );
        require(amount > 0, "Valor deve ser maior que 0");

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Falha ao transferir fundos");

        emit Withdrawal(msg.sender, amount);
    }

    function getBalance() public view onlyRegistered returns (uint256) {
        return address(this).balance;
    }

    function createEvent(string memory eventType, uint256 odd) public
    onlyRegistered() {
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
        onlyRegistered()
    {
        require(betValue > 0, "Valor nao permitido");
        require(
            address(this).balance >= betValue,
            "Saldo insuficiente no contrato"
        );

        address(this).call{value: betValue}("");

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
        onlyRegistered()
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
                allEvents[eventId].amount -= payout;
                (bool successPayWinners, ) = b.gambler.call{value: payout}("");
                require(successPayWinners, "Falha ao pagar ganhadores");
            }
        }
        allEvents[eventId].isClosed = true;
        (bool success, ) = allEvents[eventId].creator.call{value: allEvents[eventId].amount}(
            ""
        );
        require(success, "Falha ao transferir fundos restantes para o criador");
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