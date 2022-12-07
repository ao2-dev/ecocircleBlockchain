// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract EcoStatistics is Ownable {
    mapping(uint => Student) ranks;

    struct Student {
        string phone;
        int256 point;
        int256 schoolId;
    }

    string public allRanks;

    function setRank(
        uint _rank,
        string memory _phone,
        int256 _point,
        int256 _schoolId
    ) public onlyOwner {
        Student memory std = Student(_phone, _point, _schoolId);
        ranks[_rank] = std;
    }

    function getStudentByRank(uint _rank) public view returns (Student memory) {
        return ranks[_rank];
    }

    function setAllRanks(string memory _ranks) public onlyOwner {
        allRanks = _ranks;
    }
}
