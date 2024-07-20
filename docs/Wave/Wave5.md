Wave 5
・Upload metadata to Arweave

Upload metadata on Arweave when minting NFT and mint NFT based on that URI.

The reasons for using Arweave are summarised below.

https://github.com/cardene777/Central-Data-Hub/blob/develop/docs/Metadata.md

https://github.com/cardene777/Central-Data-Hub/blob/develop/docs/Metadata_en.md

A brief description follows.

It is expected that CDH will update metadata frequently.

Therefore, with Arweave, the data can be updated without updating the contract and with fewer fees.

It also supports multiple payment currencies, so metadata can be updated in a way that suits the user.

The only form of use is to use Arweave until the implementation of DACS.



・Mint and display on CDNs

The CDN Mint function was implemented, but there was no function to 'get the domain name from the address'.

After contacting the developer, the relevant function was implemented and the acquired domain name can now be displayed.

This allows the site to be displayed if the address holds a CDH NFT and has also obtained DNS, or Mint from the CDH site if it has not obtained DNS.

As CDH aims to be the data hub of the Xenea chain, it is important that the address is more easily identifiable.

We will continue to develop the system in closer cooperation.



・Name change support to Xenea

The term Cross Value Chain was used in some documents, so it has been changed to Xenea.



・Movie



https://github.com/cardene777/Central-Data-Hub/assets/61857866/47db09b1-ff46-422b-b9bc-4403b9e30e70

The video shows the operation of the additional functions we have created.

The steps are as follows.

1. enter the URL of the NFT image.

2. sign the metadata based on the image data to be uploaded on Arweave.

3. sign the Mint of the CDH NFT and execute the transaction.

4. if the transaction is successful, the display switches to the CDN Mint.

5. after signing and executing the transaction, if the process is successful, the display switches to show the domain name of the CDN that has been set.

6. you can view various data on the details page of your data.



・Other

The Akindo product page has a character limit of 6,000 characters, so how past Wave information is summarised.

https://github.com/cardene777/Central-Data-Hub/tree/develop/docs/Wave
