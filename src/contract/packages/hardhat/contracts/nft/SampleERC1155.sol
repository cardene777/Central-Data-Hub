// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC1155Burnable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import {ERC1155Supply} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";

contract SampleERC1155 is ERC1155, Ownable, ERC1155Burnable, ERC1155Supply {
    using Strings for uint256;

    string private _baseUri;

    constructor(address initialOwner, string memory baseUri) ERC1155(baseUri) Ownable(initialOwner) {
        _baseUri = baseUri;
    }

    function setURI(string memory newuri) public onlyOwner {
        _baseUri = newuri;
    }

    function mint(address account, uint256 id, uint256 amount) public {
        _mint(account, id, amount, "");
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
    }

    // The following functions are overrides required by Solidity.

    function uri(uint256 tokenId) public view override returns (string memory) {

        uint256 imageIndex = tokenId % 5;
        string memory imageURI = string(abi.encodePacked(_baseUri, imageIndex.toString(), ".png"));

        string memory json = string(
            abi.encodePacked(
                '{"name": "CDH Sample ERC1155 #',
                tokenId.toString(),
                '", "description": "This is CDH Sample ERC1155 #',
                tokenId.toString(),
                '", "image": "',
                imageURI,
                '"}'
            )
        );

        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(bytes(json))
            )
        );
    }

    function _update(address from, address to, uint256[] memory ids, uint256[] memory values)
        internal
        override(ERC1155, ERC1155Supply)
    {
        super._update(from, to, ids, values);
    }
}
