// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "contracts/Ownable.sol";
import "contracts/Token.sol";

contract factoryForSomeContract is Ownable {
    bool public disabled = false;

    event newToken(address);

    error FactoryDisabled();

    constructor() Ownable(msg.sender) {}

    function createContract(string memory name, string memory symbol) public returns (address) {
        if (disabled) {
            revert FactoryDisabled();
        }

        Token sc = new Token(msg.sender, name, symbol);

        emit newToken(address(sc));

        return address(sc);
    }

    function toggleDisabled() public onlyOwner {
        disabled = !disabled;
    }

    function transferOwnership(address _newOwner) public onlyOwner {
        owner = _newOwner;
    }
}