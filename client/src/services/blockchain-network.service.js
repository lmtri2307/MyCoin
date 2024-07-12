import Block from "../classes/Block";
import Blockchain from "../classes/BlockChain";
import Transaction from "../classes/Transaction";
import { MintService } from "./mint.service";
import { NetworkService } from "./network.service";

export const NetworkMessageType = {
    REQUEST_CHAIN: "TYPE_REQUEST_CHAIN",
    SEND_CHAIN: "TYPE_SEND_CHAIN",
    TRANSACTION_CREATED: "TYPE_TRANSACTION_CREATED",
    BLOCK_CREATED: "TYPE_BLOCK_CREATED",
    REQUEST_PUBLIC_ADDRESS: "TYPE_REQUEST_PUBLIC_ADDRESS",
    SEND_PUBLIC_ADDRESS: "TYPE_SEND_PUBLIC_ADDRESS",
};

export class BlockchainNetworkService {
    isDoneSyncChain = false;
    isDoneSyncNodes = false;
    onDoneInitialSync = () => { };
    onProposedBlock = () => { };
    onUpdateChain = () => { };
    nodes = {};

    constructor(blockchainService) {
        this.blockchainService = blockchainService;
        this.networkService = new NetworkService(
            (address) => this._deleteNode(address)
        );

        this.networkService.on(
            NetworkMessageType.REQUEST_CHAIN,
            (data) => this.handleRequestChain(data)
        );
        this.networkService.on(
            NetworkMessageType.SEND_CHAIN,
            (chain) => {
                this.handleSendChain(chain);
            }
        );
        this.networkService.on(
            NetworkMessageType.TRANSACTION_CREATED,
            (data) => this.handleTransactionCreated(data)
        );
        this.networkService.on(
            NetworkMessageType.BLOCK_CREATED,
            (data) => this.handleBlockCreated(data)
        );
        this.networkService.on(
            NetworkMessageType.REQUEST_PUBLIC_ADDRESS,
            (data) => this.handleRequestPublicAddress(data)
        );
        this.networkService.on(
            NetworkMessageType.SEND_PUBLIC_ADDRESS,
            (data) => this.handleSendPublicAddress(data)
        );

        this.init();
    }

    isReady() {
        return this.isDoneSyncChain && this.isDoneSyncNodes;
    }

    _onDoneSyncChain() {
        this.isDoneSyncChain = true;
        this._onDoneInitialSync();
    }

    _onDoneSyncNodes() {
        this.isDoneSyncNodes = true;
        this._onDoneInitialSync();
    }

    _onDoneInitialSync() {
        if (!this.isDoneSyncChain || !this.isDoneSyncNodes) return;
        this.onDoneInitialSync();
    }

    _publicAddressToNetworkAddress(publicAddress) {
        return Object.keys(this.nodes).find(
            networkAddress => this.nodes[networkAddress] === publicAddress
        );
    }

    _addNode(networkAddress, publicAddress) {
        this.nodes[networkAddress] = publicAddress;
        this.blockchainService.updateValidators(Object.values(this.nodes));
        this.onUpdateChain();
    }

    _deleteNode(networkAddress) {
        delete this.nodes[networkAddress];
        this.blockchainService.updateValidators(Object.values(this.nodes));
        this.onUpdateChain();
    }

    init() {
        setTimeout(() => {
            this.syncChain();
            this.syncNodes();
        }, 2000);
    }

    disconnect() {
        this.networkService.disconnect();
    }

    // sync chain with peers
    syncChain() {
        if (this.networkService.amountOfNodes() === 0) {
            this._onDoneSyncChain();
            return;
        }

        const selfAddress = this.networkService.getSelfAddress();
        this.networkService.broadcastMessage(
            this.networkService.produceMessage(
                NetworkMessageType.REQUEST_CHAIN,
                selfAddress
            )
        );
    }

    handleRequestChain(data) {
        const address = data;
        const message = this.networkService.produceMessage(
            NetworkMessageType.SEND_CHAIN, {
            chain: this.blockchainService.blockchainInstance.chain,
        });
        this.networkService.sendToAddress(address, message);
    }

    handleSendChain(data) {
        console.log("handleSendChain", data);
        if (this.isDoneSyncChain) return;

        let { chain } = data;
        chain = chain.map(block => Block.fromJson(block));
        if (chain.length < this.blockchainService.blockchainInstance.lenght) return;

        const tempChain = new Blockchain();
        tempChain.chain = chain;
        if (Blockchain.isValid(tempChain)) {
            this.blockchainService.blockchainInstance.chain = chain;
            this.onUpdateChain();
        }

        this._onDoneSyncChain();
    }

    // get node public addresses
    syncNodes() {
        if (this.networkService.amountOfNodes() === 0) {
            this._onDoneSyncNodes();
            return;
        }
        const selfNetworkAddress = this.networkService.getSelfAddress();
        const selfPublicAddress = this.blockchainService.getWalletAddress();
        const message = this.networkService.produceMessage(
            NetworkMessageType.REQUEST_PUBLIC_ADDRESS,
            {
                networkAddress: selfNetworkAddress,
                publicAddress: selfPublicAddress,
            }
        );
        this.networkService.broadcastMessage(message);
    }

    handleRequestPublicAddress(data) {
        const { networkAddress, publicAddress } = data;
        this._addNode(networkAddress, publicAddress);


        const selfNetworkAddress = this.networkService.getSelfAddress();
        const selfPublicAddress = this.blockchainService.getWalletAddress();
        const message = this.networkService.produceMessage(
            NetworkMessageType.SEND_PUBLIC_ADDRESS,
            {
                networkAddress: selfNetworkAddress,
                publicAddress: selfPublicAddress,
            }
        );
        this.networkService.sendToAddress(networkAddress, message);
    }

    handleSendPublicAddress(data) {
        const { networkAddress, publicAddress } = data;
        this._addNode(networkAddress, publicAddress);

        if (this.networkService.amountOfNodes() === Object.keys(this.nodes).length) {
            this._onDoneSyncNodes();
        }
    }

    // create transaction
    createTransaction(signingKey, toAddress, amount) {
        const address = signingKey.getPublic("hex");
        const newTx = new Transaction(
            address,
            toAddress,
            amount,
        );
        newTx.signTransaction(signingKey);

        const validatorPublicAddress = this.blockchainService.chooseValidator();
        if (validatorPublicAddress === this.blockchainService.getWalletAddress()) {
            this.handleTransactionCreated(newTx);
            return;
        }

        const message = this.networkService.produceMessage(
            NetworkMessageType.TRANSACTION_CREATED,
            newTx);
        const validatorNetworkAddress = this._publicAddressToNetworkAddress(
            validatorPublicAddress
        );
        this.networkService.sendToAddress(validatorNetworkAddress, message);
    }

    createSelfTransaction(toAddress, amount) {
        this.createTransaction(
            this.blockchainService.wallet.signingKeyObj,
            toAddress,
            amount
        );
    }

    hackCoin() {
        this.createTransaction(
            MintService.MINT_KEY_PAIR,
            this.blockchainService.getWalletAddress(),
            10
        );
    }

    handleTransactionCreated(data) {
        this.onProposedBlock();

        const transaction = Transaction.copy(data);
        if (!this.blockchainService.validateTransaction(transaction)) return;

        const block = this.blockchainService.forgeBlock([transaction]);
        this.onUpdateChain();
        const message = this.networkService.produceMessage(
            NetworkMessageType.BLOCK_CREATED,
            {
                block: block,
            }
        );
        this.networkService.broadcastMessage(message);
    }

    // create block
    handleBlockCreated(data) {
        const { block: blockJson } = data;
        const block = Block.fromJson(blockJson);
        this.blockchainService.addBlock(block);
        this.onUpdateChain();
    }
}