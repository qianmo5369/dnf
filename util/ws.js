// utils/ws.js

let socket = null;
let reconnectTimer = null;
let isManuallyClosed = false;

const listeners = new Map();

const ws = {
  connect(token) {
    const url = `wss://wss.hanyunkeji.cn/wss`;
	

    if (socket) uni.closeSocket();
    isManuallyClosed = false;

    socket = uni.connectSocket({ url });
	// 在连接 WebSocket 时直接加上 token 参数
	// const socket = new WebSocket(`wss://wss.hanyunkeji.cn:2346/?token=${token}`)


    // ✅ 全局监听 WebSocket 事件（UniApp 的正确方式）
    uni.onSocketOpen(() => {
      console.log('[WS] Connected11111');
	  console.log(`kk   ${token}`);
      ws.send({ type: 'auth', token });
    });

    uni.onSocketMessage((res) => {
      let msg;
      try {
        msg = JSON.parse(res.data);
      } catch (e) {
        console.warn('[WS] 非法消息:', res.data);
        return;
      }
	  
	  console.log("收到信息");

      const event = msg.type;
      if (listeners.has(event)) {
        listeners.get(event).forEach(fn => fn(msg));
      }
    });

    uni.onSocketClose(() => {
      console.warn('[WS] Closed');
      if (!isManuallyClosed) {
        reconnectTimer = setTimeout(() => ws.connect(token), 3000);
      }
    });

    uni.onSocketError((err) => {
      console.error('[WS] Error:', err);
    });
  },

  send(data) {
    uni.sendSocketMessage({
      data: JSON.stringify(data),
      fail: (err) => console.warn('[WS] 发送失败', err)
    });
  },

  close() {
	  console.log("zhix w");
    isManuallyClosed = true;
    uni.closeSocket();
  },

  on(event, cb) {
    if (!listeners.has(event)) listeners.set(event, []);
    listeners.get(event).push(cb);
  },

  off(event, cb) {
    if (listeners.has(event)) {
      const arr = listeners.get(event).filter(fn => fn !== cb);
      listeners.set(event, arr);
    }
  }
};

export default ws;
