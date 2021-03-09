const { assert } = require('chai')

const Color = artifacts.require('../src/contracts/Color.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Color', (accounts) => {
  let contract

  before(async () => {
    contract = await Color.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = contract.address
      assert.notEqual(address, '')
      assert.notEqual(address, '0x0')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('it has a name', async () => {
      const name = await contract.name()
      assert.equal(name, 'Color')
    })

    it('it has a symbol', async () => {
      const symbol = await contract.symbol()
      assert.equal(symbol, 'COLOR')
    })
  })

  describe('minting', async () => {
    it('mints a new token successfully', async () => {
      const result = await contract.mint('#EC058E')
      const totalSupply = await contract.totalSupply()
      // SUCCESS
      assert.equal(totalSupply, 1)
      const event = result.logs[0].args
      assert.equal(event.tokenId.toNumber(), 1, 'The ID is correct.')
      assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'The sending address is correct')
      assert.equal(event.to, accounts[0], 'The receiving address is correct')
      //FAILURE
      await contract.mint('#EC058E').should.be.rejected; // cannot mint same color twice
    })
  })

  describe('indexing', async () => {
    it('lists colors', async () => {
      // Minting 3 more tokens
      await contract.mint('#5386E4')
      await contract.mint('#FFFFFF')
      await contract.mint('#000000')
      const totalSupply = await contract.totalSupply()
      
      let color
      let results = []

      for(let i = 1; i <= totalSupply; i++){
        color = await contract.colors(i - 1)
        results.push(color)
      }
      
      let expected = ['#EC058E', '#5386E4', '#FFFFFF', '#000000']
      assert.equal(results.join(','), expected.join(','))
    })
  })

})