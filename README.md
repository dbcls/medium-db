# TogoMedium 説明書
## 趣旨
本システムはDBCLS(データサイエンス共同利用基盤施設ライフサイエンス統合データベースセンター)の整備した微生物培地情報のRDF情報を検索・閲覧するためのデータベースサービスである。



## 納品データについて
納品用ディスクの内部には本システムで使用しているWebサイト及びスタンザのソースファイル一式(2020年3月27日時点)が収められている。
なお、本ソースファイル一式は担当者間でgithub上にて共有されており、今後の保証期間における修正対応については、原則としてこのgithubを通じてデータのやりとりを行う。

## デプロイ方法
納品データ内 `public_static` の**中身**をサーバールートに配置する。(public_staticフォルダはサーバー上に作らない)

基本的に静的なhtmlファイル群で構成されているため、ミドルウェアのインストールは不要だが、検索結果のURLクエリを解決するためにサーバー側の設定を調整する必要がある。この設定についてはサーバーのOSにより方法が異なるので事前に担当者と協議を行うこと。

## 使用方法
### トップページ
検索用のキーワードやIDを入力すると、各種STANZAが起動し検索結果を表示する。検索結果からは培地/成分/生物の各詳細へ遷移できる。
#### 使用スタンザ
* `gmdb_list_media_by_gmids`  GM_ID に紐付いた培地の一覧を表示する。
* `gmdb_list_media_by_keyword` キーワードに紐付いた培地の一覧を表示する。
* `gmdb_list_components_by_gmoids` GMO_ID に紐付いた成分の一覧を表示する。
* `gmdb_list_components_by_keyword` キーワードに紐付いた成分の一覧を表示する。
* `gmdb_list_organisms_by_taxids` TAX_IDに紐付いた生物の一覧を表示する。
* `gmdb_list_organisms_by_keyword`  キーワードに紐付いた生物の一覧を表示する。

### 培地ページ
培地の詳細と含まれる成分、培養できる生物を表示する。また、各IDからは関連する情報へ遷移できる。

#### 使用スタンザ
* `gmdb_medium_by_gmid`  指定したGM_IDを持つ培地の詳細及び含まれる成分の一覧を表示する。
* `gmdb_organisms_by_gmid` 指定したGM_IDを持つ培地で培養できる生物の一覧を表示する。

### 成分ページ
成分の詳細とその成分の使用している培地の一覧を表示する。また、各IDからは関連する情報へ遷移できる。

#### 使用スタンザ
* `gmdb_component_by_gmoid`  指定したGMO_IDを持つ成分の詳細を表示する。
* `gmdb_media_by_gmoid` 指定したGMO_IDを持つ成分を使用している培地の一覧を表示する。

### 生物ページ
生物の詳細とその生物を培養できる培地の一覧を表示する。また、各IDからは関連する情報へ遷移できる。
* `gmdb_organism_by_taxid`  指定したTAX_IDを持つ生物の詳細を表示する。
* `gmdb_media_by_taxid` 指定したTAX_IDを持つ生物を培養できる培地の一覧を表示する。

### Media alignmentページ
培地を、その成分でアライメントするスタンザを表示する。スタンザ上部に表示される円形の図は、微生物を代謝パスウェイの類似性を用いてクラスタリングしたものである。クラスタリングの任意のノードをクリックすることにより、そのノード以下に含まれる生物種が選択され、その生物の培養に利用される培地について、その成分のアライメントがスタンザ下部に表示される。

## 修正方法
### 必要環境
* NodeJS及びNPMの最新安定版
* gulp cliの最新安定版
* TS (TogoStanzaのビルド環境)
**本要件は修正作業を行うPCに対する要件であり、サーバーに対する要件ではない。**

### セットアップ
ソースファイル配置フォルダで `npm install` を実行する。

### コンパイル
ソースファイルを編集後にデプロイ用のファイルを生成するために以下のコマンドを実行する必要がある。
* `gulp stanza.build`  STANZAのコンパイルを行う(`src/stanza`フォルダで`ts build` を実行するのと同等)。
* `gulp static.build.develop` htmlなどをコンパイルし成果ファイルをデプロイ用の`public_static` に集約する。

### 修正箇所
今後、修正・補完が発生する可能性が高い箇所を以下に示す。

* サイト内Documentページの本文  `src/pug/about.pug` 
* 成分詳細のリンク用ラベル `src/stanza/gmdb_component_by_gmoid/index.js getLinkLabel` 78行目付近
* 培地詳細の成分Property用ラベル `src/stanza/gmdb_medium_by_gmid/index.js getShortPropertyLabel` 55行目付近
* 培地詳細のリンク先機関用ラベル `src/stanza/gmdb_medium_by_gmid/index.js getSrcLabel` 68行目付近




