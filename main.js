// npm install --save crypto-js

const SHA256 = require('crypto-js/sha256');

class Block {
	constructor(index, timestamp, data, previousHash ='') {
		this.index = index;
		this.timestamp = timestamp;
		this.data = data;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
	}
	
	calculateHash() {
		return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
	}
}

class BlockChain {
	constructor() {
		this.chain =[this.createGenesisBlock()];
	}
	
	createGenesisBlock() {
		return new Block(0, "01/01/2017", "Genesis block", "0");
	}
	
	getLatestBlock() {
		return this.chain[this.chain.length - 1];
	}
	
	addBlock(newBlock) {
		newBlock.previousHash = this.getLatestBlock().hash;
		newBlock.hash = newBlock.calculateHash();
		this.chain.push(newBlock);
	}
	
	isChainValid(){
		for(let i = 1; i < this.chain.length; i++) {
			const currentBlock = this.chain[i];
			const previousBlock = this.chain[i-1];
			
			if(currentBlock.hash !== currentBlock.calculateHash()) {
				console.log("Current Block Hash doesn't match with Current Block Calculate Hash");
				console.log("Current Block index : "+ i);
				console.log("Some data had changed !");
				return false;
			}
			
			if(currentBlock.previousHash !== previousBlock.hash){
				console.log("Current Block Previous_Hash doesn't match with Previoux Block Hash");
				console.log("Current Block index : "+ i);
				console.log("Current Block Previous_Hash :  " + currentBlock.previousHash);
				console.log("Previous Block Hash :  " + previousBlock.hash);
				return false;
			}
		}
		return true;
	}
}

let blockchain1 = new BlockChain();
blockchain1.addBlock(new Block(1, "10/07/2017", {amount:4}));

blockchain1.addBlock(new Block(2, "12/07/2017", {amount:10}));

console.log('is Blockchain1 Valid ? '+ blockchain1.isChainValid());

blockchain1.chain[1].data = {amount: 100};
console.log('is Blockchain1 Valid ? '+ blockchain1.isChainValid());
blockchain1.chain[1].hash = blockchain1.chain[1].calculateHash();
console.log('is Blockchain1 Valid ? '+ blockchain1.isChainValid());
console.log(JSON.stringify(blockchain1, null, 4));
