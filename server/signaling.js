let opened = [];

export const signalingHandler = (socket, io) => {
  const startOpenState = address => {
    socket.broadcast.emit("welcome", address);
    opened.push(address);
  };

  const sendSignalHandler = ({ from, to, data }) => {
    socket.broadcast.to(to).emit("receiveSignal", { from, data });
  };

  socket.on("open", startOpenState);
  socket.on("sendSignal", sendSignalHandler);
  socket.emit("openedSockets", opened);
  socket.on("disconnect", () => {
    opened = opened.filter(address => address !== socket.id);
    socket.broadcast.emit("peerClosed", socket.id);
  });
};