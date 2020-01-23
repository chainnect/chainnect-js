import { MockChain } from '../MockChain'
import JSBI from 'jsbi'

const chain = new MockChain()

describe('interface', () => {
  it('has an id', () => {
    expect(chain.id).toEqual('mock')
  })

  it('has a block', () => {
    expect(chain.blockNumber).toEqual(JSBI.BigInt(0))
  })
})

describe('mining', () => {
  let blockNumber = chain.blockNumber
  describe('mine()', () => {
    beforeAll(() => chain.mine())
    it('increases blockNumber', () => {
      expect(chain.blockNumber).toEqual(JSBI.add(blockNumber, JSBI.BigInt(1)))
      blockNumber = chain.blockNumber
    })

    it('observers block', () =>
      new Promise<undefined>((resolve, reject) => {
        let callCount = 0
        let startBlock = chain.blockNumber
        const subscription = chain.block$.subscribe({
          next: block => {
            blockNumber = block
            callCount += 1
          }
        })
        chain.mine()
        chain.mine()
        subscription.unsubscribe()
        expect(callCount).toEqual(2)
        expect(blockNumber).toEqual(JSBI.add(startBlock, JSBI.BigInt(2)))
        resolve()
      }))
  })
})
