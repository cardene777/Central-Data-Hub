// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity 0.8.25;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC1155Burnable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import {ERC1155Supply} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract SampleERC1155 is ERC1155, Ownable, ERC1155Burnable, ERC1155Supply {
    using Strings for uint256;

    constructor(address initialOwner) ERC1155("https://res.cloudinary.com/dplp5wtzk/image/upload/v1721314823/monster/") Ownable(initialOwner) {}

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function mint(address account, uint256 id, uint256 amount)
        public
    {
        _mint(account, id, amount, "");
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
    }

    // The following functions are overrides required by Solidity.

    function uri(uint256 tokenId)
        public
        pure
        override
        returns (string memory)
    {
        uint256 imageIndex = (tokenId % 5) + 5;
        string memory base = _baseURI();
        return string(abi.encodePacked(base, imageIndex.toString(), ".png"));
    }

    function _baseURI() internal pure returns (string memory) {
        return "https://res.cloudinary.com/dplp5wtzk/image/upload/v1721314823/monster/";
    }

    function _update(address from, address to, uint256[] memory ids, uint256[] memory values)
        internal
        override(ERC1155, ERC1155Supply)
    {
        super._update(from, to, ids, values);
    }
}
