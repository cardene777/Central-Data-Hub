// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { ERC721Enumerable } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import { ERC721URIStorage } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";
import { ERC721Burnable } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import { ICDH } from "./ICDH.sol";

contract CDH is
	ICDH,
	ERC721,
	ERC721Enumerable,
	ERC721URIStorage,
	AccessControl,
	ERC721Burnable
{
	// =============================================================
	//                           STORAGE
	// =============================================================

	bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
	uint256 private _nextTokenId;
	// tokenId => fieldName => fieldValue
	mapping(uint256 => mapping(string => string)) public metadatas;
	mapping(uint256 => mapping(address => mapping(string => bool))) public permittedEditors;

	// =============================================================
	//                          MODIFIER
	// =============================================================

    /// @notice only owner or permitted
    /// @param tokenId token id
	modifier onlyOwnerOrPermitted(uint256 tokenId, string memory fieldName) {
		if (
			ERC721.ownerOf(tokenId) != msg.sender &&
			permittedEditors[tokenId][msg.sender][fieldName] == false
		) {
			revert NotTokenOwnerOrPermitted(tokenId);
		}
		_;
	}
	// =============================================================
	//                          CONSTRUCTOR
	// =============================================================

	constructor(string memory name, string memory symbol) ERC721(name, symbol) {
		_grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
		_grantRole(MINTER_ROLE, msg.sender);
	}

	// =============================================================
	//                         EXTERNAL WRITE
	// =============================================================

    /// @notice safe mint
    /// @param to to
    /// @param uri uri
	function safeMint(
		address to,
		string memory uri
	) public onlyRole(MINTER_ROLE) {
		uint256 tokenId = _nextTokenId++;
		_safeMint(to, tokenId);
		_setTokenURI(tokenId, uri);
	}

    /// @notice set permitted editor
    /// @param tokenId token id
    /// @param editor editor address
    /// @param fieldName field name
    /// @param permission permission
	function setPermittedEditor(
		uint256 tokenId,
		address editor,
        string memory fieldName,
		bool permission
	) public override(ICDH) {
		if (ERC721.ownerOf(tokenId) != msg.sender) {
			revert UnauthorizedCaller();
		}
		permittedEditors[tokenId][editor][fieldName] = permission;
        emit EditorPermissionChanged(tokenId, editor, permission);
	}

	/// @notice add metadata
	/// @param tokenId token id
	/// @param fieldName field name
	/// @param fieldValue field value
	function addMetadata(
		uint256 tokenId,
		string memory fieldName,
		string memory fieldValue
	) public onlyOwnerOrPermitted(tokenId, fieldName) override(ICDH) {
		if (bytes(metadatas[tokenId][fieldName]).length != 0) {
			revert MetadataAlreadyExists(tokenId, fieldName);
		}
		metadatas[tokenId][fieldName] = fieldValue;
        emit MetadataAdded(tokenId, fieldName, fieldValue);
	}

	/// @notice update metadata
	/// @param tokenId token id
	/// @param fieldName field name
	/// @param newValue new value
	function updateMetadata(
		uint256 tokenId,
		string memory fieldName,
		string memory newValue
	) public onlyOwnerOrPermitted(tokenId, fieldName) override(ICDH) {
		if (bytes(metadatas[tokenId][fieldName]).length == 0) {
			revert MetadataDoesNotExist(tokenId, fieldName);
		}
		metadatas[tokenId][fieldName] = newValue;
        emit MetadataUpdated(tokenId, fieldName, newValue);
	}

	// =============================================================
	//                          INTERNAL WRITE
	// =============================================================

    /// @notice update
    /// @param to to
    /// @param tokenId token id
    /// @param auth auth
	function _update(
		address to,
		uint256 tokenId,
		address auth
	) internal override(ERC721, ERC721Enumerable) returns (address) {
		return super._update(to, tokenId, auth);
	}

    /// @notice increase balance
    /// @param account account
    /// @param value value
	function _increaseBalance(
		address account,
		uint128 value
	) internal override(ERC721, ERC721Enumerable) {
		super._increaseBalance(account, value);
	}

	// =============================================================
	//                         EXTERNAL VIEW
	// =============================================================

	/// @notice get metadata
	/// @param tokenId token id
	/// @param fieldName field name
	function getMetadata(
		uint256 tokenId,
		string memory fieldName
	) public view override(ICDH) returns (string memory) {
		return metadatas[tokenId][fieldName];
	}

    /// @notice token uri
    /// @param tokenId token id
	function tokenURI(
		uint256 tokenId
	) public view override(ICDH, ERC721, ERC721URIStorage) returns (string memory) {
		return super.tokenURI(tokenId);
	}

    /// @notice supports interface
    /// @param interfaceId interface id
	function supportsInterface(
		bytes4 interfaceId
	)
		public
		view
		override(ERC721, ERC721Enumerable, ERC721URIStorage, AccessControl)
		returns (bool)
	{
		return super.supportsInterface(interfaceId);
	}
}
