// SPDX-License-Identifier: MIT

pragma solidity 0.8.26;

contract Events {
    event FunctionCall(address);

    error SimpleError(bool shouldWorry);

    function ProduceEvent() public {
        revert SimpleError(false);
        emit FunctionCall(msg.sender);
    }

    function someLogic(bool produceError) public {
        if (produceError) {
            revert SimpleError(true);
        }
    }
}