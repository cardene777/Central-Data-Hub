// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity 0.8.25;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { ERC721URIStorage } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import { ERC721Burnable } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { Strings } from "@openzeppelin/contracts/utils/Strings.sol";

contract SampleERC721 is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
	using Strings for uint256;
	uint256 private _nextTokenId;

	constructor(
		address initialOwner
	) ERC721("SampleERC721", "SE721") Ownable(initialOwner) {}

	function _baseURI() internal pure override returns (string memory) {
		return
			"https://res.cloudinary.com/dplp5wtzk/image/upload/v1721314823/monster/";
	}

	function mint(address to) public {
		uint256 tokenId = _nextTokenId++;
		_safeMint(to, tokenId);
		uint256 imageIndex = tokenId % 5;
		string memory uri = string.concat(imageIndex.toString(), ".png");
		_setTokenURI(tokenId, uri);
	}

	// The following functions are overrides required by Solidity.

	function tokenURI(
		uint256 tokenId
	) public view override(ERC721, ERC721URIStorage) returns (string memory) {
		return super.tokenURI(tokenId);
	}

	function supportsInterface(
		bytes4 interfaceId
	) public view override(ERC721, ERC721URIStorage) returns (bool) {
		return super.supportsInterface(interfaceId);
	}
}
