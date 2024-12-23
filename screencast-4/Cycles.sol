// SPDX-License-Identifier: MIT

pragma solidity 0.8.26;

contract CyclesCount {
    uint256 public counter;

    constructor () {
        counter = 0;
    }

    function IncreaseCounterLoop(uint256 times) public {
        if (times == 0) {
            revert("Error, loop count cant be 0");
        } else {
            for (uint256 i = 0; i < times; i++) {
                counter++;
            }
        }
    }

    function increaseWhileLoop(uint256 times) public {
        uint256 loopedTimes = 0;
        while(times > loopedTimes) {
            counter++;
            loopedTimes++;
        }
    }
}