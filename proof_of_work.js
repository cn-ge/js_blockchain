// npm install --save crypto-js
// https://www.youtube.com/watch?v=HneatE69814


const SHA256 = require('crypto-js/sha256');

class Block {
	constructor(index, timestamp, data, previousHash ='') {
		this.index = index;
		this.timestamp = timestamp;
		this.data = data;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
		this.nonce = 0;
	}
	
	calculateHash() {
		return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
	}
	
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
	constructor() {
		this.chain =[this.createGenesisBlock()];
		this.difficulty = 2;
	}
	
	createGenesisBlock() {
		return new Block(0, "01/01/2017", "Genesis block", "0");
	}
	
	getLatestBlock() {
		return this.chain[this.chain.length - 1];
	}
	
	addBlock(newBlock) {
		newBlock.previousHash = this.getLatestBlock().hash;
		// ce hash sera généré dans la fonction mineBlock, en ajoutant la valeur 1 à nonce, jusqu'à ce que le hash commence par x 0 selon la difficulté demandée)
		newBlock.mineBlock(this.difficulty);
		this.chain.push(newBlock);
	}
	
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

let blockchain1 = new BlockChain();

console.log("Mining block 1...");
blockchain1.addBlock(new Block(1, "10/07/2017", {amount:4}));

console.log("Mining block 2...");
blockchain1.addBlock(new Block(2, "12/07/2017", {amount:10}));


/*
console.log('is Blockchain1 Valid ? '+ blockchain1.isChainValid());

blockchain1.chain[1].data = {amount: 100};
console.log('is Blockchain1 Valid ? '+ blockchain1.isChainValid());
blockchain1.chain[1].hash = blockchain1.chain[1].calculateHash();
console.log('is Blockchain1 Valid ? '+ blockchain1.isChainValid());
console.log(JSON.stringify(blockchain1, null, 4));
*/