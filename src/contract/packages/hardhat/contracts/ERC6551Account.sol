// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

// https://github.com/erc6551/reference/blob/main/src/examples/simple/ERC6551Account.sol

import { IERC165 } from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import { IERC1271 } from "@openzeppelin/contracts/interfaces/IERC1271.sol";
import { SignatureChecker } from "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import { IERC721Receiver } from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import { IERC1155Receiver } from "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";

interface IERC6551Account {
	receive() external payable;

	function token()
		external
		view
		returns (uint256 chainId, address tokenContract, uint256 tokenId);

	function state() external view returns (uint256);

	function isValidSigner(
		address signer,
		bytes calldata context
	) external view returns (bytes4 magicValue);
}

interface IERC6551Executable {
	function execute(
		address to,
		uint256 value,
		bytes calldata data,
		uint8 operation
	) external payable returns (bytes memory);
}

contract ERC6551Account is
	IERC165,
	IERC1271,
	IERC6551Account,
	IERC6551Executable,
	IERC721Receiver,
	IERC1155Receiver
{
	uint256 public state;

	receive() external payable {}

	function execute(
		address to,
		uint256 value,
		bytes calldata data,
		uint8 operation
	) external payable virtual returns (bytes memory result) {
		require(_isValidSigner(msg.sender), "Invalid signer");
		require(operation == 0, "Only call operations are supported");

		++state;

		bool success;
		(success, result) = to.call{ value: value }(data);

		if (!success) {
			assembly {
				revert(add(result, 32), mload(result))
			}
		}
	}

	function isValidSigner(
		address signer,
		bytes calldata
	) external view virtual returns (bytes4) {
		if (_isValidSigner(signer)) {
			return IERC6551Account.isValidSigner.selector;
		}

		return bytes4(0);
	}

	function isValidSignature(
		bytes32 hash,
		bytes memory signature
	) external view virtual returns (bytes4 magicValue) {
		bool isValid = SignatureChecker.isValidSignatureNow(
			owner(),
			hash,
			signature
		);

		if (isValid) {
			return IERC1271.isValidSignature.selector;
		}

		return bytes4(0);
	}

	function supportsInterface(
		bytes4 interfaceId
	) public view virtual returns (bool) {
		return
			interfaceId == type(IERC165).interfaceId ||
			interfaceId == type(IERC6551Account).interfaceId ||
			interfaceId == type(IERC6551Executable).interfaceId;
	}

	function token() public view virtual returns (uint256, address, uint256) {
		bytes memory footer = new bytes(0x60);

		assembly {
			extcodecopy(address(), add(footer, 0x20), 0x4d, 0x60)
		}

		return abi.decode(footer, (uint256, address, uint256));
	}

	function owner() public view virtual returns (address) {
		(uint256 chainId, address tokenContract, uint256 tokenId) = token();
		if (chainId != block.chainid) return address(0);

		return IERC721(tokenContract).ownerOf(tokenId);
	}

	function _isValidSigner(
		address signer
	) internal view virtual returns (bool) {
		return signer == owner();
	}

	function onERC721Received(
		address operator,
		address from,
		uint256 tokenId,
		bytes calldata data
	) external pure override returns (bytes4) {
		return IERC721Receiver.onERC721Received.selector;
	}

	function onERC1155Received(
		address operator,
		address from,
		uint256 id,
		uint256 value,
		bytes calldata data
	) external pure override returns (bytes4) {
		return IERC1155Receiver.onERC1155Received.selector;
	}

	function onERC1155BatchReceived(
		address operator,
		address from,
		uint256[] calldata ids,
		uint256[] calldata values,
		bytes calldata data
	) external pure override returns (bytes4) {
		return IERC1155Receiver.onERC1155BatchReceived.selector;
	}
}
