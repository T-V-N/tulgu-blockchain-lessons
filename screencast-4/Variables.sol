// SPDX-License-Identifier: MIT

pragma solidity 0.8.26;

contract Variables {
    // int
    int256 a = -1000000;
    uint256 b = 100;

    function arithmetic(uint256 x, uint256 y) public pure returns (uint256) {
        return x + y;
    }

    function isEqual(uint256 x, uint256 y) public pure returns (bool) {
        return x == y;
    }

    function bitwise(uint256 x, uint256 y) public pure returns (uint256) {
        return x & y;
    }

    // bool
    bool public flag = true;

    function toggleFlag() public {
        flag = !flag;
    }

    // address 
    address public someone;

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    //string / bytes
    string public hey = "hey";
    bytes public data;
    bytes8 public smallData;

    // enum
    enum Status { Active, Suspended }
    Status public currentStatus = Status.Active;

    function isActive() public view returns (bool) {
        if (currentStatus == Status.Active) {
            return true;
        }

        return false;
    }

    function toggleStatus(Status newStatus) public {
        currentStatus = newStatus;
    }

    struct User {
        string name;
        uint age;
    }

    User public user;

    function setUser(string memory _name, uint _age) public {
        user = User(_name, _age);
    }

    function getUserName() public view returns (string memory) {
        return user.name;
    }

    // arrays
    uint[5] public arr;
    uint[] public arr2;

    function add(uint val) public {
        arr2.push(val);
    }

    function removeLast() public {
        arr2.pop();
    }

    function getLength() public view returns (uint) {
        return arr2.length;
    }

    function getAtIndex(uint index) public view returns (uint) {
        return arr2[index];
    }

    // mapping
    mapping(address => uint) public balances;

    function setBalance(address userAddress, uint v) public {
        balances[userAddress] = v;
    }
}