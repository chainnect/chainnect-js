import {
  AbstractChain,
  TransferRequest,
  Transfer,
  TransactionStatus,
  Query
} from './index'
import JSBI from 'jsbi'
import { Observable, Subscriber } from 'rxjs'

interface Accounts {
  [id: string]: JSBI
}

interface BalanceQuery {
  account: string
}
export const ZERO = JSBI.BigInt(0)
export const MINT = 'mint'
export class MockChain extends AbstractChain {
  public chain: Transfer[] = []
  public mempool: Transfer[] = []
  public accounts: Accounts = {
    MINT: JSBI.BigInt(1000)
  }

  public blockNumber: JSBI = JSBI.BigInt(0)

  private subscriber: Subscriber<JSBI> | undefined

  constructor() {
    super('mock')
  }

  mine() {
    this.blockNumber = JSBI.add(this.blockNumber, JSBI.BigInt(1))
    const mined = this.mempool.map((tx: Transfer) => ({
      ...tx,
      status: TransactionStatus.Verified
    }))
    this.chain = [...this.chain, ...mined]
    this.mempool = []
    this.subscriber?.next(this.blockNumber)
  }

  createBlockObservable$(): Observable<JSBI> {
    return new Observable<JSBI>(subscriber => {
      this.subscriber = subscriber
      return () => {
        this.subscriber = undefined
      }
    })
  }

  send$(req: TransferRequest): Observable<Transfer> {
    return new Observable(subscriber => {
      this.mempool = [
        ...this.mempool,
        { ...req, status: TransactionStatus.Broadcast }
      ]
    })
  }

  balance(query: BalanceQuery): Promise<JSBI> {
    return Promise.resolve(this.accounts[query.account] || ZERO)
  }

  balance$(query: BalanceQuery): Observable<JSBI> {
    return this.toObservable<JSBI>(() => this.balance(query))
  }
}
