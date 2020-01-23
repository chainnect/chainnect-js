import { Observable, Subject } from 'rxjs'
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

export interface TransactionRequest {}

export interface TransferRequest extends TransactionRequest {
  readonly from?: string
  readonly to: string
  readonly amount: JSBI
}

export interface Transfer extends Transaction, TransferRequest {}

export interface Query {}

export interface Chain extends Identifiable {
  readonly block$: Subject<JSBI>
  readonly defaultToken?: Token
  readonly tokens: Token[]
  send$(tx: TransactionRequest): Observable<Transaction>
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

export abstract class AbstractChain implements Chain {
  public readonly id: string
  public readonly block$: Subject<JSBI>
  public readonly defaultToken?: Token
  public readonly tokens: Token[]
  constructor(id: string) {
    this.id = id
    this.tokens = []
    this.block$ = new Subject<JSBI>()
    this.createBlockObservable$().subscribe(this.block$)
  }

  protected abstract createBlockObservable$(): Observable<JSBI>
  abstract send$(tx: TransactionRequest): Observable<Transaction>

  toObservable<T>(af: () => Promise<T>): Observable<T> {
    return new Observable(subcriber => {
      const subscription = this.block$.subscribe(async block => {
        let value: T | undefined = undefined
        try {
          let result = await af()
          if (value !== result) {
            value = result
            subcriber.next(value)
          }
        } catch (error) {
          subcriber.error(error)
        }
        return () => {
          subscription.unsubscribe()
        }
      })
      return subscription
    })
  }
}
