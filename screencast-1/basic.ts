import * as crypto from 'crypto';

// Класс для транзакций
class Transaction {
    fromAddress: string;
    toAddress: string;
    amount: number;

    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
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

    // Вычисление хэша блока
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
}

// Класс для блокчейна
class Blockchain {
    chain: Block[];
    difficulty: number;
    pendingTransactions: Transaction[];
    miningReward: number;

    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    // Создание начального блока
    createGenesisBlock() {
        return new Block('01/01/2024', [], '0');
    }

    // Получение последнего блока
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // Создание транзакции
    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    // Майн блок с транзакциями
    minePendingTransactions(miningRewardAddress) {
        const block = new Block(
            Date.now(),
            this.pendingTransactions,
            this.getLatestBlock().hash
        );
        block.mineBlock(this.difficulty);

        console.log('Блок замайнен и добавлен в цепочку.');
        this.chain.push(block);

        // Вознаграждение майнеру
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    // Получение баланса адреса
    getBalanceOfAddress(address) {
        let balance = 0;

        for (const block of this.chain) {
            for (const transaction of block.transactions) {
                if (transaction.fromAddress === address) {
                    balance -= transaction.amount;
                }

                if (transaction.toAddress === address) {
                    balance += transaction.amount;
                }
            }
        }

        return balance;
    }
}

// Пример использования
const myCoin = new Blockchain();

// Создание транзакций
myCoin.createTransaction(new Transaction('address1', 'address2', 50));
myCoin.createTransaction(new Transaction('address2', 'address1', 20));

// Майн блок с транзакциями
console.log('Майнинг блока...');
myCoin.minePendingTransactions('minerAddress');

// Проверка балансов
console.log(`Баланс address1: ${myCoin.getBalanceOfAddress('address1')}`);
console.log(`Баланс address2: ${myCoin.getBalanceOfAddress('address2')}`);
console.log(`Баланс minerAddress: ${myCoin.getBalanceOfAddress('minerAddress')}`);

// Второй майнинг
console.log('Майнинг второго блока...');
myCoin.minePendingTransactions('minerAddress');

// Проверка балансов после второго майнинга
console.log(`Баланс minerAddress: ${myCoin.getBalanceOfAddress('minerAddress')}`);
