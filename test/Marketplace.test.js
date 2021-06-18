// We can import the contract in to the test file
const Marketplace = artifacts.require('./Marketplace.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Marketplace', ([deployer, seller, buyer]) => { // pass in a function and put tests in for Mocha & Chai
    let mkt // store deployed smart contract with mkt variable 
    before(async () => {
        mkt = await Marketplace.deployed()
    })
    
    describe('deployment', async () => {
      it('deploys successfully', async () => {
        const address = await mkt.address
        assert.notEqual(address, 0x0) // getting address and checking presence
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
      })
  
      it('has a name', async () => {
        const name = await mkt.name()
        assert.equal(name, 'Nakamoto List')
      })
    })
  
    describe('products', async () => {
      let result, productCount
  
      before(async () => {
        // Web3.utils.toWei avoids representing Wei as 1e18 
        result = await mkt.createProduct('Nintendo Switch', web3.utils.toWei('1', 'Ether'), { from: seller })
        productCount = await mkt.productCount() // fetch count
      })
  
      it('adds products', async () => {
        // SUCCESS
        assert.equal(productCount, 1)
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
        assert.equal(event.name, 'Nintendo Switch', 'name is correct')
        assert.equal(event.price, '1000000000000000000', 'price is correct')
        assert.equal(event.owner, seller, 'owner is correct')
        assert.equal(event.purchased, false, 'purchased is correct')
  
        // FAILURE: Product must have a name
        await await mkt.createProduct('', web3.utils.toWei('1', 'Ether'), { from: seller }).should.be.rejected;
        // FAILURE: Product must have a price
        await await mkt.createProduct('Nintendo Switch', 0, { from: seller }).should.be.rejected;
      })
      
      it('lists products', async () => {
        const product = await mkt.products(productCount)
        assert.equal(product.id.toNumber(), productCount.toNumber(), 'id is correct')
        assert.equal(product.name, 'Nintendo Switch', 'name is correct')
        assert.equal(product.price, '1000000000000000000', 'price is correct')
        assert.equal(product.owner, seller, 'owner is correct')
        assert.equal(product.purchased, false, 'purchased is correct')
      })
  
      it('sells products', async () => {
        // Track the seller balance before purchase
        let oldSellerBalance
        oldSellerBalance = await web3.eth.getBalance(seller)
        oldSellerBalance = new web3.utils.BN(oldSellerBalance)
  
        // SUCCESS: Buyer makes purchase
        result = await mkt.purchaseProduct(productCount, { from: buyer, value: web3.utils.toWei('1', 'Ether')})
  
        // Check logs
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
        assert.equal(event.name, 'Nintendo Switch', 'name is correct')
        assert.equal(event.price, '1000000000000000000', 'price is correct')
        assert.equal(event.owner, buyer, 'owner is correct')
        assert.equal(event.purchased, true, 'purchased is correct')
  
        // Check that seller received funds
        let newSellerBalance
        newSellerBalance = await web3.eth.getBalance(seller)
        newSellerBalance = new web3.utils.BN(newSellerBalance)
  
        let price
        price = web3.utils.toWei('1', 'Ether')
        price = new web3.utils.BN(price)
        
        const exepectedBalance = oldSellerBalance.add(price)
  
        assert.equal(newSellerBalance.toString(), exepectedBalance.toString())
  
        // FAILURE: Tries to buy a product that does not exist, i.e., product must have valid id
        await mkt.purchaseProduct(99, { from: buyer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;      // FAILURE: Buyer tries to buy without enough ether
        // FAILURE: Buyer tries to buy without enough ether
        await mkt.purchaseProduct(productCount, { from: buyer, value: web3.utils.toWei('0.5', 'Ether') }).should.be.rejected;
        // FAILURE: Deployer tries to buy the product, i.e., product can't be purchased twice
        await mkt.purchaseProduct(productCount, { from: deployer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;
        // FAILURE: Buyer tries to buy again, i.e., buyer can't be the seller
        await mkt.purchaseProduct(productCount, { from: buyer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;
      })
  
    })
  })
  