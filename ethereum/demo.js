const Web3 = require('web3');
const CompiledContract = require('./build/Messages.json');

const provider = new Web3.providers.HttpProvider(
    'http://127.0.0.1:7545'
);
web3 = new Web3(provider);

const instance = new web3.eth.Contract(
    JSON.parse(CompiledContract.interface),
    '0x28a99e8B37E9afC7D9D1332Ba380cd8b84fDbEc2'
);

(async () => {

    const showMessage = async () => {
        const msg = await instance.methods.message().call();
        console.log("Current message:", msg);
    }

    showMessage();

    const accounts = await web3.eth.getAccounts();
    console.log("First account:", accounts[0]);

    showMessage();

    await instance.methods.requestMessage('test new message').send({
        from: accounts[0],
         value: '100'
    });

    const current = await instance.methods.getCurrentRequest().call();
    console.log(`'${current[0]}' requested by ${current[1]} for ${current[2]}`);

    showMessage();

    await instance.methods.setMessage().send({
        from: accounts[0],
        gas: '1000000'
    });

    showMessage();

})();

