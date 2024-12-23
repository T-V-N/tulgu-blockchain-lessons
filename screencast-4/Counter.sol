// SPDX-License-Identifier: MIT

pragma solidity 0.8.26;

contract Counter {
    uint private callCount;

    function increaseCount() public {
        callCount++;
    }

    function getCount() public view returns (uint256) {
        return callCount;
    }
}

