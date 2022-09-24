// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Test {
    uint256 public a;

    function show(uint256 _newA) public returns (uint256) {
        a = _newA;
        return a;
    }
}
