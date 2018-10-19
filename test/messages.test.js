const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const web3 = new Web3(ganache.provider());
const compiledContract = require('../ethereum/build/Messages');

let messageContract;
let accounts;

beforeEach(async () => {

    accounts = await web3.eth.getAccounts();

    messageContract = await new web3.eth.Contract(JSON.parse(compiledContract.interface))
                    .deploy({
                        data: compiledContract.bytecode,
                        arguments: ['Hello, eth world!']
                    })
                    .send({
                        from: accounts[0],
                        gas: '1000000'
                    });

});

describe('Messages', async () => {
    it('deploys the contract', async () => {
        assert(messageContract.options.address);
    });

    it('sets the initial message', async () => {
        const initial = await messageContract.methods.message().call();
        assert.equal(initial, 'Hello, eth world!');
    });

    it('requests a new message', async() => {
        await messageContract.methods.requestMessage('new message')
            .send({
                from: accounts[0],
                value: '100'
            });

        const requested = await messageContract.methods.getCurrentRequest().call();
        assert.equal(requested[0], 'new message');
    });
});
