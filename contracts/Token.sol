// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20, Ownable {
    event MintOrBurn(address indexed from, address indexed to, uint256 amount);

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

    function burnFromOwner(uint256 amount) public onlyOwner {
        _burn(owner(), amount);
    }

    function burn(address account, uint256 amount) public {
       _burn(account, amount);
    }

    function decimals() public view virtual override returns (uint8) {
        return 0;
    }

    function test() public view returns (address) {
        return _msgSender();
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        emit MintOrBurn(from, to, amount);
    }
}
