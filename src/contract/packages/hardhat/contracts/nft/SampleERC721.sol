// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Burnable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";

contract SampleERC721 is ERC721, ERC721Burnable, Ownable {
    using Strings for uint256;

    uint256 private _nextTokenId;
    string private _baseUri;

    constructor(
        address initialOwner,
        string memory name,
        string memory symbol,
        string memory baseUri
    ) ERC721(name, symbol) Ownable(initialOwner) {
        _baseUri = baseUri;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseUri;
    }

    function mint(address to) public {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721)
        returns (string memory)
    {
        uint256 imageIndex = tokenId % 5;
        string memory imageURI = string(abi.encodePacked(_baseURI(), imageIndex.toString(), ".png"));

        string memory json = string(
            abi.encodePacked(
                '{"name": "CDH Sample ERC721 #',
                tokenId.toString(),
                '", "description": "This is CDH Sample ERC721 #',
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

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function setBaseUri(string memory baseUri) public onlyOwner {
        _baseUri = baseUri;
    }
}
