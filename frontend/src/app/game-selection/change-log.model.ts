export interface Changelog {
  version: string;
  date: string;
  changes: {
    added?: string[];
    changed?: string[];
    fixed?: string[];
    removed?: string[];
    documentation?: string[];
  };
}

export const APP_VERSION = '1.5.0';

export const CHANGE_LOG: Changelog[] = [
  {
    version: '1.5.0',
    date: '2025-12-06',
    changes: {
      added: [
        'モード選択画面を追加',
        '「ソロプレイ」「マルチプレイ」の選択肢を追加'
      ],
      changed: [
        'ルーティング構成をリファクタリングし、クイズ機能を `/quiz/` 配下に階層化'
      ]
    }
  },
  {
    version: '1.4.6',
    date: '2025-12-03',
    changes: {
      changed: [
        'バックエンドのリファクタリングを実施',
        'クイズ履歴テーブル用 Entity, Repository の削除',
        'フロントエンド側の設定項目をバックエンドに移管'
      ]
    }
  },
  {
    version: '1.4.5',
    date: '2025-12-02',
    changes: {
      changed: [
        'クイズ履歴の保存形式を詳細化',
        'バックエンドのリファクタリングを実施'
      ]
    }
  },
  {
    version: '1.4.4',
    date: '2025-12-01',
    changes: {
      changed: ['アプリ全体の背景色を「シルキー・パステル（Silky Pastel）」な配色に変更']
    }
  },
  {
    version: '1.4.3',
    date: '2025-11-30',
    changes: {
      added: [
        'クイズ設定画面の問題数選択肢に「5問」を追加'
      ],
    },
  },
  {
    version: '1.4.2',
    date: '2025-11-30',
    changes: {
      fixed: [
        'クイズ設定画面にて、画面サイズや拡大率によってコンテンツ上部が見切れてしまう不具合を修正'
      ],
    },
  },
  {
    version: '1.4.1',
    date: '2025-11-30',
    changes: {
      changed: [
        'クイズ設定画面の初期値を変更（難易度: ふつう、モード: ターン制、問題数: 15問）'
      ],
    },
  },
  {
    version: '1.4.0',
    date: '2025-11-29',
    changes: {
      changed: [
        'クイズ設定画面のジャンル選択肢を大幅に拡充',
        'アニメ、映画、エンタメ、音楽、教養、サイエンス、ITスキルの各カテゴリに、より詳細なジャンルを追加'
      ],
    },
  },
  {
    version: '1.3.0',
    date: '2025-11-29',
    changes: {
      added: [
        'クイズの出題数を設定する機能を追加',
        'クイズ結果（ランキング）を表示するリザルト画面を追加',
      ],
    },
  },
  {
    version: '1.2.3',
    date: '2025-11-29',
    changes: {
      changed: [
        'クイズ文章の文字数上限を50文字から75文字に拡張',
        '使用するGeminiモデルを `gemini-pro-1.5-flash-lite` から `gemini-1.5-flash` に変更',
      ],
    },
  },
  {
    version: '1.2.2',
    date: '2025-11-29',
    changes: {
      changed: [
        'クイズ重複防止のためAIに連携する過去問の件数を15件から30件に増加',
      ],
    },
  },
  {
    version: '1.2.1',
    date: '2025-11-29',
    changes: {
      documentation: [
        '肥大化した画面設計書を画面ごとに分割',
        'タスク計画書のステータス管理方法を改善',
      ],
    },
  },
  {
    version: '1.2.0',
    date: '2025-11-24',
    changes: {
      documentation: [
        'バージョン情報・更新履歴表示機能を追加',
        '上記機能追加に伴う各種ドキュメント（要件定義書、画面設計書など）を更新',
      ],
    },
  },
  {
    version: '1.1.0',
    date: '2025-11-24',
    changes: {
      changed: [
        'クイズ重複防止機能の仕様を、選択ジャンルにおける最新30件のみ参照するよう変更',
      ],
      documentation: [
        'クイズ重複防止機能の仕様変更に伴うドキュメント更新',
      ]
    },
  },
  {
    version: '1.0.0',
    date: '2025-11-24',
    changes: {
      added: [
        'クイズ出題履歴をデータベースに永続化する機能',
      ],
      changed: [
        'クイズ履歴の保存/参照先をフロントエンドのメモリからバックエンドのデータベースに変更',
      ],
    },
  },
  {
    version: '0.1.0',
    date: '過去の変更',
    changes: {
      added: [
        'MVP（Minimum Viable Product）の基本機能を実装',
        'リアルタイムなクイズ生成機能',
        '複数プレイヤー登録、スコア管理機能',
        'ゲームモード選択機能（全員回答、ターン制）',
      ],
    },
  }
];