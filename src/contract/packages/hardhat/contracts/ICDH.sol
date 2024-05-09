// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

interface ICDH {
	// =============================================================
	//                           ERROR
	// =============================================================

	error NotTokenOwnerOrPermitted(uint256 tokenId);
	error UnauthorizedCaller();
	error MetadataAlreadyExists(uint256 tokenId, string fieldName);
	error MetadataDoesNotExist(uint256 tokenId, string fieldName);

	// =============================================================
	//                           EVENT
	// =============================================================

	event EditorPermissionChanged(
		uint256 indexed tokenId,
		address indexed editor,
		bool permission
	);
	event MetadataAdded(
		uint256 indexed tokenId,
		string fieldName,
		string fieldValue
	);
	event MetadataUpdated(
		uint256 indexed tokenId,
		string fieldName,
		string newValue
	);

	// =============================================================
	//                         EXTERNAL WRITE
	// =============================================================

	function safeMint(address to, string calldata uri) external;

	function setPermittedEditor(
		uint256 tokenId,
		address editor,
		string memory fieldName,
		bool permission
	) external;

	function addMetadata(
		uint256 tokenId,
		string calldata fieldName,
		string calldata fieldValue
	) external;

	function updateMetadata(
		uint256 tokenId,
		string calldata fieldName,
		string calldata newValue
	) external;

	// =============================================================
	//                         EXTERNAL VIEW
	// =============================================================

	function getMetadata(
		uint256 tokenId,
		string calldata fieldName
	) external view returns (string memory);

	function tokenURI(uint256 tokenId) external view returns (string memory);
}
