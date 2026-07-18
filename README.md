# ENRICH HOUSE ご利用ガイド（電子マニュアル）

A4マニュアルをページめくり式の電子ブックとして見られるようにした、GitHub Pagesでそのまま公開できる静的サイトです。

## ファイル構成

```
manual-book/
├─ index.html
├─ assets/
│  ├─ css/style.css
│  ├─ js/script.js
│  └─ images/
│     ├─ page-01.jpg   ← 表紙
│     ├─ page-02.jpg
│     ├─ page-03.jpg
│     └─ page-04.jpg
└─ README.md
```

## GitHubで公開する手順

1. GitHubで新しいリポジトリを作成します（例: `manual-book`）。Public（公開）にしてください。
2. このフォルダの中身一式（`index.html`, `assets/`, `README.md`）をリポジトリのルートにアップロードします。
   - GitHubのウェブ画面の場合: リポジトリページで「Add file」→「Upload files」から、このフォルダ内のファイルをまとめてドラッグ&ドロップしてアップロードできます。フォルダ構造（`assets/css/`, `assets/js/`, `assets/images/`）はそのまま維持してください。
3. アップロード後、リポジトリの「Settings」→「Pages」を開きます。
4. 「Build and deployment」の「Source」を `Deploy from a branch` にし、Branch を `main`（または `master`）・フォルダを `/ (root)` にして保存します。
5. 数分待つと、`https://ユーザー名.github.io/リポジトリ名/` でマニュアルが公開されます。

## ページを追加・更新する方法

`assets/images/` フォルダに、ファイル名を **page-05.jpg, page-06.jpg …** と連番にした画像を追加するだけで、自動的にページが増えます（コードの変更は不要です）。

- ファイル名は必ず2桁の連番にしてください（`page-05.jpg` であって `page-5.jpg` は不可）
- 画像を差し替えたい場合は、同じファイル名で上書きすればOKです
- ページの並び順はファイル名の連番順になります（表紙 = page-01.jpg）

## 操作方法（閲覧者向け）

- 画面右側クリック / タップ、または右矢印キーで次のページ
- 画面左側クリック / タップ、または左矢印キーで前のページ
- 下部のドットをクリックすると該当ページへジャンプ
- スマートフォンでは左右スワイプに対応

## ローカルで確認する場合

ブラウザで `index.html` を直接開くとブラウザのセキュリティ制限により画像の自動検出が動かない場合があります。以下のように簡易サーバーを立てて確認してください（Node.jsが入っている場合）。

```bash
npx http-server -p 8080
```

その後 `http://localhost:8080` を開いてください。GitHub Pagesで公開する分にはこの手順は不要です。
