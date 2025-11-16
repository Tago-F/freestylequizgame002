# AIクイズアプリ API仕様書 (MVP)

## 1. 概要

このドキュメントは、AIクイズアプリのフロントエンド（Angular）とバックエンド（Spring Boot）間の通信インターフェース (API) を定義する。

- ベースURL: /api/v1

- 認証: (MVPでは不要)

## 2. エンドポイント (API一覧)

### 2.1. クイズ生成 (Generate Quiz)

新しいクイズ（問題、選択肢、正解、解説）をAIに生成させる。

- エンドポイント: POST /api/v1/quiz/generate

- 説明: ユーザーが選択したジャンルと難易度、およびオプションとして過去の出題リストに基づき、AIが重複を避けたクイズ一式を生成して返す。

- リクエストボディ: GenerateQuizRequest (3.1参照)

- レスポンス (200 OK): QuizResponse (3.2参照)

- レスポンス (エラー): ErrorResponse (3.5参照)

    - (例: 500 Internal Server Error - AI生成失敗, 400 Bad Request - リクエスト不正)

### 2.2. ヒント生成 (Generate Hint)

既存のクイズに対するヒントをAIに生成させる。

- エンドポイント: POST /api/v1/quiz/hint

- 説明: 現在表示中のクイズ情報（問題文など）に基づき、AIがヒントを生成して返す。

- リクエストボディ: HintRequest (3.3参照)

- レスポンス (200 OK): HintResponse (3.4参照)

- レスポンス (エラー): ErrorResponse (3.5参照)

    - (例: 500 Internal Server Error - AI生成失敗)

## 3. データモデル (DTO: Data Transfer Objects)

### 3.1. GenerateQuizRequest (クイズ生成リクエスト)

`POST /quiz/generate` でフロントエンドから送信するデータ。
`previousQuestions` は、AIに重複を避けるよう指示するためのオプション項目。直近の出題履歴（問題文のリスト）を想定。

```json
{
  "genre": "Java",
  "difficulty": "ふつう",
  "previousQuestions": [
    "Javaでfinalキーワードが持つ3つの主な役割は何ですか？",
    "Javaのガベージコレクションについて説明してください。"
  ]
}
```

### 3.2. QuizResponse (クイズ生成レスポンス)

`POST /quiz/generate` でバックエンドから返却するデータ。
（correctAnswer は options 配列内の文字列と完全に一致する）

```json
{
  "question": "Javaでインターフェース(interface)の主な目的は何ですか？",
  "options": [
    "A: クラスのインスタンスを生成するため",
    "B: 関連するメソッドのシグネチャ（型）をグループ化し、実装を強制するため",
    "C: クラスのプライベートなメンバーにアクセスするため",
    "D: コードの実行速度を向上させるため"
  ],
  "correctAnswer": "B: 関連するメソッドのシグネチャ（型）をグループ化し、実装を強制するため",
  "explanation": "インターフェースは、クラスが実装すべきメソッドの「契約」を定義します。これにより、異なるクラスが同じメソッド名で異なる動作を実装しつつ、多態性を実現できます。"
}
```

### 3.3. HintRequest (ヒント生成リクエスト)

`POST /quiz/hint` でフロントエンドから送信するデータ。
（現在画面に表示中のクイズ情報をそのまま送る）

```json
{
  "question": "Javaでインターフェース(interface)の主な目的は何ですか？",
  "options": [
    "A: クラスのインスタンスを生成するため",
    "B: 関連するメソッドのシグネチャ（型）をグループ化し、実装を強制するため",
    "C: クラスのプライベートなメンバーにアクセスするため",
    "D: コードの実行速度を向上させるため"
  ]
}
```

### 3.4. HintResponse (ヒント生成レスポンス)

`POST /quiz/hint` でバックエンドから返却するデータ。

```json
{
  "hint": "この仕組みを使うことで、クラスは「何をすべきか」だけを知り、「どうやるか」は具体的な実装クラスに任せることができます。"
}
```

### 3.5. ErrorResponse (共通エラーレスポンス)

API呼び出しが失敗した場合（HTTPステータス 4xx, 5xx）に返却するデータ。

```json
{
  "timestamp": "2025-11-14T09:00:00Z",
  "status": 500,
  "error": "Internal Server Error",
  "message": "AIのクイズ生成中に予期せぬエラーが発生しました。",
  "path": "/api/v1/quiz/generate"
}
```