// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import { ERC721Enumerable } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import { ERC721Burnable } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import { Base64 } from "@openzeppelin/contracts/utils/Base64.sol";
import { Base64Decode } from "./base64.sol";
import { Strings } from "@openzeppelin/contracts/utils/Strings.sol";
import { ICDH } from "./interfaces/ICDH.sol";
import { IERC6551Registry } from "./interfaces/IERC6551Registry.sol";

contract CDH is ICDH, ERC721, ERC721Enumerable, ERC721Burnable {
	// =============================================================
	//                           STORAGE
	// =============================================================
	using Strings for uint256;

	uint256 private _nextTokenId;
	address public erc6551Account;
	address public erc6551Registry;
	uint256 public chainId;

	// string public ipfsBaseUri;

	// tokenId => fieldNumber => fieldValue
	mapping(uint256 => mapping(uint256 => string)) public override metadatas;
	mapping(uint256 => mapping(address => mapping(uint256 => bool)))
		public
		override permittedEditors;
	mapping(uint256 => string) public override fieldNames;
	mapping(uint256 => address) public override fieldOwners;
	Field[] public fields;
	// tokenId => metadata
	mapping(uint256 => string) public override tokenMetadatas;
	// EOA address => tokenId
	mapping(address => uint256) public override eoaToTokenId;

	// tokenId => tbaAccount
	mapping(uint256 => address) public override tokenIdToTbaAccount;
	// EOA address => tbaAccount
	mapping(address => address) public override eoaToTbaAccount;

	// =============================================================
	//                          MODIFIER
	// =============================================================

	/// @notice only owner or permitted
	/// @param tokenId token id
	modifier onlyOwnerOrPermitted(uint256 tokenId, uint256 fieldNumber) {
		if (
			ERC721.ownerOf(tokenId) != msg.sender &&
			permittedEditors[tokenId][msg.sender][fieldNumber] == false
		) {
			revert NotTokenOwnerOrPermitted(tokenId);
		}
		_;
	}

	/// @notice only field owner
	/// @param fieldNumber field number
	modifier onlyFieldOwner(uint256 fieldNumber) {
		if (fieldOwners[fieldNumber] != msg.sender) {
			revert NotFieldOwner(
				fieldNumber,
				msg.sender,
				fieldOwners[fieldNumber]
			);
		}
		_;
	}

	/// @notice not own nft
	/// @param to to
	modifier notOwnNFT(address to) {
		if (balanceOf(to) > 0) {
			revert AlreadyOwnsNFT(to);
		}
		_;
	}

	// =============================================================
	//                          CONSTRUCTOR
	// =============================================================

	constructor(
		string memory name,
		string memory symbol,
		address _erc6551Registry,
		address _erc6551Account
	) ERC721(name, symbol) {
		erc6551Registry = _erc6551Registry;
		erc6551Account = _erc6551Account;
		chainId = 5555;
		// ipfsBaseUri = "https://ipfs.io/ipfs/";
	}

	// =============================================================
	//                         EXTERNAL WRITE
	// =============================================================

	/// @notice safe mint
	/// @param to to
	function safeMint(address to, string calldata uri) public notOwnNFT(to) returns (uint256 tokenId) {
		tokenId = _nextTokenId++;
		_safeMint(to, tokenId);
		address tbaAccount = IERC6551Registry(erc6551Registry).createAccount(
			erc6551Account,
			bytes32(tokenId),
			chainId,
			address(this),
			tokenId
		);
		tokenIdToTbaAccount[tokenId] = tbaAccount;
		eoaToTbaAccount[to] = tbaAccount;
		eoaToTokenId[to] = tokenId;

		// save DACS or IPFS or Arweave
		tokenMetadatas[tokenId] = uri;
	}

	/// @notice set permitted editor
	/// @param tokenId token id
	/// @param editor editor address
	/// @param fieldNumber field number
	/// @param permission permission
	function setPermittedEditor(
		uint256 tokenId,
		address editor,
		uint256 fieldNumber,
		bool permission
	) public override(ICDH) {
		if (ERC721.ownerOf(tokenId) != msg.sender) {
			revert UnauthorizedCaller();
		}
		permittedEditors[tokenId][editor][fieldNumber] = permission;
		emit EditorPermissionChanged(tokenId, editor, permission);
	}

	/// @notice add metadata
	/// @param tokenId token id
	/// @param fieldNumber field number
	/// @param fieldValue field value
	function addMetadata(
		uint256 tokenId,
		uint256 fieldNumber,
		string memory fieldValue
	) public override(ICDH) onlyOwnerOrPermitted(tokenId, fieldNumber) {
		if (bytes(metadatas[tokenId][fieldNumber]).length != 0) {
			revert MetadataAlreadyExists(tokenId, fieldNumber);
		}
		metadatas[tokenId][fieldNumber] = fieldValue;
		// add field to DACS or ...
		_addTokenMetadata(tokenId, fieldNumber, fieldValue);
		emit MetadataAdded(tokenId, fieldNumber, fieldValue);
	}

	/// @notice update metadata
	/// @param tokenId token id
	/// @param fieldNumber field number
	/// @param newValue new value
	function updateMetadata(
		uint256 tokenId,
		uint256 fieldNumber,
		string memory newValue
	) public override(ICDH) onlyOwnerOrPermitted(tokenId, fieldNumber) {
		if (bytes(metadatas[tokenId][fieldNumber]).length == 0) {
			revert MetadataDoesNotExist(tokenId, fieldNumber);
		}
		metadatas[tokenId][fieldNumber] = newValue;
		emit MetadataUpdated(tokenId, fieldNumber, newValue);
	}

	/// @notice register field name
	/// @param fieldNumber field number
	/// @param fieldName field name
	function registerFieldName(
		uint256 fieldNumber,
		string calldata fieldName
	) public override {
		if (bytes(fieldNames[fieldNumber]).length != 0) {
			revert FieldNameAlreadyExists(fieldNumber);
		}
		fieldNames[fieldNumber] = fieldName;
		fieldOwners[fieldNumber] = msg.sender;
		fields.push(Field(fieldName, fieldNumber, msg.sender));
	}

	/// @notice update field name
	/// @param fieldNumber field number
	/// @param newFieldName new field name
	function updateFieldName(
		uint256 fieldNumber,
		string calldata newFieldName
	) public onlyFieldOwner(fieldNumber) {
		if (bytes(fieldNames[fieldNumber]).length == 0) {
			revert FieldNameDoesNotExist(fieldNumber);
		}
		if (bytes(newFieldName).length == 0) {
			revert InvalidFieldName(newFieldName);
		}
		fieldNames[fieldNumber] = newFieldName;
		fields[fieldNumber].name = newFieldName;
	}

	// =============================================================
	//                          INTERNAL WRITE
	// =============================================================

	/// @notice add token metadata
	/// @param tokenId token id
	/// @param fieldNumber field number
	/// @param newValue new value
	function _addTokenMetadata(
		uint256 tokenId,
		uint256 fieldNumber,
		string memory newValue
	) internal {
		// Decode the existing metadata
		string memory decodedMetadata = Base64Decode.decode(
			tokenMetadatas[tokenId]
		);

		// Remove the trailing '}' character to add new fields
		bytes memory trimmedMetadataBytes = bytes(decodedMetadata);
		trimmedMetadataBytes[trimmedMetadataBytes.length - 1] = ""; // Remove last character

		// Create new metadata with additional field
		string memory newMetadata = string(
			abi.encodePacked(
				trimmedMetadataBytes,
				', "',
				Strings.toString(fieldNumber),
				'": "',
				newValue,
				'"}'
			)
		);

		// Encode the updated metadata
		tokenMetadatas[tokenId] = string(
			abi.encodePacked(
				"data:application/json;base64,",
				Base64.encode(bytes(newMetadata))
			)
		);
	}

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
	/// @param fieldNumber field number
	function getMetadata(
		uint256 tokenId,
		uint256 fieldNumber
	) public view override(ICDH) returns (string memory) {
		return metadatas[tokenId][fieldNumber];
	}

	/// @notice get owners
	/// @param amount amount
	/// @param from starting index
	function getOwners(
		uint256 amount,
		uint256 from
	) public view returns (address[] memory, address[] memory) {
		uint256 total = totalSupply();
		if (from >= total) {
			return (new address[](0), new address[](0));
		}

		uint256 validAmount = (from + amount > total) ? total - from : amount;
		address[] memory owners = new address[](validAmount);
    	address[] memory tbaAccounts = new address[](validAmount);

		for (uint256 i = 0; i < validAmount; i++) {
			address owner = ownerOf(from + i);
			owners[i] = owner;
			tbaAccounts[i] = eoaToTbaAccount[owner];
		}

		return (owners, tbaAccounts);
	}

	function getFields(uint256 amount, uint256 from) public view returns (Field[] memory) {
		uint256 total = fields.length;
		if (from >= total) {
			return new Field[](0);
		}

		uint256 validAmount = (from + amount > total) ? total - from : amount;
		Field[] memory _fields = new Field[](validAmount);
		for (uint256 i = 0; i < validAmount; i++) {
			_fields[i] = fields[from + i];
		}
		return _fields;
	}

	/// @notice token uri
	/// @param tokenId token id
	function tokenURI(
		uint256 tokenId
	) public view override(ICDH, ERC721) returns (string memory) {
		return tokenMetadatas[tokenId];
	}

	/// @notice supports interface
	/// @param interfaceId interface id
	function supportsInterface(
		bytes4 interfaceId
	) public view override(ERC721, ERC721Enumerable) returns (bool) {
		return super.supportsInterface(interfaceId);
	}

	// =============================================================
	//                         SBT
	// =============================================================

	/// @notice Override to disable transfer functionality
	function setApprovalForAll(
		address operator,
		bool approved
	) public pure override(ERC721, IERC721) {
		revert SoulboundToken();
	}

	function approve(
		address to,
		uint256 tokenId
	) public pure override(ERC721, IERC721) {
		revert SoulboundToken();
	}

	function transferFrom(
		address from,
		address to,
		uint256 tokenId
	) public pure override(ERC721, IERC721) {
		revert SoulboundToken();
	}

	function safeTransferFrom(
		address from,
		address to,
		uint256 tokenId,
		bytes memory _data
	) public pure override(ERC721, IERC721) {
		revert SoulboundToken();
	}
}
