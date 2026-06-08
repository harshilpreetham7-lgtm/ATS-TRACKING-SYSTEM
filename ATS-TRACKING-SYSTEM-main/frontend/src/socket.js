const noopSocket = {
  connected: false,
  auth: { token: localStorage.getItem('ats_token') },
  on() {
    return noopSocket;
  },
  off() {
    return noopSocket;
  },
  emit() {
    return noopSocket;
  },
  connect() {
    noopSocket.connected = true;
    return noopSocket;
  },
  disconnect() {
    noopSocket.connected = false;
    return noopSocket;
  },
};

export const connectSocket = () => noopSocket;
export const disconnectSocket = () => noopSocket.disconnect();
export const emitSocketEvent = () => noopSocket;

export default noopSocket;
