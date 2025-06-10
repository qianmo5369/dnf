"use strict";
const common_vendor = require("../common/vendor.js");
let socket = null;
let isManuallyClosed = false;
const listeners = /* @__PURE__ */ new Map();
const ws = {
  connect(token) {
    const url = `wss://wss.hanyunkeji.cn/wss`;
    if (socket)
      common_vendor.index.closeSocket();
    isManuallyClosed = false;
    socket = common_vendor.index.connectSocket({ url });
    common_vendor.index.onSocketOpen(() => {
      common_vendor.index.__f__("log", "at util/ws.js:24", "[WS] Connected11111");
      common_vendor.index.__f__("log", "at util/ws.js:25", `kk   ${token}`);
      ws.send({ type: "auth", token });
    });
    common_vendor.index.onSocketMessage((res) => {
      let msg;
      try {
        msg = JSON.parse(res.data);
      } catch (e) {
        common_vendor.index.__f__("warn", "at util/ws.js:34", "[WS] 非法消息:", res.data);
        return;
      }
      common_vendor.index.__f__("log", "at util/ws.js:38", "收到信息");
      const event = msg.type;
      if (listeners.has(event)) {
        listeners.get(event).forEach((fn) => fn(msg));
      }
    });
    common_vendor.index.onSocketClose(() => {
      common_vendor.index.__f__("warn", "at util/ws.js:47", "[WS] Closed");
      if (!isManuallyClosed) {
        setTimeout(() => ws.connect(token), 3e3);
      }
    });
    common_vendor.index.onSocketError((err) => {
      common_vendor.index.__f__("error", "at util/ws.js:54", "[WS] Error:", err);
    });
  },
  send(data) {
    common_vendor.index.sendSocketMessage({
      data: JSON.stringify(data),
      fail: (err) => common_vendor.index.__f__("warn", "at util/ws.js:61", "[WS] 发送失败", err)
    });
  },
  close() {
    common_vendor.index.__f__("log", "at util/ws.js:66", "zhix w");
    isManuallyClosed = true;
    common_vendor.index.closeSocket();
  },
  on(event, cb) {
    if (!listeners.has(event))
      listeners.set(event, []);
    listeners.get(event).push(cb);
  },
  off(event, cb) {
    if (listeners.has(event)) {
      const arr = listeners.get(event).filter((fn) => fn !== cb);
      listeners.set(event, arr);
    }
  }
};
exports.ws = ws;
//# sourceMappingURL=../../.sourcemap/mp-weixin/util/ws.js.map
