Wave6


・Creation of ERC721 and ERC1155 contracts

Creation of sample NFT sample contracts to be stored in ERC6551 format TBA contracts.

Creation based on basic Openzeppelin contracts.


・NFT support for ERC6551 contracts

Normally, in ERC721 and ERC1155 contracts, if the NFT is sent to a contract, it is checked if the contract can receive the NFT.

If this check is not implemented in an ERC6551-style TBA contract, Mint will fail.

Therefore, a function has been added to indicate that the NFT can be received so that the check can be passed.



・List of NFTs held by the TBA.

It is now possible to list the NFTs held by the TBAs linked to the CDH.

However, as it is not possible to display all of them without an indexer, this time only the sample contracts created are displayed.

https://central-data-hub.vercel.app/address/0xAe451f1873B4C4D7263631Bf0ea141D54Ba39eEa?tba=0xf52d20141605708afb6C749435D05987c7A8B47a&index=0



・Copy function added

Addition of a copy function for addresses.
