import * as crypto from 'crypto';

class SmartContract {
    id: string;
    code: any;
    state: any;

    constructor(id: string, code: any, initialState: any = {}) {
        this.id = id;
        this.code = code;
        this.state = initialState;
    }

    execute(functionName: string, args: any[] = []) {
        if (typeof this.code[functionName] !== 'function') {
            throw new Error(`Function ${functionName} not found in contract.`);
        }

        this.code[functionName](this.state, ...args);
    }
}

function extractPublicKey(address: string): crypto.KeyObject {
    return crypto.createPublicKey({
        key: address,
        format: 'pem',
    });
}

// Класс для транзакций
class Transaction {
    fromAddress: string;
    toAddress: string;
    amount: number;
    signature: string;

    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.signature = '';
    }

    calculateHash() {
        return crypto
            .createHash('sha256')
            .update(this.fromAddress + this.toAddress + this.amount)
            .digest('hex');
    }

    signTransaction(privateKey: crypto.KeyObject) {
        if (!this.fromAddress) {
            throw new Error('Транзакции без отправителя не могут быть подписаны.');
        }

        const signer = crypto.createSign('SHA256');
        signer.update(this.calculateHash()).end();

        this.signature = signer.sign(privateKey, 'hex');
    }

    isValid(publicKey: crypto.KeyObject) {
        if (this.fromAddress === null) return true; // Награды майнера

        if (!this.signature || this.signature.length === 0) {
            throw new Error('Транзакция не подписана.');
        }

        const verifier = crypto.createVerify('SHA256');
        verifier.update(this.calculateHash());

        return verifier.verify(publicKey, this.signature, 'hex');
    }
}

class ContractTransaction extends Transaction {
    contractId: string | null;
    functionName: string | null;
    args: any[];

    constructor(fromAddress: string, contractId: string, functionName: string, args: any[] = []) {
        super(fromAddress, contractId, 0);
        this.contractId = contractId;
        this.functionName = functionName;
        this.args = args;
    }
}


// Класс для блока
class Block {
    timestamp: number;
    transactions: Transaction[];
    previousHash: string;
    hash: string;
    nonce: number;

    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return crypto
            .createHash('sha256')
            .update(
                this.previousHash +
                this.timestamp +
                JSON.stringify(this.transactions) +
                this.nonce
            )
            .digest('hex');
    }

    // Proof of Work
    mineBlock(difficulty) {
        while (!this.hash.startsWith('0'.repeat(difficulty))) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log(`Блок успешно замайнен: ${this.hash}`);
    }

    hasValidTransactions() {
        return this.transactions.every(tx => tx.isValid(tx.fromAddress ? extractPublicKey(tx.fromAddress) : null));
    }
}

// Класс для блокчейна
class Blockchain {
    chain: Block[];
    difficulty: number;
    pendingTransactions: Transaction[];
    miningReward: number;
    contracts: Map<string, SmartContract>;

    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 3;
        this.contracts = new Map();
    }

    createGenesisBlock() {
        return new Block('01/01/2024', [], '0');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    createContract(code: any, initialState: any = {}) {
        const contractId = crypto.randomUUID();
        const contract = new SmartContract(contractId, code, initialState);
        this.contracts.set(contractId, contract);
        console.log(`Smart contract deployed with ID: ${contractId}`);
        return contractId;
    }

    createTransaction(transaction: Transaction) {
        if (!transaction.isValid(extractPublicKey(transaction.fromAddress))) {
            throw new Error('Невалидная транзакция.');
        }

        this.pendingTransactions.push(transaction);
    }

    minePendingTransactions(miningRewardAddress: string) {
        this.pendingTransactions.push(new Transaction(null, miningRewardAddress, this.miningReward));

        for (const transaction of this.pendingTransactions) {
            if (transaction instanceof ContractTransaction) {
                if (!transaction.contractId || !this.contracts.has(transaction.contractId)) {
                    throw new Error('Контракт не найден или транзакция некорректна.');
                }

                const contract = this.contracts.get(transaction.contractId);
                contract.execute(transaction.functionName, transaction.args);
            }
        }

        // Создаём новый блок с обработанными транзакциями
        const block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);

        // Майн блок с учётом установленной сложности
        block.mineBlock(this.difficulty);

        console.log('Блок замайнен и добавлен в цепочку.');

        // Добавляем блок в цепочку
        this.chain.push(block);

        // Очищаем список ожидающих транзакций
        this.pendingTransactions = [];
    }

}


const myCoin = new Blockchain();

console.log("Блокчейн создан!");

const user1KeyPair = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
});

const publicKey1 = user1KeyPair.publicKey;
const privateKey1 = user1KeyPair.privateKey;

const user2KeyPair = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
});

const publicKey2 = user2KeyPair.publicKey;
const privateKey2 = user2KeyPair.privateKey;

const minerKeyPair = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
});

const minerPublicKey = minerKeyPair.publicKey;

const user1Address = publicKey1.export({ type: 'pkcs1', format: 'pem' });
const user2Address = publicKey2.export({ type: 'pkcs1', format: 'pem' });
const minerAddress = minerPublicKey.export({ type: 'pkcs1', format: 'pem' });

const tx1 = new Transaction(user1Address.toString(), user2Address.toString(), 10);
tx1.signTransaction(privateKey1);
myCoin.createTransaction(tx1);

const counterCode = {
    increment(state: any) {
        if (!state.counter) state.counter = 0;
        state.counter += 1;
    },
    getCounter(state: any) {
        console.log('Counter value:', state.counter);
    },
};

const contractId = myCoin.createContract(counterCode);

const contract = myCoin.contracts.get(contractId);
contract.execute('getCounter'); // 0

const tx2 = new ContractTransaction(user2Address.toString(), contractId, 'increment');
tx2.signTransaction(privateKey2);
myCoin.createTransaction(tx2);

const tx3 = new ContractTransaction(user1Address.toString(), contractId, 'increment');
tx3.signTransaction(privateKey1);
myCoin.createTransaction(tx3);

console.log('Начало майнинга...');
myCoin.minePendingTransactions(minerAddress.toString());

// Check the contract state
contract.execute('getCounter'); // 2