import socketIoClient from "socket.io-client";
import Peer from "simple-peer";

export class PeerService {
    peers = {};
    ws = null;
    address = "";
    onMessageHandler = (message) => { }; // data: {type, data}

    constructor(onDataHandler, blockchainService) {
        this.onMessageHandler = onDataHandler;
        this.blockchainService = blockchainService;
        this.ws = socketIoClient(process.env.REACT_APP_API);

        this.ws.on("me", id => {
            this.address = id;

            this.ws.emit("open", id);
        });

        this.ws.on("welcome", address => this.welcome(address));

        this.ws.on("openedSockets", socketAddresses => {
            socketAddresses.forEach(address => this.handshake(address));

            // if (socketAddresses.length === 0) {
            //     const transaction = new Transaction(
            //         MintService.MINT_PUBLIC_ADDRESS,
            //         this.blockchainService.getWalletAddress(),
            //         10,
            //     );

            //     transaction.signTransaction(MintService.MINT_KEY_PAIR);
            //     this.blockchainService.addTransaction(transaction);
            // }

            // setTimeout(() => {
            //     const message = this.produceMessage("TYPE_REQUEST_CHAIN", this.address);
            //     this.sendMessage(message);
            // }, 2000);

            // setTimeout(() => {
            //     const message = this.produceMessage("TYPE_REQUEST_INFO", this.address);
            //     this.sendMessage(message);
            // }, 3000);
        });

        this.ws.on("receiveSignal", ({ from, data, publicAddress }) => {
            this._addPeer(from, this.peers[from].peer, publicAddress);
            this.peers[from].peer.signal(data);
        });

        this.ws.on("peerClosed", address => {
            delete this.peers[address];
        });
    }

    _addPeer(address, peer, publicAddress) {
        this.peers[address] = {
            peer,
            publicAddress,
        };
        const validators = Object.keys(this.peers)
            .map(address => this.peers[address].publicAddress);
        this.blockchainService.updateValidators(validators);
    }

    _removePeer(address) {
        const publicAddress = this.peers[address].publicAddress;
        this.blockchainService.validators = this.blockchainService.validators.filter(
            validator => validator !== publicAddress
        );
        this.peers[address].peer.destroy();
        delete this.peers[address];
    }

    createPeer(address, initiator) {
        const peer = new Peer({ initiator: initiator });

        peer.on("signal", data => {
            this.ws.emit("sendSignal", {
                from: this.address,
                to: address,
                publicAddress: this.blockchainService.getWalletAddress(),
                data,
            });
        });

        peer.on("data", data => {
            this.onMessageHandler(data);
        });

        peer.on("close", () => {
            delete this.peers[address];
        });

        this._addPeer(address, peer, "");
        console.log("peers length", Object.keys(this.peers).length);
        console.log("unique peers length", new Set(Object.keys(this.peers)).size);
    }

    welcome(address) {
        this.createPeer(address, true);
    }

    handshake(address) {
        this.createPeer(address, false);
    }

    broadcastMessage(message) {
        for (const address in this.peers) {
            this.peers[address].peer.send(JSON.stringify(message));
        }
    }

    sendToAddress(address, message) {
        this.peers[address].peer.send(JSON.stringify(message));
    }

    getPeers() {
        return this.peers;
    }
}