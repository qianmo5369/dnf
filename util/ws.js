// src/utils/ws.js

let socketConnected = false;
let isConnecting = false;
let currentToken = '';
let shouldReconnect = true;
let reconnectDelay = 3000;
let reconnectTimer = null;
let inited = false;

const listeners = new Map();

// 注册一次监听
function initSocketListeners() {
  if (inited) return;
  inited = true;
  uni.onSocketOpen(() => {
    console.log('[WS] onSocketOpen');
    socketConnected = true;
    isConnecting = false;
    if (currentToken) {
      uni.sendSocketMessage({ data: JSON.stringify({ type: 'auth', token: currentToken }) });
    }
    triggerEvent('open');
  });
  uni.onSocketMessage(res => {
    let msg;
    try { msg = JSON.parse(res.data); }
    catch (e) { console.warn('[WS] 非法消息', res.data); return; }
    const ev = msg.type;
    if (listeners.has(ev)) {
      listeners.get(ev).forEach(fn => { try { fn(msg); } catch {} });
    }
  });
  uni.onSocketClose(res => {
    console.warn('[WS] onSocketClose', res);
    socketConnected = false;
    isConnecting = false;
    triggerEvent('close');
    if (shouldReconnect && currentToken) {
      console.log(`[WS] ${reconnectDelay}ms 后自动重连`);
      if (reconnectTimer) clearTimeout(reconnectTimer);
      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        if (shouldReconnect) connect(currentToken);
      }, reconnectDelay);
    }
  });
  uni.onSocketError(err => {
    console.error('[WS] onSocketError', err);
    if ((socketConnected || isConnecting) && shouldReconnect && currentToken) {
      console.log('[WS] 错误发生，关闭后重连');
      socketConnected = false;
      isConnecting = false;
      try { uni.closeSocket(); } catch {}
      if (reconnectTimer) clearTimeout(reconnectTimer);
      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        if (shouldReconnect) connect(currentToken);
      }, reconnectDelay);
    }
    triggerEvent('error', err);
  });
}

function triggerEvent(event, payload) {
  if (listeners.has(event)) {
    listeners.get(event).forEach(fn => {
      try { fn(payload); } catch (e) { console.error(e); }
    });
  }
}

function connect(token) {
  if (!token) {
    console.warn('[WS] connect: token 为空');
    return;
  }
  currentToken = token;
  shouldReconnect = true;
  initSocketListeners();
  if (socketConnected || isConnecting) {
    console.log('[WS] connect: 已有连接或正在连接，先关闭再重连');
    try { uni.closeSocket(); } catch {}
    return;
  }
  console.log('[WS] 发起连接');
  isConnecting = true;
  uni.connectSocket({ url: 'wss://wss.hanyunkeji.cn/wss' });
}

function send(data) {
  if (socketConnected) {
    uni.sendSocketMessage({ data: JSON.stringify(data),
      fail: err => console.warn('[WS] send 失败', err)
    });
  } else {
    console.warn('[WS] send: 未连接，消息未发送', data);
  }
}

function close() {
  console.log('[WS] 手动关闭，不再自动重连');
  shouldReconnect = false;
  if (socketConnected || isConnecting) {
    try { uni.closeSocket(); } catch {}
  }
  socketConnected = false;
  isConnecting = false;
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
}

function on(event, cb) {
  if (!listeners.has(event)) listeners.set(event, []);
  listeners.get(event).push(cb);
}

function off(event, cb) {
  if (listeners.has(event)) {
    listeners.set(event, listeners.get(event).filter(fn => fn !== cb));
  }
}

function isConnected() { return socketConnected; }
function isConnectingFn() { return isConnecting; }

// 默认导出一个对象
export default {
  connect,
  send,
  close,
  on,
  off,
  isConnected,
  isConnecting: isConnectingFn
};
