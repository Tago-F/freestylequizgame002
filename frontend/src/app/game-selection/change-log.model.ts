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

export const APP_VERSION = '1.2.0';

export const CHANGE_LOG: Changelog[] = [
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
        'クイズ重複防止機能の仕様を、選択ジャンルにおける最新15件のみ参照するよう変更',
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
