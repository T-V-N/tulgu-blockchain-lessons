// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "contracts/Ownable.sol";
import "contracts/ERC20.sol";

contract Token is Ownable, ERC20 {
    constructor(address owner, string memory name, string memory symbol) Ownable(owner) ERC20(name, symbol) {}

    function mint(address _to, uint256 _amount) public onlyOwner {
        totalSupply += _amount;
        balanceOf[_to] += _amount;
        emit Transfer(address(0), _to, _amount);
    }
}
