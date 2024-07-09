import socketIoClient from "socket.io-client";
import Peer from "simple-peer";

export class PeerService {
    peers = {};
    ws = null;
    address = "";
    onMessageHandler = (message) => { }; // data: {type, data}

    constructor(onDataHandler) {
        this.onMessageHandler = onDataHandler;
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

        this.ws.on("receiveSignal", ({ from, data }) => {
            this.peers[from].signal(data);
        });

        this.ws.on("peerClosed", address => {
            delete this.peers[address];
        });
    }

    createPeer(address, initiator) {
        const peer = new Peer({ initiator: initiator });

        peer.on("signal", data => {
            this.ws.emit("sendSignal", {
                from: this.address,
                to: address,
                data,
            });
        });

        peer.on("data", data => {
            this.onMessageHandler(data);
        });

        peer.on("close", () => {
        });

        this.peers[address] = peer;
    }

    welcome(address) {
        this.createPeer(address, true);
    }

    handshake(address) {
        this.createPeer(address, false);
    }

    broadcastMessage(message) {
        for (const address in this.peers) {
            this.peers[address].send(JSON.stringify(message));
        }
    }
}