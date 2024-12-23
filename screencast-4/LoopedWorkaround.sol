// SPDX-License-Identifier: MIT

pragma solidity 0.8.26;

contract LoopedWorkaround {
    bool[4000] public flags;

    function isLastFlagTrue() public view returns (bool) {
        return flags[flags.length - 1];
    }

    function iterateOverFlags() public {
        uint256 length = flags.length;

        for (uint i = 0; i < length; i++) {
            flags[i] = true;
        }
    }

    uint256 public offset = 0;

    function iterateOverFlagsSafe(uint256 loopSize) public {
        uint256 iterations = flags.length - offset > loopSize 
            ? loopSize 
            : flags.length - offset;
        
        for (uint i = 0; i < iterations; i++) {
            flags[i + offset] = true;
        }

        offset += iterations;
    }
}