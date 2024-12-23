// SPDX-License-Identifier: MIT

pragma solidity 0.8.26;

library Float {
    type f128 is uint256;

    function fromParts(uint128 integerPart, uint128 fractionPart) internal pure returns  (f128) {
        uint256 value = (uint256(integerPart) << 128) | uint256(fractionPart);
        return f128.wrap(value);
    }

    function add(f128 a, f128 b) internal pure returns (f128)
    {
        uint256 sum = f128.unwrap(a) + f128.unwrap(b);
        return f128.wrap(sum);
    }

    function integerPart(f128 value) internal pure returns (uint128) {
        return uint128(f128.unwrap(value) >> 128);
    }

    function fractionalPart(f128 value) internal pure returns (uint128) {
        return uint128(f128.unwrap(value) & ((1<<128) - 1));
    }
}

contract DemoContract {
    using Float for Float.f128;

    Float.f128 public numberA;
    Float.f128 public numberB;
    Float.f128 public sumAB;

    function setNumbersAndAdd(uint128 intA, uint128 fracA, uint128 intB, uint128 fracB) external {
        numberA = Float.fromParts(intA, fracA);
        numberB = Float.fromParts(intB, fracB);
        sumAB = Float.add(numberA, numberB);
    }

    function getSumIntegerPart() external view returns (uint128) {
        return sumAB.integerPart();
    }

    function getSumFractionPart() external view returns (uint128) {
        return sumAB.fractionalPart();
    }
}