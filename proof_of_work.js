// npm install --save crypto-js
// https://www.youtube.com/watch?v=HneatE69814


const SHA256 = require('crypto-js/sha256');

class Block {
	
	// constructor which generates all attributes of a block
	// nonce will be used for the proof of work
	constructor(index, timestamp, data, previousHash ='') {
		this.index = index;
		this.timestamp = timestamp;
		this.data = data;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
		this.nonce = 0;
	}
	
	// function to calculate Hash
	calculateHash() {
		return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
	}
	
	// function to mine a new block with a difficulty paramater
	mineBlock(difficulty) {
		// substring(0, difficulty) 
		// extrait les strings entre les 2 indices
		// Array(difficulty + 1) 
		// signifie : créer un tableau de 3 cases
		// Array(difficulty + 1).join("0")
		// signifie : concatene les valeurs du tableau avec le séparateur '0'
		// Résultat : ''0''0'' => 00
		while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
			this.nonce++;
			this.hash = this.calculateHash();
		}
		
		console.log("Block mined avec le hash : " + this.hash);
	}
}

class BlockChain {
	
	// constructor which generates the array of block
	constructor() {
		this.chain =[this.createGenesisBlock()];
		this.difficulty = 2;
	}
	
	// function to create the first Block
	createGenesisBlock() {
		return new Block(0, "01/01/2017", "Genesis block", "0");
	}
	
	// function to get the Latest Block of the current blockchain
	getLatestBlock() {
		return this.chain[this.chain.length - 1];
	}
	
	// function to add a Block in the current blockchain using the mineBlock() function
	addBlock(newBlock) {
		newBlock.previousHash = this.getLatestBlock().hash;
		// This.hash will be generated in mineBlock() function, adding  1 at nonce value, until this.hash begin with x 0, x equal difficulty)
		newBlock.mineBlock(this.difficulty);
		this.chain.push(newBlock);
	}
	
	// function checking the validity of the blockchain
	isChainValid(){
		for(let i = 1; i < this.chain.length; i++) {
			const currentBlock = this.chain[i];
			const previousBlock = this.chain[i-1];
			
			if(currentBlock.hash !== currentBlock.calculateHash()) {
				return false;
			}
			
			if(currentBlock.previousHash !== previousBlock.hash){
				return false;
			}
		}
		return true;
	}
}

// Create a blockchain
let blockchain1 = new BlockChain();


// Add 2 blocks
console.log("Mining block 1...");
blockchain1.addBlock(new Block(1, "10/07/2017", {amount:4}));

console.log("Mining block 2...");
blockchain1.addBlock(new Block(2, "12/07/2017", {amount:10}));


console.log(blockchain1.isChainValid());
blockchain1.chain[1].data = {amount: 100};
blockchain1.chain[1].hash = blockchain1.chain[1].calculateHash();
console.log(blockchain1.isChainValid());
