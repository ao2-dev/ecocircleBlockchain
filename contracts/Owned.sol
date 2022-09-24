// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// 소유자 관리용 계약
contract Owned {
    // 상태 변수
    address public owner; // 소유자 주소

    // 소유자 변경 시 이벤트
    event TransferOwnership(address oldaddr, address newaddr);

    // 소유자 한정 메서드용 수식자
    modifier onlyOwner() {
        require(msg.sender == owner, "onlyOwner");
        _;
    }

    // 생성자
    constructor() {
        owner = msg.sender; // 처음에 계약을 생성한 주소를 소유자로 한다
    }

    // (1) 소유자 변경
    function transferOwnership(address _new) public onlyOwner {
        address oldaddr = owner;
        owner = _new;
        emit TransferOwnership(oldaddr, owner);
    }
}
