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

contract CounterFactory {
    event CounterCreated(address counter);

    function createCounter() public returns (address) {
        Counter newCounter = new Counter();
        emit CounterCreated(address(newCounter));
        return address(newCounter);
    }
}