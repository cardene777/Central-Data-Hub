# CVCIP-1: Central Data Hub (CDH)

NFT for centralised management of all data.

## Abstract

NFT contract to manage all data in one place.
Various data can be placed in on-chain storage called "DACS" in the Cross Value Chain.
This data can be managed by the NFT and can be changed as desired by the NFT holder or Dapps.
The NFT can also be used by various Dapps by storing the URLs of the data stored in the various "DACS" in the metadata and contracts.
This allows mutual access between Dapps and the CDH to play the role of a data centre.

Translated with www.DeepL.com/Translator (free version)

## Motivation

The NFT metadata used by Ethereum and other NFTs contains very little data such as "name", "description" and "image".
Some NFTs allow customisation of metadata freely, but they are only aware of the marketplaces such as Opensea, and do not make full use of the metadata.
Extending this metadata to define a variety of fields will broaden the use of NFTs.
The Cross Value Chain natively supports the on-chain storage "DACS" as a chain, which allows a variety of data to be placed here.
Details on how to access this data could not be read from the documentation, but we believe it can probably be accessed via a URL, for example.
By defining several pieces of data in the metadata, with the URL as the value and the key as the field name, it is possible to manage various types of data in the metadata.
For example, suppose you have Dapps_A and Dapps_B.
If specific data is stored in "DACS" for each address in each of these Dapps, it is possible to create fields "Dapps_A" and "Dapps_B" in the CDH metadata and have each Dapps retrieve data via the CDH.
It is also possible to access data from Dapps_A to Dapps_B and from Dapps_B to Dapps_A, thus facilitating interaction between Dapps.
In this way, the various Dapps use the CDH as a hub for exchanging data, making the chain more active and enjoyable for participating users and enabling developers to build a wider variety of applications.

Translated with www.DeepL.com/Translator (free version)

## Specification

### ICDH

CDH-enabled contracts MUST implement the following interfaces

```solidity
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
```

#### setPermittedEditor

This function allows the owner of an NFT to grant permission to add and update metadata to other addresses.
This function can be used, for example, to grant permission to add metadata to the address of a Dapps operation.
Permission to add and update can be set for each field.

#### addMetadata

Function to add a new field to the metadata of an NFT.
Can only be executed by the owner of the NFT or an authorised address.
If the value already exists, `revert`.

#### updateMetadata

Function to update fields in the metadata of the NFT.
Can only be performed by the owner of the NFT or an authorised address.
If the value does not exist, `revert`.

#### getMetadata

Function to retrieve a specific field of metadata.

## Rationale

### Either the type of fieldName is of type `uint` or `string`

The type of fieldName is currently a `string`, but we are considering changing it to a `uint` type as it is easy to make mistakes when retrieving data.
If we change to the `uint` type, we need to keep track of which values are associated with which fields.
Managing them in a separate mapping array makes them easier to access and ensures that the data is managed properly.

### Integration with Name Service

When a Name Service like ENS is created on the Cross Value Chain, we are also considering linking to that Name Service.
We are trying to provide wider access, for example by enabling data to be retrieved in a way that is tied to a specific Name Service.

### Price it or not

We are considering putting a per-address price on NFT's Mint.
Cross Value Chain has a zero gas cost, so if you have a lot of addresses, you can issue as many as you want.
There is no limit to the number of NFTs that can be issued, so issuing unlimited NFTs is not a problem.
However, you may need to pay for the creation of communities or other mechanisms in the future.
Putting a price on the Mint of the NFT will allow sales here to be used for future updates.

Translated with www.DeepL.com/Translator (free version)

### SBT or...

Since this NFT takes the form of an address, it seems more natural that it should not be transferable.
The ability to transfer increases the range of things that can be done, but it may also reduce security, e.g. transfers due to incorrect approvals.

## Reference Implementation

[CDH.sol](../src/contract/packages/hardhat/contracts/CDH.sol)

## Security Considerations

### Ability to switch values in metadata.

The value of each field in the metadata can only be changed by the holder of the NFT or an authorised address.
However, changes made here may affect the Dapps in use.

## Copyright

Copyright and related rights waived via CC0.

## Citation

Please cite this document as:

Cardene([@cardene777](https://github.com/cardene777))
