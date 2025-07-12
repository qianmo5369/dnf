"use strict";
const common_vendor = require("../common/vendor.js");
let socketConnected = false;
let isConnecting = false;
let currentToken = "";
let shouldReconnect = true;
let reconnectDelay = 3e3;
let reconnectTimer = null;
let inited = false;
const listeners = /* @__PURE__ */ new Map();
function initSocketListeners() {
  if (inited)
    return;
  inited = true;
  common_vendor.index.onSocketOpen(() => {
    common_vendor.index.__f__("log", "at util/ws.js:18", "[WS] onSocketOpen");
    socketConnected = true;
    isConnecting = false;
    if (currentToken) {
      common_vendor.index.sendSocketMessage({ data: JSON.stringify({ type: "auth", token: currentToken }) });
    }
    triggerEvent("open");
  });
  common_vendor.index.onSocketMessage((res) => {
    let msg;
    try {
      msg = JSON.parse(res.data);
    } catch (e) {
      common_vendor.index.__f__("warn", "at util/ws.js:29", "[WS] 非法消息", res.data);
      return;
    }
    const ev = msg.type;
    if (listeners.has(ev)) {
      listeners.get(ev).forEach((fn) => {
        try {
          fn(msg);
        } catch {
        }
      });
    }
  });
  common_vendor.index.onSocketClose((res) => {
    common_vendor.index.__f__("warn", "at util/ws.js:36", "[WS] onSocketClose", res);
    socketConnected = false;
    isConnecting = false;
    triggerEvent("close");
    if (shouldReconnect && currentToken) {
      common_vendor.index.__f__("log", "at util/ws.js:41", `[WS] ${reconnectDelay}ms 后自动重连`);
      if (reconnectTimer)
        clearTimeout(reconnectTimer);
      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        if (shouldReconnect)
          connect(currentToken);
      }, reconnectDelay);
    }
  });
  common_vendor.index.onSocketError((err) => {
    common_vendor.index.__f__("error", "at util/ws.js:50", "[WS] onSocketError", err);
    if ((socketConnected || isConnecting) && shouldReconnect && currentToken) {
      common_vendor.index.__f__("log", "at util/ws.js:52", "[WS] 错误发生，关闭后重连");
      socketConnected = false;
      isConnecting = false;
      try {
        common_vendor.index.closeSocket();
      } catch {
      }
      if (reconnectTimer)
        clearTimeout(reconnectTimer);
      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        if (shouldReconnect)
          connect(currentToken);
      }, reconnectDelay);
    }
    triggerEvent("error", err);
  });
}
function triggerEvent(event, payload) {
  if (listeners.has(event)) {
    listeners.get(event).forEach((fn) => {
      try {
        fn(payload);
      } catch (e) {
        common_vendor.index.__f__("error", "at util/ws.js:69", e);
      }
    });
  }
}
function connect(token) {
  if (!token) {
    common_vendor.index.__f__("warn", "at util/ws.js:76", "[WS] connect: token 为空");
    return;
  }
  currentToken = token;
  shouldReconnect = true;
  initSocketListeners();
  if (socketConnected || isConnecting) {
    common_vendor.index.__f__("log", "at util/ws.js:83", "[WS] connect: 已有连接或正在连接，先关闭再重连");
    try {
      common_vendor.index.closeSocket();
    } catch {
    }
    return;
  }
  common_vendor.index.__f__("log", "at util/ws.js:87", "[WS] 发起连接");
  isConnecting = true;
  common_vendor.index.connectSocket({ url: "wss://wss.hanyunkeji.cn/wss" });
}
function send(data) {
  if (socketConnected) {
    common_vendor.index.sendSocketMessage({
      data: JSON.stringify(data),
      fail: (err) => common_vendor.index.__f__("warn", "at util/ws.js:95", "[WS] send 失败", err)
    });
  } else {
    common_vendor.index.__f__("warn", "at util/ws.js:98", "[WS] send: 未连接，消息未发送", data);
  }
}
function close() {
  common_vendor.index.__f__("log", "at util/ws.js:103", "[WS] 手动关闭，不再自动重连");
  shouldReconnect = false;
  if (socketConnected || isConnecting) {
    try {
      common_vendor.index.closeSocket();
    } catch {
    }
  }
  socketConnected = false;
  isConnecting = false;
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
}
function on(event, cb) {
  if (!listeners.has(event))
    listeners.set(event, []);
  listeners.get(event).push(cb);
}
function off(event, cb) {
  if (listeners.has(event)) {
    listeners.set(event, listeners.get(event).filter((fn) => fn !== cb));
  }
}
function isConnected() {
  return socketConnected;
}
function isConnectingFn() {
  return isConnecting;
}
const ws = {
  connect,
  send,
  close,
  on,
  off,
  isConnected,
  isConnecting: isConnectingFn
};
exports.ws = ws;
//# sourceMappingURL=../../.sourcemap/mp-weixin/util/ws.js.map
