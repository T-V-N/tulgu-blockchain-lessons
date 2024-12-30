// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

contract Ownable {
    address public owner;

    error NotOwner();

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert NotOwner();
        }
        _;
    }

    constructor (address _owner) {
        owner = _owner;
    }
}