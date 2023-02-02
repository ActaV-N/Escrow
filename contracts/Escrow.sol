// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;
pragma experimental ABIEncoderV2;

contract Escrow{
    address depositer;
    address arbiter;
    address beneficiary;

    bool isApproved;

    // Constructor
    constructor(address _arbiter, address _beneficiary) payable{
        require(msg.value >= 0.1 ether);
        depositer = msg.sender;
        arbiter = _arbiter;
        beneficiary = _beneficiary;
    }

    // Approve
    event Approve(uint amount);
    function approve() external {
        require(msg.sender == arbiter, "Only arbiter can approve");
        require(!isApproved, "Only unapproved contract can be approved");
        
        uint amount = address(this).balance;
        (bool success, ) = beneficiary.call{value: amount}("");
        require(success);

        isApproved = true;
        emit Approve(amount);
    }
}