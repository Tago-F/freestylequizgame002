# AI Freestyle Quiz Game

AI (Vertex AI Gemini) がリアルタイムでクイズを生成する、多人数参加型のクイズアプリケーションです。

## 概要

このアプリケーションは、Spring Boot (バックエンド) と Angular (フロントエンド) を使用して構築されています。
AIがその場でクイズ（問題、4択、解説）を生成するため、無限にクイズを楽しむことができます。

## 主な機能 (MVP)

- 1〜16人のプレイヤー登録機能
- クイズのジャンルと難易度設定機能
- AIによるリアルタイムなクイズ・ヒント生成機能
- 手動でのスコア管理機能

## 技術スタック

- **バックエンド**: Spring Boot, Spring AI
- **フロントエンド**: Angular
- **AI**: Google Vertex AI (Gemini)

## 開発の始め方

### 前提条件

- Java (JDK)
- Node.js と npm (or yarn)
- Angular CLI

### セットアップと実行

1.  **リポジトリをクローン:**
    ```bash
    git clone <repository-url>
    cd freestylequizgame002
    ```

2.  **バックエンドの起動:**
    - `backend/` ディレクトリに移動します。
    - `application.properties` にVertex AIのAPIキーなどを設定します。
    - Maven経由でアプリケーションを起動します。
    ```bash
    cd backend
    ./mvnw spring-boot:run
    ```

3.  **フロントエンドの起動:**
    - `frontend/` ディレクトリに移動します。
    - 依存関係をインストールし、開発サーバーを起動します。
    ```bash
    cd frontend
    npm install
    ng serve
    ```

4.  **アプリケーションにアクセス:**
    ブラウザで `http://localhost:4200` を開きます。

