export class TransactionEntity {}

export enum TRANSACTION_TYPE_ENUM {
  TOP_UP = 'TOP_UP', // user top up wallet
  EXPANSES = 'EXPANSES', // pembayaran kegiatan
  SUBSCRIPTION_INCOME = 'SUBSCRIPTION_INCOME', // pemasukan subcription / income kas
  SUBSCRIPTION_PAYMENT = 'SUBSCRIPTION_PAYMENT', // pembayaran subcription / pembayaran kas
}

export type TransactionType = keyof typeof TRANSACTION_TYPE_ENUM;

export enum TRANSACTION_STATUS_ENUM {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export type TransactionStatusType = keyof typeof TRANSACTION_STATUS_ENUM;
