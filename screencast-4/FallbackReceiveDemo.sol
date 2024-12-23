// SPDX-License-Identifier: MIT

pragma solidity 0.8.26;

contract FallbackReceiveDemo {
    event Received(address sender, uint256 amount);
    event Fallback();

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    fallback() external payable {
        emit Fallback();
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}