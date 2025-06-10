"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  name: "fui-steps",
  emits: ["click"],
  props: {
    items: {
      type: Array,
      default() {
        return [];
      }
    },
    titleKey: {
      type: String,
      default: "title"
    },
    descrKey: {
      type: String,
      default: "descr"
    },
    textKey: {
      type: String,
      default: "text"
    },
    srcKey: {
      type: String,
      default: "src"
    },
    activeSrcKey: {
      type: String,
      default: "activeSrc"
    },
    current: {
      type: [Number, String],
      default: 0
    },
    //row/column
    direction: {
      type: String,
      default: "row"
    },
    padding: {
      type: Array,
      default() {
        return [];
      }
    },
    background: {
      type: String,
      default: "transparent"
    },
    height: {
      type: [Number, String],
      default: 50
    },
    nodeColor: {
      type: String,
      default: "#ccc"
    },
    color: {
      type: String,
      default: "#181818"
    },
    size: {
      type: [Number, String],
      default: 32
    },
    fontWeight: {
      type: [Number, String],
      default: 400
    },
    descrColor: {
      type: String,
      default: "#B2B2B2"
    },
    descrSize: {
      type: [Number, String],
      default: 24
    },
    activeColor: {
      type: String,
      default: ""
    },
    //V1.9.8+ 设置当前步骤的状态 wait /  fail / success
    processStatus: {
      type: String,
      default: ""
    },
    //V1.9.8+ 设置当前步骤的状态 颜色
    processColor: {
      type: String,
      default: ""
    },
    radius: {
      type: String,
      default: "0rpx"
    },
    //完成到当前步骤时是否需要对号标识
    isMark: {
      type: Boolean,
      default: true
    },
    isWait: {
      type: Boolean,
      default: false
    },
    //步骤线条是否加粗 V1.9.8+
    lineBold: {
      type: Boolean,
      default: false
    },
    //V2.1.0+ item项之间间隔，仅纵向有效
    itemGap: {
      type: [Number, String],
      default: 64
    },
    //V2.1.0+ 当默认节点为小圆点时线条是否贯穿，仅横向有效
    lineThrough: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    getStyles() {
      let styles = `height:${this.height}rpx`;
      if (this.direction === "column") {
        styles = `width:${this.height}rpx`;
      }
      return styles;
    },
    getActiveColor() {
      let color = this.activeColor;
      return color;
    }
  },
  data() {
    let isNvue = false;
    return {
      isNvue
    };
  },
  methods: {
    getColor(index, current, isLine, isRight) {
      let color = this.getActiveColor;
      if (index === current || index === current - 1 && !this.isWait && isLine && isRight) {
        color = this.processColor || color;
      }
      return color;
    },
    handleClick(index) {
      this.$emit("click", {
        index,
        ...this.items[index]
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($props.items, (item, index, i0) => {
      return common_vendor.e($props.direction === "row" ? {
        a: common_vendor.n("fui-steps__line-" + $props.direction + ($props.lineBold ? "_bold" : "")),
        b: common_vendor.n(index <= $props.current && index !== 0 && !$options.getColor(index, $props.current, true) ? "fui-steps__background" : ""),
        c: index === 0 ? "transparent" : index <= $props.current ? $options.getColor(index, $props.current, true) : $props.nodeColor
      } : {}, {
        d: item[$props.textKey] && !($props.isMark && index == $props.current)
      }, item[$props.textKey] && !($props.isMark && index == $props.current) ? {
        e: common_vendor.t(item[$props.textKey]),
        f: index <= $props.current && !$options.getActiveColor ? 1 : "",
        g: index <= $props.current && !$options.getActiveColor ? 1 : "",
        h: index <= $props.current ? $options.getActiveColor : "#fff",
        i: index <= $props.current ? $options.getActiveColor : $props.nodeColor,
        j: index <= $props.current ? "#fff" : $props.color
      } : {}, {
        k: $props.isMark && index == $props.current
      }, $props.isMark && index == $props.current ? common_vendor.e({
        l: $props.processStatus === "fail"
      }, $props.processStatus === "fail" ? {} : $props.processStatus === "wait" ? {} : {}, {
        m: $props.processStatus === "wait",
        n: !$options.getActiveColor && !$props.processColor ? 1 : "",
        o: $props.processColor || $options.getActiveColor
      }) : {}, {
        p: !item[$props.textKey] && !item[$props.srcKey] && !($props.isMark && index == $props.current)
      }, !item[$props.textKey] && !item[$props.srcKey] && !($props.isMark && index == $props.current) ? {
        q: index <= $props.current && !$options.getActiveColor ? 1 : "",
        r: index <= $props.current ? $options.getActiveColor : $props.nodeColor
      } : {}, {
        s: !item[$props.textKey] && item[$props.srcKey] && !($props.isMark && index == $props.current)
      }, !item[$props.textKey] && item[$props.srcKey] && !($props.isMark && index == $props.current) ? {
        t: index <= $props.current ? item[$props.activeSrcKey] || item[$props.srcKey] : item[$props.srcKey],
        v: $props.radius || 0
      } : {}, {
        w: common_vendor.n(index !== $props.items.length - 1 && !$options.getColor(index, $props.current, true, true) && (index < $props.current || index == $props.current && $props.isWait && $props.direction === "row" && !$props.processColor) ? "fui-steps__background" : ""),
        x: index === $props.items.length - 1 ? "transparent" : index < $props.current || index == $props.current && $props.isWait && $props.direction === "row" ? $options.getColor(index, $props.current, true, true) : $props.nodeColor,
        y: common_vendor.t(item.title || ""),
        z: index < $props.current && !$options.getActiveColor || index === $props.current && !$props.processColor && !$options.getActiveColor ? 1 : "",
        A: index <= $props.current ? $options.getColor(index, $props.current) : $props.color,
        B: common_vendor.t(item[_ctx.title]),
        C: index < $props.current && !$options.getActiveColor || index === $props.current && !$props.processColor && !$options.getActiveColor ? 1 : "",
        D: index <= $props.current ? $options.getColor(index, $props.current) : $props.color,
        E: "d-" + i0,
        F: common_vendor.r("d", {
          item,
          index
        }, i0),
        G: index,
        H: common_vendor.o(($event) => $options.handleClick(index), index)
      });
    }),
    b: $props.direction === "row",
    c: $props.direction != "row" || $props.direction === "row" && !$props.lineThrough ? 1 : "",
    d: common_vendor.n("fui-steps__line-" + $props.direction + ($props.lineBold ? "_bold" : "")),
    e: common_vendor.n($props.direction === "row" ? "fui-steps__flex-row" : "fui-steps__flex-col"),
    f: common_vendor.n($props.direction === "row" ? "" : "fui-steps__node-weex"),
    g: common_vendor.s($options.getStyles),
    h: $props.direction === "row" ? 1 : "",
    i: $props.size + "rpx",
    j: $props.fontWeight,
    k: $props.direction === "row" ? 1 : "",
    l: $props.size + "rpx",
    m: $props.fontWeight,
    n: common_vendor.n($props.direction === "row" ? "fui-steps__content-row" : "fui-steps__content-col"),
    o: common_vendor.n($props.direction === "column" ? "fui-steps__flex-row" : "fui-steps__flex-col"),
    p: common_vendor.n($props.direction === "row" ? "fui-steps__nw-col" : "fui-steps__nw-row"),
    q: $props.direction === "row" ? 1 : "",
    r: $props.padding[0] || 0,
    s: $props.padding[1] || 0,
    t: $props.padding[2] || $props.padding[0] || 0,
    v: $props.padding[3] || $props.padding[1] || 0,
    w: $props.background
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-71949596"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/fui-steps.js.map
