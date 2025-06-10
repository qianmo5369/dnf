// 本文件由FirstUI授权予陈*强（会员ID：5  17）专用，请尊重知识产权，勿私下传播，违者追究法律责任。
/**
 * 获取屏幕的宽高
 */

let windowWidth = 0
let windowHeight = 0
uni.getSystemInfo({
  success(res) {
    windowWidth = res.windowWidth
    windowHeight = res.windowHeight
  }
})

const getSystemInfo = () => {
  return [ windowWidth, windowHeight ]
}

const bindInstance = () => {
  let instance = {}

  return {
    /**
     * 提供键名，绑定对象值
     */
    set: (bindName, data = null) => {
      if (!instance[bindName]) {
        instance[bindName] = data
      }
      return instance[bindName] || {}
    },
    get: (bindName) => {
      return instance[bindName] || {}
    },
    /**
     * 清除实例对象的所有缓存值
     */
    clear: () => {
      instance = {}
    },
    /**
     * 清楚实例对象特定的键
     */
    remove: (bindName) => {
      instance[bindName] && delete instance[bindName]
    }
  }
};

export default {
  getSystemInfo,
  cacheInstance: bindInstance(),
}