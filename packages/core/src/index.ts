import { Observable } from 'rxjs'
import JSBI from 'jsbi'
const BigInt = JSBI.BigInt

export interface Identifiable {
  readonly id: string
}

export enum RequestStatus {
  Requested,
  Denied,
  Authorized
}

export enum TransactionStatus {
  Requested,
  Denied,
  Authorized,
  Broadcast,
  Verified
}

export interface Transaction {
  readonly hash?: string
  readonly block?: JSBI
  readonly status: TransactionStatus
}

export interface TransferRequest {
  readonly from?: string
  readonly to: string
  readonly amount: JSBI
}

export interface Transfer extends Transaction, TransferRequest { }

export interface DataResult {
  readonly data: any
  readonly block: JSBI
}

export interface Chain extends Identifiable {
  readonly block$: Observable<JSBI>
  readonly defaultToken: Token
  readonly tokens: Token[]
  send$(tx: any): Observable<Transaction>
  call(callData: any): Promise<DataResult>
  call$(callData: any): Observable<DataResult>
}

export interface Token extends Identifiable {
  readonly chain: Chain
  readonly symbol: string
  readonly decimals: number
  readonly supply: Observable<JSBI>
}

export interface Holding {
  readonly token: Token
  readonly balance$: Observable<JSBI>
  transfer$(request: TransferRequest): Observable<Transfer>
}

export interface Account extends Identifiable {
  readonly holdings: Holding[]
  request$(tx: any): Observable<Transaction>
}

export interface AccountRequestResult {
  readonly accounts: Account[]
  readonly status$: Observable<RequestStatus>
}

export interface Wallet {
  readonly accounts: Account[]
  requestAccounts(): AccountRequestResult
}
