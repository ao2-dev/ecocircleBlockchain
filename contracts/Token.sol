// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20, Ownable {
    constructor(
        uint256 initialSupply,
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) {
        _mint(msg.sender, initialSupply);
    }

    function mint(uint256 amount) public onlyOwner {
        _mint(owner(), amount);
    }

    function burn(uint256 amount) public onlyOwner {
        _burn(owner(), amount);
    }

    function decimals() public view virtual override returns (uint8) {
        return 0;
    }

    function test() public view returns (address) {
        return _msgSender();
    }
}
