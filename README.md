# visual-regression-test-sample
12/13 アドベントカレンダーのサンプルコード

## 体験手順

### 動作確認条件

* OS: MacOS | Linux
* node version: 12
* cypress version: 6.0.1

上記は筆者の動作させた環境となりますが、nodeのバージョンが異なっても、**恐らく**動きます

### 1. nodeのインストール

Macの人は、[nodebrew](https://github.com/hokaccha/nodebrew)を利用してインストールすると、簡単です。

Windowsの人は、[nodejs](https://nodejs.org/ja/download/)より、インストールを行ってください。

### 2. nodeがインストールできたことの確認

nodeにパスが通っていることを確認します。

```sh
node -v
v12.15.0
```

### 3. ディレクトリの作成&移動

今回の作業用のディレクトリを作成して、移動します。

```sh
mkdir visual-regression-test-sample
cd visual-regression-test-sample
```


### 4. nodeプロジェクトの初期化

npmを利用するため、nodeプロジェクトをセットアップします。

```sh
npm init -y
```
### 5. 開発に必要なライブラリをインストール

Cypressのサイズが大きいので、インストールに少し時間がかかります。

```sh
npm install http-server
npm install cypress
```

### 6. 確認用HTMLの作成

VisualRegressionTestの体験をするときに利用する簡単なページを作成します。

```sh
mkdir public
touch public/index.html
```

`./public/index.html`に以下の内容をコピペします。

```
<h1>visual-regression-test-sample</h1>
<p>これは、12/13アドベントカレンダーのサンプルプログラムです。</p>
```

### 7. サーバーを実行して、HTMLの確認

手順6で作成したHTMLを、ローカルのみに公開します。

**以降の手順は、別のターミナルで行ってください。**
```sh
npx http-server -c-1 public/
```

表示されている`ローカルホスト:Port`にアクセスすると、以下のようなページが表示されます。

![access.png](https://github.com/ksoga-graat/visual-regression-test-sample/blob/main/documents/screenshots/127.0.0.1_8081_.png)


### 8. Cypressのインストール & Cypressのセットアップ

VisualRegressionTestのために利用するCypressの設定ファイルを作成します。

```sh
touch cypress.json
```

`./cypress.json`に、以下の内容をコピペします。

```json
{}
```

### 9. テストファイルの作成

VisualRegressionTestを実行するためのテストファイルを作成します。

```sh
mkdir -p ./cypress/integration
touch cypress/integration/index.spec.js
```

以下の内容を`./cypress/integration/index.spec.js`にコピペします。

```
context("index.html", () => {
  beforeEach(() => {
    cy.visit("http://127.0.0.1:8080");
  });

  it("view title", () => {
    cy.get("h1").should("contain", "visual-regression-test-sample");
  });
});
```

### 10. Cypressが動作することの確認

Cypressを実行します。

```sh
npx cypress run
```

以下のようにテストが実行されていれば、問題ありません。

![first-test.png](https://github.com/ksoga-graat/visual-regression-test-sample/blob/main/documents/screenshots/first-test.png)

### 11. VisualRegressionTest用プラグインの導入


CypressでVisualRegressionTestを実行するために、次のプラグインを利用します。

[Cypress Image Snapshot](https://github.com/jaredpalmer/cypress-image-snapshot)

`cypress-image-snapshot`をインストールします。

```sh
npm install cypress-image-snapshot
```

手順10でCypressを実行したときに、自動生成されている`./cypress/plugins/index.js`の中身を消して、以下の内容をコピペします。

```js
const {
  addMatchImageSnapshotPlugin,
} = require('cypress-image-snapshot/plugin');

module.exports = (on, config) => {
  addMatchImageSnapshotPlugin(on, config);
};
```

手順10でCypressを実行したときに、自動生成されている`./cypress/support/commands.js`の中身を消して、以下の内容をコピペします。

```commands.js
import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command';

addMatchImageSnapshotCommand();
```
### 12. VisualRegressionTestの基準となる画像を作成

`./cypress/integration/index.spec.js`に以下をコピペします。

```js
context("index.html", () => {
  beforeEach(() => {
    cy.visit("http://127.0.0.1:8080");
  });

  it("Layout is not broken", () => {
    cy.matchImageSnapshot();
  });
});
```

以下を実行します。

```sh
npx cypress run
```

以下のようにテストが成功していれば問題ありません。

今回の実行結果は、`./cypress/snapshots/index.spec.js/index.html -- Layout is not broken.snap.png`に保存されており、これが基準となります。

![base-snapshot.png](https://github.com/ksoga-graat/visual-regression-test-sample/blob/main/documents/screenshots/first-test.png)

### 13. レイアウトが崩れるような修正をする

`./public/index.html`に以下をコピペします。

(今回の例: 他人が勝手にpタグにスタイルを追加してしまった)

```html
<h1>visual-regression-test-sample</h1>
<p style="margin:8px">これは、12/13アドベントカレンダーのサンプルプログラムです。</p>
```

### 14. VisualRegressionTestを実行する

テストを実行します。
```sh
npx cypress run
```

以下のようにテストが失敗していれば、VisualRegressionTestが実行されて、レイアウトの崩れを検知しています。

検知結果のスクリーンショットは`./cypress/snapshots/index.spec.js/__diff_output__/index.html -- Layout is not broken.diff.png`に保存されています。

![faild.png](https://github.com/ksoga-graat/visual-regression-test-sample/blob/main/documents/snapshots/index.spec.js/__diff_output__/index.html--Layout-is-not-broken.diff.png)
