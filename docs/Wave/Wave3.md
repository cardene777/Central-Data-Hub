## Wave 3
・ERC6551

Implementation of the ERC 6551 contract.

Integration to mint TBAs in ERC6551 format when minting CDH.



・Creating the front end

https://central-data-hub.vercel.app/

Create a front-end and implement the following functions.

- CDH mint

- Display of CDH NFT list and details

- Display of Metadata

- Registration of fields that can be included in the metadata

- Display of list of fields that can be included in metadata



・Creation of demonstration videos.

https://github.com/cardene777/Central-Data-Hub/blob/develop/README.md#site

1. mint of CDH NFT

Enter NFT image URL and mint

2. if mint succeeds, the CDH NFT you own is displayed

Only one CDH NFT can be held per address.

The minted CDH NFTs are listed at the bottom of the screen.

3. detailed screen of CDH NFTs

'CDH NFT holder address', 'TBA address associated with CDH NFT', 'CDH NFT description' and 'CDH NFT image' are displayed.

'CVCDNS' will be displayed when the same domain name service as ENS is established on the CROSSVALUE Chain.

4. setting the fields that can be included in the metadata

A variety of data can be associated with metadata linked to the NFT.

In order to store the data in a key-value format, each Dapps or BCG can set a unique field identifier.

This field identifier can be a number such as '1' or '77'.

Field names can also be set, as it is not known which Dapps or BCGs are using the field identifier alone.

Each CDH NFT can store a field identifier (e.g. 1, 24, 66) in the metadata and the URL where the data used by each Dapps or BCG with that field name set in the key-value method.

The value, field identifier and fold name are set here.

5. the same field identifier cannot be registered.

6. successful registration with unique identifier.

The field information registered so far is displayed in a list under the registration button.
