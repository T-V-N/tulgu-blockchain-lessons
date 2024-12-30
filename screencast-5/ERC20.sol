// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "contracts/IERC20.sol";

contract ERC20 is IERC20 {
    string public name; // SomeToken
    string public symbol; // ST
    uint8 public decimals = 18; 
    uint256 public totalSupply;

    error NotEnough();
    error AllowanceError();

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping (address => uint256)) public allowance;

    constructor(string memory _name, string memory _symbol) {
        name = _name;
        symbol = _symbol;
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        if (balanceOf[msg.sender] < _value) {
            revert NotEnough();
        }

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        if (balanceOf[_from] < _value) {
            revert NotEnough();
        }

        if (allowance[_from][msg.sender] < _value) {
            revert AllowanceError();
        }

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        allowance[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);

        return true;
    }
}