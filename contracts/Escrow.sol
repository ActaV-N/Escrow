// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;
pragma experimental ABIEncoderV2;

contract Escrow{
    address public depositer;
    address public arbiter;
    address public beneficiary;

    bool public isApproved;
    string public product;

    // Constructor
    constructor(address _arbiter, address _beneficiary, string memory _product) payable{
        require(msg.value >= 0.1 ether);
        depositer = msg.sender;
        arbiter = _arbiter;
        beneficiary = _beneficiary;
        product = _product;
    }

    // Approve
    event Approved(uint amount, string product);
    function approve() external {
        require(msg.sender == arbiter, "Only arbiter can approve");
        require(!isApproved, "Only unapproved contract can be approved");
        
        uint amount = address(this).balance;
        (bool success, ) = beneficiary.call{value: amount}("");
        require(success);

        isApproved = true;
        emit Approved(amount, product);
    }
}