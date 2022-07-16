require("dotenv").config()

const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const MY_CONTRACT_ADD = process.env.MY_CONTRACT_ADD;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(API_URL)

const contract = require("../artifacts/contracts/MiguelNFT.sol/MiguelNFT.json")
const nftContract = new web3.eth.Contract(contract.abi, MY_CONTRACT_ADD)


async function mintNFT(tokenURI) {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); //get latest nonce

    //the transaction
    const tx = {
        'from': PUBLIC_KEY,
        'to': MY_CONTRACT_ADD,
        'nonce': nonce,
        'gas': 500000,
        'data': nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI()
    };

    const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)

    signPromise
    .then((signedTx) => {
        web3.eth.sendSignedTransaction(
            signedTx.rawTransaction,
            function (err, hash) {
                if (!err) {
                    console.log(
                        "The hash of your transaction is: ",
                        hash,
                        "\nCheck Alchemy's Mempool to view the status of your transaction!"
                    )
                } else {
                    console.log(
                        "Something went wrong when submitting your transaction:",
                        err
                    )
                }
            }
        )
    })
    .catch((err) => {
        console.log(" Promise failed:", err)
    })
}

mintNFT("ipfs://Qmawcc2CrCQwbbf8oHGxv4b2WCX5RwDeEgVRoYDymgQdXR")