const SHA256 = require('crypto-js/sha256');

class Block {
	
	// constructor which generates all attributes of a block
	constructor(index, timestamp, data, previousHash ='') {
		this.index = index;
		this.timestamp = timestamp;
		this.data = data;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
	}
	
	// function to calculate Hash
	calculateHash() {
		return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
	}
}

class BlockChain {
	
	// constructor which generates the array of block
	constructor() {
		this.chain =[this.createGenesisBlock()];
	}
	
	// function to create the first Block
	createGenesisBlock() {
		return new Block(0, "01/01/2017", "Genesis block", "0");
	}
	
	// function to get the Latest Block of the current blockchain
	getLatestBlock() {
		return this.chain[this.chain.length - 1];
	}
	
	// function to add a Block in the current blockchain
	addBlock(newBlock) {
		newBlock.previousHash = this.getLatestBlock().hash;
		newBlock.hash = newBlock.calculateHash();
		this.chain.push(newBlock);
	}
	
	// function checking the validity of the blockchain
	isChainValid(){
		for(let i = 1; i < this.chain.length; i++) {
			const currentBlock = this.chain[i];
			const previousBlock = this.chain[i-1];
			
			if(currentBlock.hash !== currentBlock.calculateHash()) {
				console.log("Current Block Hash doesn't match with Current Block Calculate Hash");
				return false;
			}
			
			if(currentBlock.previousHash !== previousBlock.hash){
				console.log("Current Block Previous_Hash doesn't match with Previoux Block Hash");
				return false;
			}
		}
		return true;
	}
}

// Create a blockchain
let blockchain1 = new BlockChain();

// Add 2 blocks
blockchain1.addBlock(new Block(1, "10/07/2017", {amount:4}));
blockchain1.addBlock(new Block(2, "12/07/2017", {amount:10}));

// Check if valid
console.log('is Blockchain1 Valid ? '+ blockchain1.isChainValid());


// Try to corrupt the blockchain by falsing value
blockchain1.chain[1].data = {amount: 100};
console.log('is Blockchain1 Valid ? '+ blockchain1.isChainValid());

// Try to corrupt the blockchain by falsing value and changing hash
blockchain1.chain[1].hash = blockchain1.chain[1].calculateHash();
console.log('is Blockchain1 Valid ? '+ blockchain1.isChainValid());

// Show BlockChain values
console.log(JSON.stringify(blockchain1, null, 4));
