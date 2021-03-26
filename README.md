# TogoMedium 説明書
## 趣旨
本システムはDBCLS(データサイエンス共同利用基盤施設ライフサイエンス統合データベースセンター)の整備した微生物培地情報のRDF情報を検索・閲覧するためのデータベースサービスである。

## 納品データについて
納品用ディスクの内部には本システムで使用しているWebサイトのソースファイル一式(2021年3月26日時点)が収められている。
なお、本ソースファイル一式は担当者間でgithub上にて共有されており、今後の保証期間における修正対応については、原則としてこのgithubを通じてデータのやりとりを行う。

## デプロイ方法
納品データ内 `public_static` の**中身**をサーバールートに配置する。(public\_staticフォルダはサーバー上に作らない)

基本的に静的なhtmlファイル群で構成されているため、ミドルウェアのインストールは不要だが、検索結果のURLクエリを解決するためにサーバー側の設定を調整する必要がある。この設定についてはサーバーのOSにより方法が異なるので事前に担当者と協議を行うこと。

## 修正方法
### 必要環境
* NodeJS及びNPMの最新安定版
**本要件は修正作業を行うPCに対する要件であり、サーバーに対する要件ではない。**

### セットアップ
ソースファイル配置フォルダで `npm install` を実行する。

### コンパイル
ソースファイルを編集後にデプロイ用のファイルを生成するために以下のコマンドを実行する必要がある。
* `npx gulp static.build.develop` htmlなどをコンパイルし成果ファイルをデプロイ用の`public_static` に集約する。

### 修正箇所
今後、修正・補完が発生する可能性が高い箇所を以下に示す。

* サイト内Documentページの本文  `src/pug/about.pug`

## 機能一覧・ Stanza 及び API一覧
### トップページ

[http://growthmedium.org/][1]

#### データベース概要

本データベースに登録されている各項目の一覧を表示する

* [http://growthmedium.org/sparqlist/list\_media][2]
* [http://growthmedium.org/sparqlist/list\_organisms][3]
* [http://growthmedium.org/sparqlist/list\_components][4]

※Stanzaを用いずにサイト内のJavaScriptから直接起動している

#### 分類階級絞り込み機能
分類階級を辿って本データベースに登録されている生物種を探すことができる

* [http://growthmedium.org/sparqlist/list\_taxons\_by\_rank][5]

※Stanzaを用いずにサイト内のJavaScriptから直接起動している



#### 検索機能
検索用のキーワードやIDを入力すると、各種Stanzaが起動し検索結果を表示する。検索結果からは培地/成分/生物の各詳細へ遷移できる

[https://dbcls.github.io/togomedium-stanza/gmdb-meta-list.html][6]

* [http://growthmedium.org/sparqlist/gmdb\_list\_media\_by\_gmids][7]
* [http://growthmedium.org/sparqlist/gmdb\_list\_media\_by\_keyword][8]
* [http://growthmedium.org/sparqlist/gmdb\_list\_components\_by\_gmoids][9]
* [http://growthmedium.org/sparqlist/gmdb\_list\_components\_by\_keyword][10]
* [http://growthmedium.org/sparqlist/gmdb\_list\_organisms\_by\_taxids][11]
* [http://growthmedium.org/sparqlist/gmdb\_list\_organisms\_by\_keyword][12]

### 培地一覧ページ

[http://growthmedium.org/media/][13]

本データベースに登録されている培地の一覧を表示する

[https://dbcls.github.io/togomedium-stanza/gmdb-meta-list.html][14]

* [http://growthmedium.org/sparqlist/list\_media][15]

### 培地詳細ページ

[http://growthmedium.org/media/$ID][16]

培地の詳細及び含まれる成分、類似する培地、その培地で培養できる生物種の一覧を表示する

#### 培地詳細情報

[https://dbcls.github.io/togomedium-stanza/gmdb-medium-by-gmid.html][17]

* [http://growthmedium.org/sparqlist/gmdb\_medium\_by\_gmid][18]

#### 表現型情報

[https://dbcls.github.io/togomedium-stanza/gmdb-medium-by-gmid.html][19]

* [http://growthmedium.org/sparqlist/gmdb\_list\_similar\_media\_by\_gmid][20]

#### 関連生物種一覧

[https://dbcls.github.io/togomedium-stanza/gmdb-meta-list.html][21]

* [http://growthmedium.org/sparqlist/gmdb\_list\_similar\_media\_by\_gmid][22]

### 生物種一覧ページ

[http://growthmedium.org/organism/][23]

本データベースに登録されている生物種の一覧を表示する

[https://dbcls.github.io/togomedium-stanza/gmdb-meta-list.html][24]

* [http://growthmedium.org/sparqlist/list\_organism][25]

### 生物種詳細ページ

生物種の詳細と表現型、その生物種を培養できる培地の一覧を表示する

[http://growthmedium.org/organism/$ID][26]


#### 表現型情報

[https://dbcls.github.io/togomedium-stanza/gmdb-phenotype-info.html][27]

#### 関連培地一覧

[https://dbcls.github.io/togomedium-stanza/gmdb-meta-list.html][28]

* [http://growthmedium.org/sparqlist/gmdb\_media\_by\_taxid][29]

### 成分一覧ページ

[http://growthmedium.org/component/][30]

本データベースに登録されている成分の一覧を表示する

[https://dbcls.github.io/togomedium-stanza/gmdb-meta-list.html][31]

* [http://growthmedium.org/sparqlist/list\_components][32]

### 成分詳細ページ

[http://growthmedium.org/component/$ID][33]

成分の詳細とその成分を使用している培地の一覧を表示する

#### 成分詳細

[https://dbcls.github.io/togomedium-stanza/gmdb-component-by-gmoid.html][34]

* [http://growthmedium.org/sparqlist/gmdb\_component\_by\_gmoid][35]

#### 関連培地一覧

[https://dbcls.github.io/togomedium-stanza/gmdb-meta-list.html][36]

* [http://growthmedium.org/sparqlist/gmdb\_media\_by\_gmoid][37]

### 分類階級情報ページ

[http://growthmedium.org/taxon/$ID][38]

分類階級の情報と、関連する培地・生物種の一覧を表示する


#### 分類階級情報

[https://dbcls.github.io/togomedium-stanza/gmdb-taxon-by-taxid.html][39]

* [http://growthmedium.org/sparqlist/gmdb\_taxonomic\_rank\_by\_taxid][40]

#### 関連培地一覧

[https://dbcls.github.io/togomedium-stanza/gmdb-meta-list.html][41]

* [http://growthmedium.org/sparqlist/gmdb\_media\_by\_taxid][42]

#### 関連生物種一覧

[https://dbcls.github.io/togomedium-stanza/gmdb-meta-list.html][43]

* [http://growthmedium.org/sparqlist/gmdb\_infraspecific\_list\_by\_taxid][44]


### 統計ページ

[http://growthmedium.org/statistics/][45]

Phylumに基づいてデータベースに登録された生物種数の一覧を表示する

[https://dbcls.github.io/togomedium-stanza/gmdb-meta-list.html][46]

* [http://growthmedium.org/sparqlist/gmdb\_stat\_phylum\_gm][47]


### Media alignmentページ

[http://growthmedium.org/media\_alignment/][48]

培地をその成分でアライメントするスタンザを表示する。スタンザ上部に表示される円形の図は、微生物を代謝パスウェイの類似性を用いてクラスタリングしたものである。クラスタリングの任意のノードをクリックすることにより、そのノード以下に含まれる生物種が選択され、その生物の培養に利用される培地について、その成分のアライメントがスタンザ下部に表示される。

[https://dbcls.github.io/togomedium-stanza/gmdb-roundtree.html][49]
[https://dbcls.github.io/togomedium-stanza/gmdb-gms-by-tid.html][50]

* [http://growthmedium.org/sparqlist/gms\_kegg\_code\_tid][51]
* [http://growthmedium.org/sparqlist/gms\_by\_kegg\_tids\_3][52]







[1]:	http://growthmedium.org/
[2]:	http://growthmedium.org/sparqlist/list_media
[3]:	http://growthmedium.org/sparqlist/list_organisms
[4]:	http://growthmedium.org/sparqlist/list_components
[5]:	http://growthmedium.org/sparqlist/list_taxons_by_rank
[6]:	https://dbcls.github.io/togomedium-stanza/gmdb-meta-list.html
[7]:	http://growthmedium.org/sparqlist/gmdb_list_media_by_gmids
[8]:	http://growthmedium.org/sparqlist/gmdb_list_media_by_keyword
[9]:	http://growthmedium.org/sparqlist/gmdb_list_components_by_gmoids
[10]:	http://growthmedium.org/sparqlist/gmdb_list_components_by_keyword
[11]:	http://growthmedium.org/sparqlist/gmdb_list_organisms_by_taxids
[12]:	http://growthmedium.org/sparqlist/gmdb_list_organisms_by_keyword
[13]:	http://growthmedium.org/media/
[14]:	https://dbcls.github.io/togomedium-stanza/gmdb-meta-list.html
[15]:	http://growthmedium.org/sparqlist/list_media
[16]:	http://growthmedium.org/media/JCM_M13
[17]:	https://dbcls.github.io/togomedium-stanza/gmdb-medium-by-gmid.html
[18]:	http://growthmedium.org/sparqlist/gmdb_medium_by_gmid
[19]:	https://dbcls.github.io/togomedium-stanza/gmdb-medium-by-gmid.html
[20]:	http://growthmedium.org/sparqlist/gmdb_list_similar_media_by_gmid
[21]:	https://dbcls.github.io/togomedium-stanza/gmdb-meta-list.html
[22]:	http://growthmedium.org/sparqlist/gmdb_list_similar_media_by_gmid
[23]:	http://growthmedium.org/organism/
[24]:	https://dbcls.github.io/togomedium-stanza/gmdb-meta-list.html
[25]:	http://growthmedium.org/sparqlist/list_organism
[26]:	http://growthmedium.org/organism/1509
[27]:	https://dbcls.github.io/togomedium-stanza/gmdb-phenotype-info.html
[28]:	https://dbcls.github.io/togomedium-stanza/gmdb-meta-list.html
[29]:	http://growthmedium.org/sparqlist/gmdb_media_by_taxid
[30]:	http://growthmedium.org/component/
[31]:	https://dbcls.github.io/togomedium-stanza/gmdb-meta-list.html
[32]:	http://growthmedium.org/sparqlist/list_components
[33]:	http://growthmedium.org/component/GMO_001001
[34]:	https://dbcls.github.io/togomedium-stanza/gmdb-component-by-gmoid.html
[35]:	http://growthmedium.org/sparqlist/gmdb_component_by_gmoid
[36]:	https://dbcls.github.io/togomedium-stanza/gmdb-meta-list.html
[37]:	http://growthmedium.org/sparqlist/gmdb_media_by_gmoid
[38]:	http://growthmedium.org/taxon/201174
[39]:	https://dbcls.github.io/togomedium-stanza/gmdb-taxon-by-taxid.html
[40]:	http://growthmedium.org/sparqlist/gmdb_taxonomic_rank_by_taxid
[41]:	https://dbcls.github.io/togomedium-stanza/gmdb-meta-list.html
[42]:	http://growthmedium.org/sparqlist/gmdb_media_by_taxid
[43]:	https://dbcls.github.io/togomedium-stanza/gmdb-meta-list.html
[44]:	http://growthmedium.org/sparqlist/gmdb_infraspecific_list_by_taxid
[45]:	http://growthmedium.org/statistics/
[46]:	https://dbcls.github.io/togomedium-stanza/gmdb-meta-list.html
[47]:	http://growthmedium.org/sparqlist/gmdb_stat_phylum_gm
[48]:	http://growthmedium.org/media_alignment/
[49]:	https://dbcls.github.io/togomedium-stanza/gmdb-roundtree.html
[50]:	https://dbcls.github.io/togomedium-stanza/gmdb-gms-by-tid.html
[51]:	http://growthmedium.org/sparqlist/gms_kegg_code_tid
[52]:	http://growthmedium.org/sparqlist/gms_by_kegg_tids_3