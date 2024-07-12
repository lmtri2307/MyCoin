import { PeerService } from "./peer.service";

export class NetworkService {
  handlers = {};

  constructor(onNodeClosed) {
    this.peerService = new PeerService(
      (data) => this.handlePeerData(data),
      onNodeClosed,
    );
  }

  produceMessage(type, data) {
    return { type, data };
  }

  broadcastMessage(message) {
    this.peerService.broadcastMessage(message);
  }

  sendToAddress(address, message) {
    this.peerService.sendToAddress(address, message);
  }

  amountOfNodes() {
    return Object.keys(this.peerService.peers).length;
  }

  selfAddress() {
    return this.peerService.address;
  }

  disconnect() {
    this.peerService.close();
  }

  on(messgaeType, callback) {
    this.handlers[messgaeType] = callback;
  }

  handlePeerData(data) {
    const message = JSON.parse(data);
    console.log("recive data", message.type)

    const handler = this.handlers[message.type];
    if (handler) {
      handler(message.data);
    }
  }

  getSelfAddress() {
    return this.peerService.address;
  }
}