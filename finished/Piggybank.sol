pragma solidity ^0.4.0;

contract PiggyBank {
    uint256 private balance;
    address public owner;

    function PiggyBank() public {
        owner = msg.sender;
        balance = 0;
    }

    function deposit() public payable returns (uint256) {
        balance += msg.value;
        return balance;
    }

    function withdraw(uint256 withdrawAmount)
        public
        returns (uint256 remainingBal)
    {
        require(msg.sender == owner);
        balance -= withdrawAmount;

        msg.sender.transfer(withdrawAmount);

        return balance;
    }
}
