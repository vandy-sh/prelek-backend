export class TransactionEntity {}

export enum TRANSACTION_TYPE_ENUM {
  TOP_UP = 'TOP_UP',
  EXPANSES = 'EXPANSES',
  VAULT = 'VAULT',
  SUBSCRIPTION_EXPANSES = 'SUBSCRIPTION_EXPANSES', //adalah sejumlah uang yang Anda bayarkan secara teratur untuk menjadi anggota suatu organisasi
  SUBSCRIPTION_INCOME = 'SUBSCRIPTION_INCOME', //Pendapatan adalah uang yang Anda terima sebagai imbalan atas tenaga kerja atau produk Anda.
  SUBSCRIPTION_PAYMENT = 'SUBSCRIPTION_PAYMENT',
}

export type TransactionType = keyof typeof TRANSACTION_TYPE_ENUM;
