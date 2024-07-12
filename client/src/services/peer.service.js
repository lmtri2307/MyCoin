import socketIoClient from "socket.io-client";
import Peer from "simple-peer";

export class PeerService {
    peers = {};
    ws = null;
    address = "";
    onMessageHandler = (message) => { }; // data: {type, data}

    constructor(onDataHandler, onPeerClosed) {
        this.onMessageHandler = onDataHandler;
        this.onPeerClosed = onPeerClosed; // (address) => {}

        this.ws = socketIoClient(process.env.REACT_APP_API);

        this.ws.on("me", id => {
            this.address = id;

            this.ws.emit("open", id);
        });

        this.ws.on("welcome", address => this.welcome(address));

        this.ws.on("openedSockets", socketAddresses => {
            socketAddresses.forEach(address => this.handshake(address));
        });

        this.ws.on("receiveSignal", ({ from, data }) => {
            this.peers[from].signal(data);
        });

        this.ws.on("peerClosed", address => {
            this._removePeer(address);
        });
    }

    _addPeer(address, peer) {
        this.peers[address] = peer;
    }

    _removePeer(address) {
        if(!this.peers[address]) return;

        this.peers[address].destroy();
        delete this.peers[address];
        this.onPeerClosed(address);
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
            this._removePeer(address);
        });

        this._addPeer(address, peer);
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
            this.peers[address].send(JSON.stringify(message));
        }
    }

    sendToAddress(address, message) {
        this.peers[address].send(JSON.stringify(message));
    }

    close() {
        for (const address in this.peers) {
            this.peers[address].destroy();
        }
        this.ws.close();
    }
}