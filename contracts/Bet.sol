// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Betting {
    struct Bet {
        string description;
        address creator;
        uint256 amount;
        bool active;
        mapping(address => uint256) bets;
        address[] participants;
    }

    uint256 public betCount;
    mapping(uint256 => Bet) public bets;

    event BetCreated(
        uint256 betId,
        string description,
        address creator,
        uint256 amount
    );
    event BetPlaced(uint256 betId, address participant, uint256 amount);
    event BetClosed(uint256 betId);

    modifier onlyCreator(uint256 _betId) {
        require(
            msg.sender == bets[_betId].creator,
            "Apenas o criador pode realizar esta acao"
        );
        _;
    }

    modifier creatorCanNotBet(uint256 _betId) {
        require(
            msg.sender != bets[_betId].creator,
            "Criador da aposta nao pode apostar"
        );
        _;
    }

    modifier betIsActive(uint256 _betId) {
        require(bets[_betId].active, "A aposta nao esta mais ativa");
        _;
    }

    function createBet(string memory _description, uint256 _amount) public {
        betCount++;
        Bet storage newBet = bets[betCount];
        newBet.description = _description;
        newBet.creator = msg.sender;
        newBet.amount = _amount;
        newBet.active = true;

        emit BetCreated(betCount, _description, msg.sender, _amount);
    }

    function placeBet(
        uint256 _betId
    ) public payable betIsActive(_betId) creatorCanNotBet(_betId) {
        Bet storage bet = bets[_betId];
        require(
            msg.value >= bet.amount,
            "Valor enviado menor que o necessario para a aposta"
        );
        require(bet.bets[msg.sender] == 0, "Voce ja participou desta aposta");

        bet.bets[msg.sender] = msg.value;
        bet.participants.push(msg.sender);

        emit BetPlaced(_betId, msg.sender, msg.value);
    }

    function closeBet(
        uint256 _betId
    ) public onlyCreator(_betId) betIsActive(_betId) {
        bets[_betId].active = false;
        emit BetClosed(_betId);
    }

    function getParticipants(
        uint256 _betId
    ) public view returns (address[] memory) {
        return bets[_betId].participants;
    }

    function getBetAmount(
        uint256 _betId,
        address _participant
    ) public view returns (uint256) {
        return bets[_betId].bets[_participant];
    }
}
