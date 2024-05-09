# CVCIP-1: Central Data Hub (CDH)

あらゆるデーターを一括管理する NFT

## Abstract

あらゆるデータを一括管理する NFT コントラクトです。
Cross Value Chain にある、"DACS"と呼ばれるオンチェーンストレージに様々なデータを載せることができる。
このデータは NFT によって管理ができるため、NFT 保有者や Dapps によって好きに変更可能。
また、メタデータ及びコントラクトに様々な"DACS"に保存されているデータの URL を保存することで、この NFT を様々な Dapps で使用することができる。
これにより Dapps 間で相互にアクセスが可能になるなどデータの中心地の役割を CDH が果たす。

## Motivation

Ethereum などで使用されている NFT のメタデータには、"name", "description", "image"などほとんどデータが格納されていません。
NFT によっては自由にメタデータをカスタムして良いが、Opensea などのマーケットプレイスなどへの対応のみに意識がいき、メタデータを活用しきれていません。
このメタデータを拡張し、様々なフィールドを定義するようにすることで、NFT の活用の幅が広がります。
Cross Value Chain ではチェーンとして、ネイティブにオンチェーンストレージである"DACS"をサポートしているため、ここに様々なデータを載せることができます。
このデータにアクセスする方法の詳細はドキュメントから読み取ることができませんでしたが、おそらく URL などでアクセスできると考えています。
この URL を値に、キーをフィールド名にしたデータをメタデータ内に複数定義することで、メタデータで様々なデータを管理することができるようになります。
例えば、Dapps_A と Dapps_B があるとします。
この各 Dapps でアドレスごとに特定のデータが"DACS"に保存されていれば、CDH のメタデータ内に"Dapps_A"と"Dapps_B"というフィールドを作成して、それぞれの Dapps から CDH を経由してデータを取得してもらうことが可能になります。
また、Dapps_A から Dapps_B のデータにアクセスしたり、Dapps_B から Dapps_A のデータにアクセスしたりすることも可能になり、Dapps 間の相互作用が促進されます。
このように、様々な Dapps が CDH をハブにしてデータをやり取りすることで、チェーンが活発になり参加ユーザーが楽しめるとともに、開発者がより多彩なアプリケーションを構築できるようになります。

## Specification

### ICDH

CDH に対応するコントラクトは以下のインターフェースを実装する必要があります（MUST）。

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

NFT の所有者がメタデータの追加・更新権限を他のアドレスに許可する関数です。
この関数を使用することで、例えば Dapps の運営のアドレスにメタデータを追加する許可を与えることができます。
各フィールドごとに追加・更新許可を設定できます。

#### addMetadata

NFT のメタデータにフィールドを新規追加する関数です。
NFT の所有者か許可されたアドレスのみ実行可能です。
すでに値が存在する場合は`revert`します。

#### updateMetadata

NFT のメタデータにフィールドを更新する関数です。
NFT の所有者か許可されたアドレスのみ実行可能です。
値が存在しない場合は`revert`します。

#### getMetadata

メタデータの特定のフィールドを取得する関数です。

## Rationale

### fieldName の型を`uint`型にするか

現在 fieldName の型は`string`型だが、データを取得するときに間違えが生じやすいため、`uint`型に変更することを考えています。
`uint`型に変更すると、どの値がどのフィールドに紐づいているかを管理する必要があります。
別の mapping 配列で管理することでアクセスしやすく、データを適切に管理できるようになります。

### Name Service との統合

Cross Value Chain 上に ENS のような Name Service が作成されたとき、その Name Service との連携も考えています。
特定の Name Service に紐づく形でデータを取得できるようにするなど、より幅広いアクセスを提供しようとしています。

### 価格をつけるか

NFT の Mint にあたり価格をつけるか検討しています。
Cross Value Chain はガス代が 0 なため、アドレスをたくさん用意すればその分だけ発行できてしまいます。
特に上限は設けないため、無制限に NFT を発行すること自体は問題ないです。
しかし、今後コミュニティなどを作成したり、他の仕組みなどを導入する際に費用が必要になるかもしれません。
NFT の Mint に価格をつけることで、ここでの売り上げが将来のアップデートに活用できるようになります。

### SBT にするか

この NFT はアドレスに紐づく形を取るため、transfer できない方が自然に思えます。
transfer ができることでできることの幅も広がりますが、誤った approve による transfer などセキュリティが下がることが考えられます。

## Reference Implementation

[CDH.sol](../src/contract/packages/hardhat/contracts/CDH.sol)

## Security Considerations

### メタデータ内の値を切り替える機能

メタデータ内の各フィールドの値は、NFT の保有者か許可されたアドレスのみ変更可能です。
ただ、ここを変更されることで、使用している Dapps に影響が出る可能性があります。

## Copyright

Copyright and related rights waived via CC0.

## Citation

Please cite this document as:

Cardene([@cardene777](https://github.com/cardene777))
