if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue, shared) {
  "use strict";
  const componentSizes = ["", "sm", "lg", "xl"];
  const formComponentSizes = ["", "sm", "lg"];
  const componentShapes = ["", "circle", "round"];
  const componentImgModes = [
    "scaleToFill",
    "aspectFit",
    "aspectFill",
    "widthFix",
    "heightFix",
    "top",
    "bottom",
    "center",
    "left",
    "right",
    "top left",
    "top right",
    "bottom left",
    "bottom right"
  ];
  const componentTypes = [
    "",
    "primary",
    "success",
    "warning",
    "danger",
    "info"
  ];
  const UPDATE_MODEL_EVENT = "update:modelValue";
  const ZIndex = {
    /** navbar */
    navbar: 20090,
    /** tabbar */
    tabbar: 20090,
    /** modal弹框 */
    modal: 20076,
    /** popup 弹出层 */
    popup: 20075,
    /** notify */
    notify: 20074,
    /** 吸顶 */
    sticky: 10030,
    /** 气泡弹框 */
    bubble: 10020,
    /** mask 遮罩 */
    mask: 9999
  };
  const isEmptyVariableInDefault = (variable, defaultValue = void 0) => {
    return variable === void 0 || variable === null ? defaultValue : variable;
  };
  const isEmptyDoubleVariableInDefault = (variable1, variable2, defaultValue = void 0) => {
    return isEmptyVariableInDefault(
      variable1,
      isEmptyVariableInDefault(variable2, defaultValue)
    );
  };
  const withNoopInstall = (component) => {
    component.install = () => {
    };
    return component;
  };
  function fromPairs(pairs) {
    const result = {};
    if (pairs == null) {
      return result;
    }
    for (const pair of pairs) {
      result[pair[0]] = pair[1];
    }
    return result;
  }
  function isObjectLike(value) {
    return value != null && typeof value == "object";
  }
  const objectProto = Object.prototype;
  const objectToString = objectProto.toString;
  const boolTag = "[object Boolean]";
  function isBoolean(value) {
    return value === true || value === false || isObjectLike(value) && objectToString.call(value) == boolTag;
  }
  const numberTag = "[object Number]";
  function isNumber(value) {
    return typeof value == "number" || isObjectLike(value) && objectToString.call(value) == numberTag;
  }
  const symbolProto = Symbol ? Symbol.prototype : void 0;
  symbolProto ? symbolProto.toString : void 0;
  const NAN = 0 / 0;
  const reTrim = /^\s+|\s+$/g;
  const reIsBinary = /^0b[01]+$/i;
  const reIsOctal = /^0o[0-7]+$/i;
  const reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
  function toNumber(value) {
    if (typeof value == "number") {
      return value;
    }
    if (shared.isSymbol(value)) {
      return NAN;
    }
    if (shared.isObject(value)) {
      const other = typeof value.valueOf == "function" ? value.valueOf() : value;
      value = shared.isObject(other) ? `${other}` : other;
    }
    if (typeof value != "string") {
      return value === 0 ? value : +value;
    }
    value = value.replace(reTrim, "");
    const isBinary = reIsBinary.test(value);
    return isBinary || reIsOctal.test(value) ? Number.parseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
  }
  const FUNC_ERROR_TEXT = "Expected a function";
  function debounce(func, wait, options) {
    let lastArgs;
    let lastThis;
    let maxWait;
    let result;
    let timerId;
    let lastCallTime;
    let lastInvokeTime = 0;
    let leading = false;
    let maxing = false;
    let trailing = true;
    if (typeof func != "function") {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    wait = toNumber(wait) || 0;
    if (shared.isObject(options)) {
      leading = !!options.leading;
      maxing = "maxWait" in options;
      maxWait = maxing ? Math.max(toNumber(options.maxWait) || 0, wait) : maxWait;
      trailing = "trailing" in options ? !!options.trailing : trailing;
    }
    function invokeFunc(time) {
      const args = lastArgs, thisArg = lastThis;
      lastArgs = lastThis = void 0;
      lastInvokeTime = time;
      result = func.apply(thisArg, args);
      return result;
    }
    function leadingEdge(time) {
      lastInvokeTime = time;
      timerId = setTimeout(timerExpired, wait);
      return leading ? invokeFunc(time) : result;
    }
    function remainingWait(time) {
      const timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, result2 = wait - timeSinceLastCall;
      return maxing ? Math.max(result2, maxWait - timeSinceLastInvoke) : result2;
    }
    function shouldInvoke(time) {
      const timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
      return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
    }
    function timerExpired() {
      const time = Date.now();
      if (shouldInvoke(time)) {
        return trailingEdge(time);
      }
      timerId = setTimeout(timerExpired, remainingWait(time));
    }
    function trailingEdge(time) {
      timerId = void 0;
      if (trailing && lastArgs) {
        return invokeFunc(time);
      }
      lastArgs = lastThis = void 0;
      return result;
    }
    function cancel() {
      if (timerId !== void 0) {
        clearTimeout(timerId);
      }
      lastInvokeTime = 0;
      lastArgs = lastCallTime = lastThis = timerId = void 0;
    }
    function flush() {
      return timerId === void 0 ? result : trailingEdge(Date.now());
    }
    function debounced() {
      const time = Date.now(), isInvoking = shouldInvoke(time);
      lastArgs = arguments;
      lastThis = this;
      lastCallTime = time;
      if (isInvoking) {
        if (timerId === void 0) {
          return leadingEdge(lastCallTime);
        }
        if (maxing) {
          timerId = setTimeout(timerExpired, wait);
          return invokeFunc(lastCallTime);
        }
      }
      if (timerId === void 0) {
        timerId = setTimeout(timerExpired, wait);
      }
      return result;
    }
    debounced.cancel = cancel;
    debounced.flush = flush;
    return debounced;
  }
  const isEmpty = (val) => !val && val !== 0 || shared.isArray(val) && val.length === 0 || shared.isObject(val) && !Object.keys(val).length;
  const tnPropKey = "__tnPropKey";
  const definePropType = (val) => val;
  const isTnProp = (val) => shared.isObject(val) && !!val[tnPropKey];
  const buildProp = (prop, key) => {
    if (!shared.isObject(prop) || isTnProp(prop))
      return prop;
    const { values, required, default: defaultValue, type, validator } = prop;
    const _validator = values || validator ? (val) => {
      let valid = false;
      let allowedValues = [];
      if (values) {
        allowedValues = Array.from(values);
        if (shared.hasOwn(prop, "default")) {
          allowedValues.push(defaultValue);
        }
        valid || (valid = allowedValues.includes(val));
      }
      if (validator)
        valid || (valid = validator(val));
      if (!valid && allowedValues.length > 0) {
        const allowValuesText = [...new Set(allowedValues)].map((value) => JSON.stringify(value)).join(", ");
        vue.warn(
          `Invalid prop: validation failed${key ? ` for prop "${key}"` : ""}. Expected one of [${allowValuesText}], got value ${JSON.stringify(
            val
          )}.`
        );
      }
      return valid;
    } : void 0;
    const tnProp = {
      type,
      required: !!required,
      validator: _validator,
      [tnPropKey]: true
    };
    if (shared.hasOwn(prop, "default"))
      tnProp.default = defaultValue;
    return tnProp;
  };
  const buildProps = (props) => fromPairs(
    Object.entries(props).map(([key, option]) => [
      key,
      buildProp(option, key)
    ])
  );
  const iconPropType = definePropType([String]);
  const formatDomSizeValue = (value, unit = "rpx", empty = true) => {
    if (!value)
      return empty ? "" : `0${unit}`;
    if (shared.isString(value) && /(^calc)|(%|vw|vh|px|rpx|auto)$/.test(value))
      return value;
    return `${value}${unit}`;
  };
  const generateId = () => Math.floor(Math.random() * 1e4);
  class TuniaoUIError extends Error {
    constructor(message) {
      super(message);
      this.name = "TuniaoUIError";
    }
  }
  function debugWarn(scope, message) {
    {
      const error = shared.isString(scope) ? new TuniaoUIError(`[${scope}] ${message}`) : scope;
      console.warn(error);
    }
  }
  const overlayProps = buildProps({
    /**
     * @description 是否显示遮罩层
     */
    show: {
      type: Boolean,
      default: false
    },
    /**
     * @description 动画时间，单位毫秒
     */
    duration: {
      type: Number,
      default: 300
    },
    /**
     * @description 遮罩层透明度，有效值0-1
     */
    opacity: {
      type: Number,
      default: 0.5
    },
    /**
     * @description zIndex
     */
    zIndex: {
      type: Number,
      default: ZIndex.mask
    }
  });
  const overlayEmits = {
    "update:show": (value) => isBoolean(value),
    click: () => true
  };
  const defaultNamespace = "tn";
  const _bem = (namespace, block, blockSuffix, element, modifier) => {
    let cls = `${namespace}-${block}`;
    if (blockSuffix) {
      cls += `-${blockSuffix}`;
    }
    if (element) {
      cls += `__${element}`;
    }
    if (modifier) {
      cls += `--${modifier}`;
    }
    return cls;
  };
  const namespaceContextKey = Symbol("localContextKey");
  const useGetDerivedNamespace = () => {
    const derivedNamespace = vue.inject(namespaceContextKey, vue.ref(defaultNamespace));
    const namespace = vue.computed(() => {
      return vue.unref(derivedNamespace) || defaultNamespace;
    });
    return namespace;
  };
  const useNamespace = (block) => {
    const namespace = useGetDerivedNamespace();
    const b = (blockSuffix = "") => _bem(namespace.value, block, blockSuffix, "", "");
    const e = (element) => element ? _bem(namespace.value, block, "", element, "") : "";
    const m = (modifier) => modifier ? _bem(namespace.value, block, "", "", modifier) : "";
    const be = (blockSuffix, element) => blockSuffix && element ? _bem(namespace.value, block, blockSuffix, element, "") : "";
    const em = (element, modifier) => element && modifier ? _bem(namespace.value, block, "", element, modifier) : "";
    const bm = (blockSuffix, modifier) => blockSuffix && modifier ? _bem(namespace.value, block, blockSuffix, "", modifier) : "";
    const bem = (blockSuffix, element, modifier) => blockSuffix && element && modifier ? _bem(namespace.value, block, blockSuffix, element, modifier) : "";
    const is = (name, ...args) => {
      const state = args.length >= 1 ? args[0] : true;
      return name && state ? `is-${name}` : "";
    };
    const cssVar = (object) => {
      const styles = {};
      for (const key in object) {
        if (object[key]) {
          styles[`--${namespace.value}-${key}`] = object[key];
        }
      }
      return styles;
    };
    const cssVarBlock = (object) => {
      const styles = {};
      for (const key in object) {
        if (object[key]) {
          styles[`--${namespace.value}-${block}-${key}`] = object[key];
        }
      }
      return styles;
    };
    const cssVarName = (name) => `--${namespace.value}-${name}`;
    const cssVarBlockName = (name) => `--${namespace.value}-${block}-${name}`;
    return {
      namespace,
      b,
      e,
      m,
      be,
      em,
      bm,
      bem,
      is,
      // css
      cssVar,
      cssVarName,
      cssVarBlock,
      cssVarBlockName
    };
  };
  const useComponentColor = (prop, type = "") => {
    const classColor = vue.ref("");
    const styleColor = vue.ref("");
    const innerColorReg = /^(tn-|gradient)/;
    const styleColorReg = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8}|[A-Fa-f0-9]{3})$|^rgb\(\d{1,3}(,\s?\d{1,3}){2}\)$|^rgba\(\d{1,3}(,\s?\d{1,3}){2},\s?0?\.?\d{1,}\)|transparent/i;
    const handleColorValue = (value) => {
      classColor.value = "";
      styleColor.value = "";
      if (value === void 0)
        return;
      if (innerColorReg.test(value)) {
        if (type === "bg" && /.*gradient.*/.test(value)) {
          const gradientValue = value.split("__")[1];
          classColor.value = `tn-gradient-bg__${gradientValue}`;
          return;
        }
        classColor.value = `${value}_${type}`;
      }
      if (styleColorReg.test(value)) {
        styleColor.value = value;
      }
    };
    handleColorValue(prop.value);
    vue.watch(
      () => prop.value,
      (val) => {
        handleColorValue(val);
      }
    );
    const updateColor = (value) => {
      handleColorValue(value);
    };
    return [classColor, styleColor, updateColor];
  };
  const useComponentSize = (size) => {
    const sizeType = vue.computed(() => {
      if (!size)
        return "none";
      return componentSizes.includes(size) ? "inner" : "custom";
    });
    return {
      sizeType
    };
  };
  const useSelectorQuery = (instance) => {
    let query = null;
    if (!instance) {
      instance = vue.getCurrentInstance();
    }
    if (!instance) {
      debugWarn("useSelectorQuery", "useSelectorQuery必须在setup函数中使用");
    }
    query = uni.createSelectorQuery().in(instance);
    const getSelectorNodeInfo = (selector) => {
      return new Promise((resolve, reject) => {
        if (query) {
          query.select(selector).boundingClientRect((res) => {
            const selectRes = res;
            if (selectRes) {
              resolve(selectRes);
            } else {
              reject(new Error(`未找到对应节点: ${selector}`));
            }
          }).exec();
        } else {
          reject(new Error("未找到对应的SelectorQuery实例"));
        }
      });
    };
    const getSelectorNodeInfos = (selector) => {
      return new Promise((resolve, reject) => {
        if (query) {
          query.selectAll(selector).boundingClientRect((res) => {
            const selectRes = res;
            if (selectRes && selectRes.length > 0) {
              resolve(selectRes);
            } else {
              reject(new Error(`未找到对应节点: ${selector}`));
            }
          }).exec();
        } else {
          reject(new Error("未找到对应的SelectorQuery实例"));
        }
      });
    };
    return {
      query,
      getSelectorNodeInfo,
      getSelectorNodeInfos
    };
  };
  vue.ref(0);
  const useOverlay = (props, emits) => {
    const ns = useNamespace("overlay");
    const overlayClass = vue.computed(() => {
      const cls = [ns.b()];
      if (props.show)
        cls.push(ns.m("show"));
      return cls.join(" ");
    });
    const overlayStyle = vue.computed(() => {
      const style = {};
      style.transitionDuration = `${isEmptyVariableInDefault(
        props.duration,
        300
      )}ms`;
      style.backgroundColor = `rgba(0, 0, 0, ${isEmptyVariableInDefault(
        props.opacity,
        0.5
      )})`;
      if (props.zIndex)
        style.zIndex = props.zIndex;
      return style;
    });
    const overlayClick = () => {
      emits("update:show", false);
      emits("click");
    };
    return {
      ns,
      overlayClass,
      overlayStyle,
      overlayClick
    };
  };
  const _sfc_main$e = /* @__PURE__ */ vue.defineComponent({
    __name: "overlay",
    props: overlayProps,
    emits: overlayEmits,
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emits = __emit;
      const { overlayClass, overlayStyle, overlayClick } = useOverlay(props, emits);
      const __returned__ = { props, emits, overlayClass, overlayStyle, overlayClick };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass([$setup.overlayClass]),
        style: vue.normalizeStyle($setup.overlayStyle),
        onClick: _cache[0] || (_cache[0] = vue.withModifiers((...args) => $setup.overlayClick && $setup.overlayClick(...args), ["stop"])),
        onTouchmove: vue.withModifiers(() => {
        }, ["stop", "prevent"])
      },
      [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ],
      38
      /* CLASS, STYLE, NEED_HYDRATION */
    );
  }
  const TnOverlay = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$d], ["__scopeId", "data-v-f8dbb66a"], ["__file", "/Users/zhizhi/node_modules/@tuniao/tnui-vue3-uniapp/components/overlay/src/overlay.vue"]]);
  const useComponentBoolean = buildProp({
    type: [Boolean, void 0],
    default: void 0
  });
  const useComponentSizeProp = buildProp({
    type: String,
    values: componentSizes,
    required: false
  });
  buildProp({
    type: String,
    values: formComponentSizes,
    required: false
  });
  const useComponentCustomStyleProp = buildProp({
    type: Object,
    default: () => ({})
  });
  const useComponentIndexProp = buildProp({
    type: definePropType([String, Number]),
    default: () => generateId()
  });
  const useComponentSafeAreaInsetBottomProp = buildProp({
    type: Boolean,
    default: true
  });
  const iconProps = buildProps({
    /**
     * @description 图标名称，支持图鸟内置图标和图片地址(只支持绝对路径)
     */
    name: {
      type: iconPropType,
      required: true
    },
    /**
     * @description 图标颜色类型
     */
    type: {
      type: String,
      values: componentTypes,
      default: ""
    },
    /**
     * @description 图标颜色, 以tn开头则使用图鸟内置的颜色
     */
    color: String,
    /**
     * @description 图标大小
     */
    size: {
      type: [String, Number]
    },
    /**
     * @description 图标加粗
     */
    bold: Boolean,
    /**
     * @description 图标是否为透明
     */
    transparent: Boolean,
    /**
     * @description 透明图标背景
     */
    transparentBg: String,
    /**
     * @description 图片模式，当name为图片地址时生效
     */
    imgMode: {
      type: String,
      values: componentImgModes,
      default: "aspectFill"
    },
    /**
     * @description 垂直方向上的偏移量
     */
    offsetTop: {
      type: [String, Number]
    },
    /**
     * @description 自定义样式
     */
    customStyle: useComponentCustomStyleProp,
    /**
     * @description 自定义类
     */
    customClass: String
  });
  const iconEmits = {
    /**
     * @description 点击图标时触发
     */
    click: () => true
  };
  const useIcon = (props) => {
    const ns = useNamespace("icon");
    const [colorClass, colorStyle] = useComponentColor(
      vue.toRef(props, "color"),
      "text"
    );
    const [transparentBgClass] = useComponentColor(
      vue.toRef(props, "transparentBg"),
      "bg"
    );
    const { sizeType } = useComponentSize(props.size);
    const isImg = vue.computed(
      () => !!(props == null ? void 0 : props.name) && props.name.includes("/")
    );
    const iconClass = vue.computed(() => {
      const cls = [];
      cls.push(ns.b());
      if (isImg.value) {
        cls.push(ns.m("image"));
      } else {
        if (props.type)
          cls.push(`tn-type-${props.type}_text`);
        if (props.transparent) {
          cls.push("tn-text-transparent", transparentBgClass.value);
        } else {
          if (colorClass.value)
            cls.push(colorClass.value);
        }
        if (props.bold)
          cls.push("tn-text-bold");
      }
      if (sizeType.value === "inner")
        cls.push(ns.m(props.size));
      if (props.customClass)
        cls.push(props.customClass);
      return cls.join(" ");
    });
    const iconStyle = vue.computed(() => {
      const style = {};
      if (isImg.value) {
        if (sizeType.value === "custom" && props.size) {
          style.width = style.height = formatDomSizeValue(props.size);
        }
      } else {
        if (colorStyle.value)
          style.color = colorStyle.value;
        if (sizeType.value === "custom" && props.size)
          style.fontSize = formatDomSizeValue(props.size);
      }
      if (props.offsetTop)
        style.transform = `translateY(${formatDomSizeValue(props.offsetTop)})`;
      if (!isEmpty(props.customStyle))
        Object.assign(style, props.customStyle);
      return style;
    });
    return {
      isImg,
      iconClass,
      iconStyle
    };
  };
  const _sfc_main$d = /* @__PURE__ */ vue.defineComponent({
    __name: "icon",
    props: iconProps,
    emits: iconEmits,
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emits = __emit;
      const { isImg, iconClass, iconStyle } = useIcon(props);
      const handleClick = () => {
        emits("click");
      };
      const __returned__ = { props, emits, isImg, iconClass, iconStyle, handleClick };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass([$setup.iconClass]),
        style: vue.normalizeStyle($setup.iconStyle),
        onClick: $setup.handleClick
      },
      [
        vue.createCommentVNode(" 图片图标 "),
        $setup.isImg ? (vue.openBlock(), vue.createElementBlock("image", {
          key: 0,
          class: "image",
          src: _ctx.name,
          mode: _ctx.imgMode
        }, null, 8, ["src", "mode"])) : (vue.openBlock(), vue.createElementBlock(
          vue.Fragment,
          { key: 1 },
          [
            vue.createCommentVNode(" 正常图标 "),
            vue.createElementVNode(
              "text",
              {
                class: vue.normalizeClass(["icon", `tn-icon-${_ctx.name}`])
              },
              null,
              2
              /* CLASS */
            )
          ],
          2112
          /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
        ))
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const TnIcon = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$c], ["__scopeId", "data-v-3324013e"], ["__file", "/Users/zhizhi/node_modules/@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue"]]);
  withNoopInstall(TnOverlay);
  const popupOpenDirection = [
    "top",
    "bottom",
    "left",
    "right",
    "center"
  ];
  const popupCloseBtnPosition = [
    "left-top",
    "right-top",
    "left-bottom",
    "right-bottom"
  ];
  const popupProps = buildProps({
    /**
     * @description 控制弹框是否显示
     */
    modelValue: Boolean,
    /**
     * @description 弹框打开的方向
     */
    openDirection: {
      type: String,
      values: popupOpenDirection,
      default: "center"
    },
    /**
     * @description 弹窗的宽度，在 openDirection 为 left 或 right 或 center 时生效
     */
    width: {
      type: [String, Number]
    },
    /**
     * @description 弹窗的高度，在 openDirection 为 top 或 bottom 或 center 时生效
     */
    height: {
      type: [String, Number]
    },
    /**
     * @description 弹框的内容的背景颜色
     */
    bgColor: {
      type: String,
      default: "#fff"
    },
    /**
     * @description 弹框的内容的圆角
     */
    radius: {
      type: [String, Number],
      default: 15
    },
    /**
     * @description 是否显示overlay遮罩层
     */
    overlay: {
      type: Boolean,
      default: true
    },
    /**
     * @description overlay遮罩层的透明度
     */
    overlayOpacity: overlayProps["opacity"],
    /**
     * @description 点击overlay关闭弹框
     */
    overlayCloseable: {
      type: Boolean,
      default: true
    },
    /**
     * @description 是否显示关闭按钮
     */
    closeBtn: Boolean,
    /**
     * @description 关闭按钮的位置
     */
    closeBtnPosition: {
      type: String,
      values: popupCloseBtnPosition,
      default: "right-top"
    },
    /**
     * @description 底部是否开启安全区域
     */
    safeAreaInsetBottom: useComponentSafeAreaInsetBottomProp,
    /**
     * @description zIndex
     */
    zIndex: {
      type: Number,
      default: ZIndex.popup
    },
    /**
     * @description 距离顶部的距离，在 openDirection 为 top 或 left 或 right 时生效，默认单位为`px`
     */
    top: {
      type: [String, Number]
    }
  });
  const popupEmits = {
    [UPDATE_MODEL_EVENT]: (value) => isBoolean(value),
    open: () => true,
    close: () => true,
    ["overlay-click"]: () => true
  };
  const usePopupCustomStyle = (props) => {
    const ns = useNamespace("popup");
    const zIndex = vue.computed(() => Number(props.zIndex));
    const overlayZIndex = vue.computed(() => zIndex.value - 1);
    const [contentBgColorClass, contentBgColorStyle] = useComponentColor(
      vue.toRef(props, "bgColor"),
      "bg"
    );
    const popupContentClass = vue.computed(() => {
      const cls = [ns.e("content")];
      if (props.openDirection)
        cls.push(ns.em("content", props.openDirection));
      if (props.openDirection === "bottom" && props.safeAreaInsetBottom) {
        cls.push("tn-u-safe-area");
      }
      if (contentBgColorClass.value)
        cls.push(contentBgColorClass.value);
      return cls.join(" ");
    });
    const popupContentStyle = vue.computed(() => {
      const style = {};
      if (contentBgColorStyle.value)
        style.backgroundColor = contentBgColorStyle.value;
      if (props.radius) {
        style.overflow = "hidden";
        if (props.openDirection === "center") {
          style.borderRadius = formatDomSizeValue(props.radius);
        }
        if (props.openDirection === "top") {
          style.borderBottomLeftRadius = formatDomSizeValue(props.radius);
          style.borderBottomRightRadius = formatDomSizeValue(props.radius);
        }
        if (props.openDirection === "left") {
          style.borderTopRightRadius = formatDomSizeValue(props.radius);
          style.borderBottomRightRadius = formatDomSizeValue(props.radius);
        }
        if (props.openDirection === "right") {
          style.borderTopLeftRadius = formatDomSizeValue(props.radius);
          style.borderBottomLeftRadius = formatDomSizeValue(props.radius);
        }
        if (props.openDirection === "bottom") {
          style.borderTopLeftRadius = formatDomSizeValue(props.radius);
          style.borderTopRightRadius = formatDomSizeValue(props.radius);
        }
      }
      if (props.top && (props.openDirection === "top" || props.openDirection === "left" || props.openDirection === "right")) {
        style.top = formatDomSizeValue(props.top, "px");
      }
      if (props.width && (props.openDirection === "left" || props.openDirection === "right" || props.openDirection === "center")) {
        style.width = formatDomSizeValue(props.width);
      }
      if (props.height && (props.openDirection === "top" || props.openDirection === "bottom" || props.openDirection === "center")) {
        style.height = formatDomSizeValue(props.height);
      }
      if (props.openDirection === "left" || props.openDirection === "right") {
        if (props.top)
          style.height = `calc(100% - ${formatDomSizeValue(props.top, "px")})`;
      }
      style.zIndex = zIndex.value;
      return style;
    });
    return {
      ns,
      zIndex,
      overlayZIndex,
      popupContentClass,
      popupContentStyle
    };
  };
  const usePopup = (props) => {
    const { emit } = vue.getCurrentInstance();
    const iosDevice = vue.computed(() => {
      const systemInfo = uni.getSystemInfoSync();
      return systemInfo.osName === "ios" || systemInfo.osName === "macos";
    });
    const showOverlay = vue.ref(false);
    const showPopup = vue.ref(false);
    const visiblePopup = vue.ref(false);
    let initPopupModelValue = false;
    vue.watch(
      () => props.modelValue,
      (value) => {
        if (value) {
          visiblePopup.value = true;
          if (iosDevice.value) {
            setTimeout(() => {
              showPopup.value = true;
              if (props.overlay)
                showOverlay.value = true;
              initPopupModelValue && emit("open");
            }, 0);
          } else {
            showPopup.value = true;
            if (props.overlay)
              showOverlay.value = true;
            initPopupModelValue && emit("open");
          }
        } else {
          showPopup.value = false;
          showOverlay.value = false;
          setTimeout(() => {
            visiblePopup.value = false;
          }, 250);
          initPopupModelValue && emit("close");
        }
        initPopupModelValue = true;
      },
      {
        immediate: true
      }
    );
    const updateModelValue = (value) => {
      emit(UPDATE_MODEL_EVENT, value);
    };
    const onClickCloseBtn = () => {
      updateModelValue(false);
      emit("close");
    };
    const onClickOverlay = () => {
      if (props.overlayCloseable) {
        updateModelValue(false);
        emit("close");
        emit("overlay-click");
      }
    };
    return {
      iosDevice,
      showOverlay,
      showPopup,
      visiblePopup,
      updateModelValue,
      onClickCloseBtn,
      onClickOverlay
    };
  };
  const _sfc_main$c = /* @__PURE__ */ vue.defineComponent({
    __name: "popup",
    props: popupProps,
    emits: popupEmits,
    setup(__props, { expose: __expose }) {
      __expose();
      const props = __props;
      const {
        iosDevice,
        showOverlay,
        showPopup,
        visiblePopup,
        onClickCloseBtn,
        onClickOverlay
      } = usePopup(props);
      const { ns, overlayZIndex, zIndex, popupContentClass, popupContentStyle } = usePopupCustomStyle(props);
      const __returned__ = { props, iosDevice, showOverlay, showPopup, visiblePopup, onClickCloseBtn, onClickOverlay, ns, overlayZIndex, zIndex, popupContentClass, popupContentStyle, TnOverlay, TnIcon };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    return !$setup.iosDevice || $setup.iosDevice && $setup.visiblePopup ? (vue.openBlock(), vue.createElementBlock(
      "view",
      {
        key: 0,
        class: vue.normalizeClass([$setup.ns.b(), $setup.ns.is("show", $setup.showPopup), $setup.ns.is("visible", $setup.visiblePopup)]),
        style: vue.normalizeStyle({
          zIndex: $setup.zIndex
        })
      },
      [
        vue.createCommentVNode(" 遮罩层 "),
        vue.createVNode($setup["TnOverlay"], {
          show: $setup.showOverlay,
          "z-index": $setup.overlayZIndex,
          opacity: _ctx.overlayOpacity,
          onClick: $setup.onClickOverlay
        }, null, 8, ["show", "z-index", "opacity", "onClick"]),
        vue.createCommentVNode(" 弹框内容 "),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass([$setup.popupContentClass]),
            style: vue.normalizeStyle($setup.popupContentStyle)
          },
          [
            vue.renderSlot(_ctx.$slots, "default", {}, void 0, true),
            vue.createCommentVNode(" 关闭按钮 "),
            _ctx.closeBtn ? (vue.openBlock(), vue.createElementBlock(
              "view",
              {
                key: 0,
                class: vue.normalizeClass([$setup.ns.e("close-btn"), $setup.ns.em("close-btn", _ctx.closeBtnPosition)]),
                onClick: _cache[0] || (_cache[0] = vue.withModifiers((...args) => $setup.onClickCloseBtn && $setup.onClickCloseBtn(...args), ["stop"]))
              },
              [
                vue.renderSlot(_ctx.$slots, "closeBtn", {}, () => [
                  vue.createVNode($setup["TnIcon"], { name: "close" })
                ], true)
              ],
              2
              /* CLASS */
            )) : vue.createCommentVNode("v-if", true)
          ],
          6
          /* CLASS, STYLE */
        )
      ],
      6
      /* CLASS, STYLE */
    )) : vue.createCommentVNode("v-if", true);
  }
  const TnPopup = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$b], ["__scopeId", "data-v-6e3295b0"], ["__file", "/Users/zhizhi/node_modules/@tuniao/tnui-vue3-uniapp/components/popup/src/popup.vue"]]);
  const _sfc_main$b = {
    name: "fui-bottom-popup",
    emits: ["close"],
    props: {
      show: {
        type: Boolean,
        default: false
      },
      //背景颜色
      background: {
        type: String,
        default: "#fff"
      },
      //圆角
      radius: {
        type: [Number, String],
        default: 24
      },
      zIndex: {
        type: [Number, String],
        default: 996
      },
      //点击遮罩 是否可关闭
      maskClosable: {
        type: Boolean,
        default: true
      },
      maskBackground: {
        type: String,
        default: "rgba(0,0,0,.6)"
      },
      //是否适配底部安全区
      safeArea: {
        type: Boolean,
        default: true
      }
    },
    data() {
      let isAndroid = false;
      let isNvue = false;
      return {
        iphoneX: false,
        isNvue,
        isShow: false,
        isAndroid
      };
    },
    created() {
    },
    methods: {
      handleClose(e) {
        if (!this.maskClosable)
          return;
        this.$emit("close", {});
      },
      stop(e, tap) {
      }
    }
  };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    return $data.isShow || !$data.isNvue ? (vue.openBlock(), vue.createElementBlock(
      "view",
      {
        key: 0,
        class: vue.normalizeClass(["fui-bottom__popup-wrap", { "fui-bottom__popwrap-show": $props.show }]),
        style: vue.normalizeStyle({ zIndex: $props.zIndex, background: $props.maskBackground }),
        onClick: _cache[1] || (_cache[1] = vue.withModifiers((...args) => $options.handleClose && $options.handleClose(...args), ["stop"])),
        ref: "fui_bp_mk_ani"
      },
      [
        vue.createCommentVNode(' @touchmove.stop.prevent="stop" '),
        vue.createElementVNode(
          "view",
          {
            ref: "fui_bp_ani",
            class: vue.normalizeClass(["fui-bottom__popup", { "fui-bottom__popup-show": $props.show, "fui-bp__safe-weex": $data.iphoneX && $props.safeArea }]),
            style: vue.normalizeStyle({ borderTopLeftRadius: $props.radius + "rpx", borderTopRightRadius: $props.radius + "rpx", background: $props.background }),
            onClick: _cache[0] || (_cache[0] = vue.withModifiers(($event) => $options.stop($event, true), ["stop"]))
          },
          [
            vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
          ],
          6
          /* CLASS, STYLE */
        )
      ],
      6
      /* CLASS, STYLE */
    )) : vue.createCommentVNode("v-if", true);
  }
  const fuiBottomPopup = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$a], ["__scopeId", "data-v-cdd27092"], ["__file", "/Users/zhizhi/Documents/HBuilderProjects/dnf/components/fui-bottom-popup.vue"]]);
  const loadingModes = ["semicircle", "circle", "flower"];
  const loadingProps = buildProps({
    /**
     * @description 显示加载状态
     */
    show: Boolean,
    /**
     * @description 加载动画
     */
    animation: Boolean,
    /**
     * @description 加载模式
     */
    mode: {
      type: String,
      values: loadingModes,
      default: "circle"
    },
    /**
     * @description 加载颜色类型
     */
    type: {
      type: String,
      values: componentTypes,
      default: "primary"
    },
    /**
     * @description 颜色，以tn开头则使用图鸟内置的颜色
     */
    color: String,
    /**
     * @description 加载动画大小
     */
    size: {
      type: [String, Number]
    },
    /**
     * @description 加载动画执行时间，单位s
     */
    duration: {
      type: [String, Number]
    },
    /**
     * @description 加载动画执行时间函数，仅mode为circle和semicircle时有效
     */
    timeFunction: String
  });
  const useLoadingCustomStyle = (props) => {
    const ns = useNamespace("loading");
    const [colorClass, colorStyle, updateColor] = useComponentColor(
      vue.toRef(props, "color"),
      "bg"
    );
    const { sizeType } = useComponentSize(props.size);
    const loadingClass = vue.computed(() => {
      const cls = [];
      cls.push(ns.b());
      if (props.size && sizeType.value === "inner")
        cls.push(ns.m(props.size));
      return cls.join(" ");
    });
    const loadingStyle = vue.computed(() => {
      const style = {};
      if (props.size && sizeType.value === "custom")
        style.width = style.height = formatDomSizeValue(props.size);
      return style;
    });
    const loadingContentClass = vue.computed(() => {
      const cls = [];
      cls.push(ns.b());
      if (props.animation)
        cls.push(ns.m("animation"));
      return cls.join(" ");
    });
    const loadingContentStyle = vue.computed(() => {
      const style = {};
      if (props.type)
        style["--loading-color"] = `var(--tn-color-${props.type})`;
      if (props.color && colorClass.value) {
        const color = props.color.replace("tn-", "");
        style["--loading-color"] = `var(--tn-color-${color})`;
      }
      if (colorStyle.value)
        style["--loading-color"] = colorStyle.value;
      if (props.duration)
        style.animationDuration = `${props.duration}s`;
      if (props.mode === "circle" || props.mode === "semicircle") {
        if (props.timeFunction)
          style.animationTimingFunction = props.timeFunction;
      }
      return style;
    });
    return {
      ns,
      loadingClass,
      loadingStyle,
      loadingContentClass,
      loadingContentStyle,
      updateColor
    };
  };
  const _sfc_main$a = /* @__PURE__ */ vue.defineComponent({
    __name: "loading",
    props: loadingProps,
    setup(__props, { expose: __expose }) {
      __expose();
      const props = __props;
      const {
        ns,
        loadingClass,
        loadingStyle,
        loadingContentClass,
        loadingContentStyle
      } = useLoadingCustomStyle(props);
      const __returned__ = { props, ns, loadingClass, loadingStyle, loadingContentClass, loadingContentStyle };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    return _ctx.show ? (vue.openBlock(), vue.createElementBlock(
      "view",
      {
        key: 0,
        class: vue.normalizeClass([$setup.loadingClass]),
        style: vue.normalizeStyle($setup.loadingStyle)
      },
      [
        _ctx.mode === "semicircle" ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 0,
            class: vue.normalizeClass([$setup.ns.e("semicircle")])
          },
          null,
          2
          /* CLASS */
        )) : vue.createCommentVNode("v-if", true),
        _ctx.mode === "circle" || _ctx.mode === "semicircle" ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 1,
            class: vue.normalizeClass([$setup.ns.e("circle"), $setup.loadingContentClass]),
            style: vue.normalizeStyle($setup.loadingContentStyle)
          },
          null,
          6
          /* CLASS, STYLE */
        )) : vue.createCommentVNode("v-if", true),
        _ctx.mode === "flower" ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 2,
            class: vue.normalizeClass([$setup.ns.e("flower"), $setup.loadingContentClass]),
            style: vue.normalizeStyle($setup.loadingContentStyle)
          },
          [
            (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList(12, (i) => {
                return vue.createElementVNode(
                  "view",
                  {
                    key: i,
                    class: vue.normalizeClass([$setup.ns.em("flower", "item")])
                  },
                  null,
                  2
                  /* CLASS */
                );
              }),
              64
              /* STABLE_FRAGMENT */
            ))
          ],
          6
          /* CLASS, STYLE */
        )) : vue.createCommentVNode("v-if", true)
      ],
      6
      /* CLASS, STYLE */
    )) : vue.createCommentVNode("v-if", true);
  }
  const TnLoading = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$9], ["__scopeId", "data-v-40e3c465"], ["__file", "/Users/zhizhi/node_modules/@tuniao/tnui-vue3-uniapp/components/loading/src/loading.vue"]]);
  const buttonFormTypes = ["submit", "reset"];
  const buttonOpenTypes = [
    "feedback",
    "share",
    "contact",
    "getPhoneNumber",
    "getRealtimePhoneNumber",
    "launchApp",
    "openSetting",
    "getUserInfo",
    "chooseAvatar",
    "agreePrivacyAuthorization"
  ];
  const buttonProps = buildProps({
    /**
     * @description 按钮宽度
     */
    width: {
      type: [String, Number]
    },
    /**
     * @description 按钮高度
     */
    height: {
      type: [String, Number]
    },
    /**
     * @description 按钮尺寸
     */
    size: useComponentSizeProp,
    /**
     * @description 按钮形状
     */
    shape: {
      type: String,
      values: componentShapes,
      default: ""
    },
    /**
     * @description 按钮颜色类型
     */
    type: {
      type: String,
      values: componentTypes,
      default: "primary"
    },
    /**
     * @description 按钮图标
     */
    icon: {
      type: iconPropType
    },
    /**
     * @description 是否加粗字体
     */
    bold: Boolean,
    /**
     * @description 字体大小
     */
    fontSize: {
      type: [String, Number]
    },
    /**
     * @description 背景颜色，以tn开头则使用图鸟内置的颜色
     */
    bgColor: String,
    /**
     * @description 文字颜色，以tn开头则使用图鸟内置的颜色
     */
    textColor: String,
    /**
     * @description 是否显示为文本按钮
     */
    text: Boolean,
    /**
     * @description 是否为朴素按钮
     */
    plain: Boolean,
    /**
     * @description 边框颜色，以tn开头则使用图鸟内置的颜色
     */
    borderColor: String,
    /**
     * @description 是否加粗边框
     */
    borderBold: Boolean,
    /**
     * @description 是否显示阴影
     */
    shadow: Boolean,
    /**
     * @description 阴影颜色，以tn开头则使用图鸟内置的颜色
     */
    shadowColor: String,
    /**
     * @description 点击时触发的类
     */
    hoverClass: {
      type: String,
      default: "tn-u-btn-hover"
    },
    /**
     * @description 自定义样式
     */
    customStyle: useComponentCustomStyleProp,
    /**
     * @description 自定义类
     */
    customClass: String,
    /**
     * @description 是否禁用按钮
     */
    disabled: Boolean,
    /**
     * @description 是否只为一个按钮，不作用任何样式
     */
    onlyButton: Boolean,
    /**
     * @description 是否显示加载中
     */
    loading: Boolean,
    /**
     * @description 是否防抖
     */
    debounce: {
      type: Boolean,
      default: false
    },
    /**
     * @description 触发form表单的事件类型
     */
    formType: {
      type: String,
      values: buttonFormTypes
    },
    /**
     * @description 按钮开放能力，具体能力参考官网https://uniapp.dcloud.io/component/button.html
     */
    openType: {
      type: String,
      values: buttonOpenTypes
    },
    /**
     * @description 打开app时向app传递的参数, 在微信、QQ小程序和openType为launchApp时生效
     */
    appParameter: {
      type: String,
      default: ""
    },
    /**
     * @description 会话来源, 在微信小程序和openType为contact时生效
     */
    sessionFrom: {
      type: String,
      default: ""
    },
    /**
     * @description 会话内消息卡片标题, 默认为当前标题, 在微信小程序和openType为contact时生效
     */
    sendMessageTitle: {
      type: String,
      default: ""
    },
    /**
     * @description 会话内消息卡片点击跳转小程序路径, 默认为当前路径, 在微信小程序和openType为contact时生效
     */
    sendMessagePath: {
      type: String,
      default: ""
    },
    /**
     * @description 会话内消息卡片图片, 默认为截图, 在微信小程序和openType为contact时生效
     */
    sendMessageImg: {
      type: String,
      default: ""
    },
    /**
     * @description 是否显示会话内消息卡片, 设置此参数为true, 用户进入客服会话会在右下角显示"可能要发送的小程序"提示, 用户点击后可以快速发送小程序消息, 在微信小程序和openType为contact时生效
     */
    showMessageCard: {
      type: Boolean,
      default: false
    },
    /**
     * @description 当手机号快速验证或手机号实时验证额度用尽时，是否对用户展示“申请获取你的手机号，但该功能使用次数已达当前小程序上限，暂时无法使用”的提示
     */
    phoneNumberNoQuotaToast: {
      type: Boolean,
      default: true
    },
    clickModifiers: {
      type: String
    }
  });
  const buttonEmits = {
    /**
     * @description 按钮点击事件
     */
    click: () => true,
    /**
     * @description 获取用户手机号码回调
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getphonenumber: (e) => true,
    /**
     * @description 获取用户手机号实时验证回调
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getrealtimephonenumber: (e) => true,
    /**
     * @description 打开权限设置面板并关闭时回调
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    opensetting: (e) => true,
    /**
     * @description 打开APP成功时回调
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    launchapp: (e) => true,
    /**
     * @description 获取用户信息回调
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getuserinfo: (e) => true,
    /**
     * @description 获取用户头像回调
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    chooseavatar: (e) => true,
    /**
     * @description 同意隐私授权回调
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    agreeprivacyauthorization: (e) => true,
    /**
     * @description 客服消息回调
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    contact: (e) => true,
    /**
     * @description 开放能力调用发生错误时回调
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error: (e) => true
  };
  const useButtonCustomStyle = (props) => {
    const ns = useNamespace("button");
    const [bgColorClass, bgColorStyle] = useComponentColor(
      vue.toRef(props, "bgColor"),
      "bg"
    );
    const [textColorClass, textColorStyle] = useComponentColor(
      vue.toRef(props, "textColor"),
      "text"
    );
    const [borderColorClass, borderColorStyle] = useComponentColor(
      vue.toRef(props, "borderColor"),
      "border"
    );
    const [shadowColorClass, shadowColorStyle] = useComponentColor(
      vue.toRef(props, "shadowColor"),
      "shadow"
    );
    const buttonClass = vue.computed(() => {
      const cls = [ns.b()];
      if (props.onlyButton) {
        cls.push(ns.m("only-button"));
        return cls.join(" ");
      }
      if (props.text)
        cls.push(ns.m("text"));
      if (props.plain) {
        cls.push(ns.m("plain"));
        if (props.borderBold)
          cls.push(ns.m("plain-bold"));
      }
      if (props.type) {
        if (props.text) {
          if (!props.textColor)
            cls.push(`tn-type-${props.type}_text`);
        } else if (props.plain) {
          if (!props.borderColor)
            cls.push(`tn-type-${props.type}_border`);
        } else {
          if (!props.bgColor)
            cls.push(`tn-type-${props.type}_bg`);
        }
      }
      if (props.size)
        cls.push(ns.m(props.size));
      if (!props.text && props.shape)
        cls.push(ns.m(props.shape));
      if (props.bold)
        cls.push("tn-text-bold");
      if (!props.text && !props.plain) {
        if (bgColorClass.value)
          cls.push(bgColorClass.value);
      }
      if (textColorClass.value)
        cls.push(textColorClass.value);
      if (props.plain) {
        if (borderColorClass.value)
          cls.push(borderColorClass.value);
      }
      if (props.shadow) {
        cls.push("tn-shadow");
        if (shadowColorClass.value)
          cls.push(shadowColorClass.value);
      }
      if (props.customClass)
        cls.push(props.customClass);
      return cls.join(" ");
    });
    const buttonStyle = vue.computed(() => {
      const style = {};
      if (props.onlyButton)
        return style;
      if (props.width) {
        style.width = formatDomSizeValue(props.width);
        if (props.shape === "circle")
          style.height = style.width;
      }
      if (props.height && props.shape !== "circle")
        style.height = formatDomSizeValue(props.height);
      if (props.fontSize)
        style.fontSize = formatDomSizeValue(props.fontSize);
      if (!props.text && !props.plain) {
        if (bgColorStyle.value)
          style.backgroundColor = bgColorStyle.value;
      }
      if (textColorStyle.value) {
        style.color = textColorStyle.value;
      }
      if (props.plain && borderColorStyle.value) {
        style.borderColor = borderColorStyle.value;
      }
      if (props.shadow && shadowColorStyle.value)
        style.boxShadow = shadowColorStyle.value;
      if (!isEmpty(props.customStyle)) {
        Object.assign(style, props.customStyle);
      }
      return style;
    });
    return {
      ns,
      buttonClass,
      buttonStyle
    };
  };
  const useButton = (props, emits) => {
    const buttonClickHandle = () => {
      if (props.disabled || props.loading)
        return;
      emits("click");
    };
    const buttonClick = props.debounce ? debounce(buttonClickHandle, 250) : buttonClickHandle;
    const getPhoneNumber = (e) => {
      emits("getphonenumber", e);
    };
    const getRealTimePhoneNumber = (e) => {
      emits("getrealtimephonenumber", e);
    };
    const openSetting = (e) => {
      emits("opensetting", e);
    };
    const launchApp = (e) => {
      emits("launchapp", e);
    };
    const getUserInfo = (e) => {
      emits("getuserinfo", e);
    };
    const chooseAvatar = (e) => {
      emits("chooseavatar", e);
    };
    const agreePrivacyAuthorization = (e) => {
      emits("agreeprivacyauthorization", e);
    };
    const contact = (e) => {
      emits("contact", e);
    };
    const openTypeError = (e) => {
      emits("error", e);
    };
    return {
      buttonClick,
      getPhoneNumber,
      getRealTimePhoneNumber,
      openSetting,
      launchApp,
      getUserInfo,
      chooseAvatar,
      agreePrivacyAuthorization,
      contact,
      openTypeError
    };
  };
  const _sfc_main$9 = /* @__PURE__ */ vue.defineComponent({
    __name: "button",
    props: buttonProps,
    emits: buttonEmits,
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emits = __emit;
      const {
        buttonClick,
        getPhoneNumber,
        getRealTimePhoneNumber,
        openSetting,
        launchApp,
        getUserInfo,
        chooseAvatar,
        agreePrivacyAuthorization,
        contact,
        openTypeError
      } = useButton(props, emits);
      const { ns, buttonClass, buttonStyle } = useButtonCustomStyle(props);
      const __returned__ = { props, emits, buttonClick, getPhoneNumber, getRealTimePhoneNumber, openSetting, launchApp, getUserInfo, chooseAvatar, agreePrivacyAuthorization, contact, openTypeError, ns, buttonClass, buttonStyle, TnIcon, TnLoading };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    return $setup.props.clickModifiers === "stop" ? (vue.openBlock(), vue.createElementBlock("button", {
      key: 0,
      class: vue.normalizeClass(["tn-u-btn-clear", [$setup.buttonClass]]),
      style: vue.normalizeStyle($setup.buttonStyle),
      "hover-class": $setup.props.disabled || $setup.props.loading || $setup.props.onlyButton ? "" : _ctx.hoverClass,
      disabled: _ctx.disabled,
      "form-type": _ctx.formType,
      "open-type": _ctx.openType,
      "app-parameter": _ctx.appParameter,
      "session-from": _ctx.sessionFrom,
      "send-message-title": _ctx.sendMessageTitle,
      "send-message-path": _ctx.sendMessagePath,
      "send-message-img": _ctx.sendMessageImg,
      "show-message-card": _ctx.showMessageCard,
      "phone-number-no-quota-toast": _ctx.phoneNumberNoQuotaToast,
      onClick: _cache[0] || (_cache[0] = vue.withModifiers((...args) => $setup.buttonClick && $setup.buttonClick(...args), ["stop"])),
      onGetphonenumber: _cache[1] || (_cache[1] = (...args) => $setup.getPhoneNumber && $setup.getPhoneNumber(...args)),
      onGetrealtimephonenumber: _cache[2] || (_cache[2] = (...args) => $setup.getRealTimePhoneNumber && $setup.getRealTimePhoneNumber(...args)),
      onOpensetting: _cache[3] || (_cache[3] = (...args) => $setup.openSetting && $setup.openSetting(...args)),
      onLaunchapp: _cache[4] || (_cache[4] = (...args) => $setup.launchApp && $setup.launchApp(...args)),
      onGetuserinfo: _cache[5] || (_cache[5] = (...args) => $setup.getUserInfo && $setup.getUserInfo(...args)),
      onChooseavatar: _cache[6] || (_cache[6] = (...args) => $setup.chooseAvatar && $setup.chooseAvatar(...args)),
      onAgreeprivacyauthorization: _cache[7] || (_cache[7] = (...args) => $setup.agreePrivacyAuthorization && $setup.agreePrivacyAuthorization(...args)),
      onContact: _cache[8] || (_cache[8] = (...args) => $setup.contact && $setup.contact(...args)),
      onError: _cache[9] || (_cache[9] = (...args) => $setup.openTypeError && $setup.openTypeError(...args))
    }, [
      vue.createCommentVNode(" TODO: loading状态 "),
      _ctx.loading ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 0,
          class: vue.normalizeClass([$setup.ns.m("loading")])
        },
        [
          vue.createVNode($setup["TnLoading"], {
            show: "",
            animation: "",
            mode: "flower",
            color: "tn-gray"
          })
        ],
        2
        /* CLASS */
      )) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" icon显示 "),
      _ctx.icon ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 1,
          class: vue.normalizeClass([$setup.ns.e("icon")])
        },
        [
          vue.createVNode($setup["TnIcon"], { name: _ctx.icon }, null, 8, ["name"])
        ],
        2
        /* CLASS */
      )) : vue.renderSlot(_ctx.$slots, "default", { key: 2 }, void 0, true)
    ], 46, ["hover-class", "disabled", "form-type", "open-type", "app-parameter", "session-from", "send-message-title", "send-message-path", "send-message-img", "show-message-card", "phone-number-no-quota-toast"])) : (vue.openBlock(), vue.createElementBlock("button", {
      key: 1,
      class: vue.normalizeClass(["tn-u-btn-clear", [$setup.buttonClass]]),
      style: vue.normalizeStyle($setup.buttonStyle),
      "hover-class": $setup.props.disabled || $setup.props.loading || $setup.props.onlyButton ? "" : _ctx.hoverClass,
      disabled: _ctx.disabled,
      "form-type": _ctx.formType,
      "open-type": _ctx.openType,
      "app-parameter": _ctx.appParameter,
      "session-from": _ctx.sessionFrom,
      "send-message-title": _ctx.sendMessageTitle,
      "send-message-path": _ctx.sendMessagePath,
      "send-message-img": _ctx.sendMessageImg,
      "show-message-card": _ctx.showMessageCard,
      "phone-number-no-quota-toast": _ctx.phoneNumberNoQuotaToast,
      onClick: _cache[10] || (_cache[10] = (...args) => $setup.buttonClick && $setup.buttonClick(...args)),
      onGetphonenumber: _cache[11] || (_cache[11] = (...args) => $setup.getPhoneNumber && $setup.getPhoneNumber(...args)),
      onGetrealtimephonenumber: _cache[12] || (_cache[12] = (...args) => $setup.getRealTimePhoneNumber && $setup.getRealTimePhoneNumber(...args)),
      onOpensetting: _cache[13] || (_cache[13] = (...args) => $setup.openSetting && $setup.openSetting(...args)),
      onLaunchapp: _cache[14] || (_cache[14] = (...args) => $setup.launchApp && $setup.launchApp(...args)),
      onGetuserinfo: _cache[15] || (_cache[15] = (...args) => $setup.getUserInfo && $setup.getUserInfo(...args)),
      onChooseavatar: _cache[16] || (_cache[16] = (...args) => $setup.chooseAvatar && $setup.chooseAvatar(...args)),
      onAgreeprivacyauthorization: _cache[17] || (_cache[17] = (...args) => $setup.agreePrivacyAuthorization && $setup.agreePrivacyAuthorization(...args)),
      onContact: _cache[18] || (_cache[18] = (...args) => $setup.contact && $setup.contact(...args)),
      onError: _cache[19] || (_cache[19] = (...args) => $setup.openTypeError && $setup.openTypeError(...args))
    }, [
      vue.createCommentVNode(" TODO: loading状态 "),
      _ctx.loading ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 0,
          class: vue.normalizeClass([$setup.ns.m("loading")])
        },
        [
          vue.createVNode($setup["TnLoading"], {
            show: "",
            animation: "",
            mode: "flower",
            color: "tn-gray"
          })
        ],
        2
        /* CLASS */
      )) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" icon显示 "),
      _ctx.icon ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 1,
          class: vue.normalizeClass([$setup.ns.e("icon")])
        },
        [
          vue.createVNode($setup["TnIcon"], { name: _ctx.icon }, null, 8, ["name"])
        ],
        2
        /* CLASS */
      )) : vue.renderSlot(_ctx.$slots, "default", { key: 2 }, void 0, true)
    ], 46, ["hover-class", "disabled", "form-type", "open-type", "app-parameter", "session-from", "send-message-title", "send-message-path", "send-message-img", "show-message-card", "phone-number-no-quota-toast"]));
  }
  const TnButton = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__scopeId", "data-v-8255d5af"], ["__file", "/Users/zhizhi/node_modules/@tuniao/tnui-vue3-uniapp/components/button/src/button.vue"]]);
  const badgeProps = buildProps({
    /**
     * @description 徽标内容，可以是数字或者字符串，当为数字时，超过max会显示{max}+，以icon-开头则显示图标
     */
    value: {
      type: [String, Number]
    },
    /**
     * @description 徽标内容最大值，在value为number时有效，超过最大值会显示{max}+
     */
    max: {
      type: [String, Number]
    },
    /**
     * @description 徽标颜色类型
     */
    type: {
      type: String,
      values: componentTypes,
      default: "primary"
    },
    /**
     * @description 徽标背景颜色, 以tn开头则使用图鸟内置的颜色
     */
    bgColor: String,
    /**
     * @description 徽标文字颜色, 以tn开头则使用图鸟内置的颜色
     */
    textColor: String,
    /**
     * @description 徽标大小
     */
    size: {
      type: [String, Number]
    },
    /**
     * @description 字体大小
     */
    fontSize: {
      type: [String, Number]
    },
    /**
     * @description 徽标加粗
     */
    bold: Boolean,
    /**
     * @description 自定义徽标样式
     */
    customStyle: useComponentCustomStyleProp,
    /**
     * @description 自定义徽标类
     */
    customClass: String,
    /**
     * @description 是否显示点徽标
     */
    dot: Boolean,
    /**
     * @description 是否绝对定位徽标
     */
    absolute: {
      type: Boolean,
      default: true
    },
    /**
     * @description 绝对定位的位置
     */
    absolutePosition: {
      type: definePropType(Object),
      default: () => ({})
    },
    /**
     * @description 绝对居中对齐
     */
    absoluteCenter: {
      type: Boolean,
      default: true
    },
    /**
     * @description 点击标识
     */
    index: useComponentIndexProp
  });
  const badgeEmits = {
    /**
     * @description 点击事件
     */
    click: (index) => typeof index === "number" || typeof index === "string"
  };
  const useBadge = (props, emits) => {
    const showBadge = vue.computed(() => {
      return !!props.dot || props.value !== "" && props.value !== void 0;
    });
    const contentType = vue.computed(() => {
      let type = "string";
      if (isNumber(props.value))
        type = "number";
      if (shared.isString(props.value) && props.value.startsWith("icon-"))
        type = "icon";
      return type;
    });
    const content = vue.computed(() => {
      if (props.dot)
        return "";
      if (contentType.value === "number" && props.max) {
        const value = Number(props.value || 0);
        const max = Number(props.max || 0);
        return value > max ? `${max}+` : `${value}`;
      }
      if (contentType.value === "icon")
        return props.value.replace("icon-", "");
      return props.value;
    });
    const badgeClick = () => {
      if (emits)
        emits("click", props.index);
    };
    return {
      showBadge,
      contentType,
      content,
      badgeClick
    };
  };
  const useBadgeCustomStyle = (props) => {
    const ns = useNamespace("badge");
    const contentNs = useNamespace("badge-content");
    const { contentType } = useBadge(props);
    const [bgColorClass, bgColorStyle] = useComponentColor(
      vue.toRef(props, "bgColor"),
      "bg"
    );
    const [textColorClass, textColorStyle] = useComponentColor(
      vue.toRef(props, "textColor"),
      "text"
    );
    const { sizeType } = useComponentSize(props.size);
    const badgeContentClass = vue.computed(() => {
      const cls = [];
      cls.push(contentNs.b());
      if (props.dot)
        cls.push(contentNs.m("dot"));
      if (contentType.value === "icon")
        cls.push(contentNs.m("icon"));
      if (props.absolute) {
        cls.push(contentNs.e("absolute"));
        if (props.absoluteCenter)
          cls.push(contentNs.em("absolute", "center"));
      }
      if (props.type)
        cls.push(`tn-type-${props.type}_bg`);
      if (bgColorClass.value)
        cls.push(bgColorClass.value);
      if (textColorClass.value)
        cls.push(textColorClass.value);
      if (props.size && sizeType.value === "inner")
        cls.push(contentNs.m(props.size));
      if (props.bold)
        cls.push("tn-text-bold");
      if (props.customClass)
        cls.push(props.customClass);
      return cls.join(" ");
    });
    const badgeContentStyle = vue.computed(() => {
      const style = {};
      if (bgColorStyle.value)
        style.backgroundColor = bgColorStyle.value;
      if (textColorStyle.value)
        style.color = textColorStyle.value;
      if (props.size && (sizeType.value === "custom" || contentType.value === "icon"))
        style.width = style.height = formatDomSizeValue(props.size);
      if (props.fontSize)
        style.fontSize = formatDomSizeValue(props.fontSize);
      if (props.absolutePosition.top)
        style.top = formatDomSizeValue(props.absolutePosition.top);
      if (props.absolutePosition.right)
        style.right = formatDomSizeValue(props.absolutePosition.right);
      if (!isEmpty(props.customStyle)) {
        Object.assign(style, props.customStyle);
      }
      return style;
    });
    return {
      ns,
      contentNs,
      badgeContentClass,
      badgeContentStyle
    };
  };
  const _sfc_main$8 = /* @__PURE__ */ vue.defineComponent({
    __name: "badge",
    props: badgeProps,
    emits: badgeEmits,
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emits = __emit;
      const slots = vue.useSlots();
      const { ns, contentNs, badgeContentClass, badgeContentStyle } = useBadgeCustomStyle(props);
      const { showBadge, contentType, content, badgeClick } = useBadge(props, emits);
      const badgeClass = vue.computed(() => {
        const cls = [];
        cls.push(ns.b());
        if (!(slots == null ? void 0 : slots.default)) {
          if (props.absolute) {
            cls.push(ns.e("absolute"));
            if (props.absoluteCenter)
              cls.push(ns.em("absolute", "center"));
          }
        }
        return cls.join(" ");
      });
      const __returned__ = { props, emits, slots, ns, contentNs, badgeContentClass, badgeContentStyle, showBadge, contentType, content, badgeClick, badgeClass, TnIcon };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass([$setup.badgeClass])
      },
      [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true),
        vue.createCommentVNode(" 徽标 "),
        $setup.showBadge ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 0,
            class: vue.normalizeClass([$setup.badgeContentClass]),
            style: vue.normalizeStyle($setup.badgeContentStyle),
            onClick: _cache[0] || (_cache[0] = vue.withModifiers((...args) => $setup.badgeClick && $setup.badgeClick(...args), ["stop"]))
          },
          [
            $setup.content ? (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              { key: 0 },
              [
                $setup.contentType === "icon" ? (vue.openBlock(), vue.createBlock($setup["TnIcon"], {
                  key: 0,
                  name: $setup.content
                }, null, 8, ["name"])) : (vue.openBlock(), vue.createElementBlock(
                  "span",
                  {
                    key: 1,
                    class: vue.normalizeClass(`${$setup.contentNs.e("data")}`)
                  },
                  vue.toDisplayString($setup.content),
                  3
                  /* TEXT, CLASS */
                ))
              ],
              64
              /* STABLE_FRAGMENT */
            )) : vue.createCommentVNode("v-if", true)
          ],
          6
          /* CLASS, STYLE */
        )) : vue.createCommentVNode("v-if", true)
      ],
      2
      /* CLASS */
    );
  }
  const TnBadge = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__scopeId", "data-v-2d26e78e"], ["__file", "/Users/zhizhi/node_modules/@tuniao/tnui-vue3-uniapp/components/badge/src/badge.vue"]]);
  const avatarShape = ["circle", "square"];
  const avatarProps = buildProps({
    /**
     * @description 头像地址(url地址和绝对地址)
     */
    url: String,
    /**
     * @descripttion 头像图标
     */
    icon: String,
    /**
     * @description 头像图标配置
     */
    iconConfig: {
      type: definePropType(Object),
      default: () => ({})
    },
    /**
     * @description 头像颜色类型
     */
    type: {
      type: String,
      values: componentTypes,
      default: ""
    },
    /**
     * @description 头像大小
     */
    size: {
      type: [String, Number]
    },
    /**
     * @description 头像形状
     */
    shape: {
      type: String,
      values: avatarShape,
      default: "circle"
    },
    /**
     * @description 头像图片模式
     */
    imgMode: {
      type: String,
      values: componentImgModes,
      default: "aspectFill"
    },
    /**
     * @description 背景颜色
     */
    bgColor: String,
    /**
     * @description 显示边框
     */
    border: useComponentBoolean,
    /**
     * @description 边框颜色
     */
    borderColor: String,
    /**
     * @description 是否加粗边框
     */
    borderBold: useComponentBoolean,
    /**
     * @description 显示阴影
     */
    shadow: useComponentBoolean,
    /**
     * @description 阴影颜色
     */
    shadowColor: String,
    /**
     * @description 角标内容
     */
    badge: {
      type: [String, Number]
    },
    /**
     * @description 角标配置
     */
    badgeConfig: {
      type: definePropType(Object),
      default: () => ({})
    }
  });
  const avatarEmits = {
    /**
     * @description 点击事件
     */
    click: () => true
  };
  const avatarGroupContextKey = Symbol(
    "avatarGroupContextKey"
  );
  const useAvatarIconConfig = (config) => {
    const avatarGroup = vue.inject(avatarGroupContextKey, void 0);
    const iconColor = vue.computed(() => {
      var _a;
      return (config == null ? void 0 : config.color) || ((_a = avatarGroup == null ? void 0 : avatarGroup.iconConfig) == null ? void 0 : _a.color) || "";
    });
    const iconSize = vue.computed(() => {
      var _a;
      return (config == null ? void 0 : config.size) || ((_a = avatarGroup == null ? void 0 : avatarGroup.iconConfig) == null ? void 0 : _a.size) || "";
    });
    const iconBold = vue.computed(() => {
      var _a;
      return (config == null ? void 0 : config.bold) || ((_a = avatarGroup == null ? void 0 : avatarGroup.iconConfig) == null ? void 0 : _a.bold) || false;
    });
    return {
      iconColor,
      iconSize,
      iconBold
    };
  };
  const useAvatarProps = (props) => {
    const avatarGroup = vue.inject(avatarGroupContextKey, void 0);
    const type = vue.computed(() => {
      return isEmptyDoubleVariableInDefault(props == null ? void 0 : props.type, avatarGroup == null ? void 0 : avatarGroup.type, "");
    });
    const size = vue.computed(() => {
      return isEmptyDoubleVariableInDefault(props == null ? void 0 : props.size, avatarGroup == null ? void 0 : avatarGroup.size, "");
    });
    const shape = vue.computed(() => {
      return isEmptyDoubleVariableInDefault(
        props == null ? void 0 : props.shape,
        avatarGroup == null ? void 0 : avatarGroup.shape,
        "circle"
      );
    });
    const imgMode = vue.computed(() => {
      return isEmptyDoubleVariableInDefault(
        props == null ? void 0 : props.imgMode,
        avatarGroup == null ? void 0 : avatarGroup.imgMode,
        "aspectFill"
      );
    });
    const bgColor = vue.computed(() => {
      return isEmptyDoubleVariableInDefault(
        props == null ? void 0 : props.bgColor,
        avatarGroup == null ? void 0 : avatarGroup.bgColor,
        "tn-gray-light"
      );
    });
    const border = vue.computed(() => {
      return isEmptyDoubleVariableInDefault(
        props == null ? void 0 : props.border,
        avatarGroup == null ? void 0 : avatarGroup.border,
        false
      );
    });
    const borderColor = vue.computed(() => {
      return isEmptyDoubleVariableInDefault(
        props == null ? void 0 : props.borderColor,
        avatarGroup == null ? void 0 : avatarGroup.borderColor,
        ""
      );
    });
    const borderBold = vue.computed(() => {
      return isEmptyDoubleVariableInDefault(
        props == null ? void 0 : props.borderBold,
        avatarGroup == null ? void 0 : avatarGroup.borderBold,
        false
      );
    });
    const shadow = vue.computed(() => {
      return isEmptyDoubleVariableInDefault(
        props == null ? void 0 : props.shadow,
        avatarGroup == null ? void 0 : avatarGroup.shadow,
        false
      );
    });
    const shadowColor = vue.computed(() => {
      return isEmptyDoubleVariableInDefault(
        props == null ? void 0 : props.shadowColor,
        avatarGroup == null ? void 0 : avatarGroup.shadowColor,
        ""
      );
    });
    const avatarGap = vue.computed(() => {
      let gap = Number(isEmptyVariableInDefault(avatarGroup == null ? void 0 : avatarGroup.gap, 0));
      if (gap < 0)
        gap = 0;
      if (gap > 1)
        gap = 1;
      return gap;
    });
    return {
      type,
      size,
      shape,
      imgMode,
      bgColor,
      border,
      borderColor,
      borderBold,
      shadow,
      shadowColor,
      avatarGap
    };
  };
  const useAvatarCustomStyle = (props, groupIndex, avatarWidth) => {
    const ns = useNamespace("avatar");
    const {
      type,
      size,
      shape,
      bgColor,
      border,
      borderColor,
      shadow,
      shadowColor,
      avatarGap
    } = useAvatarProps(props);
    const [bgColorClass, bgColorStyle] = useComponentColor(bgColor, "bg");
    const [borderColorClass, borderColorStyle] = useComponentColor(
      borderColor,
      "border"
    );
    const [shadowColorClass] = useComponentColor(shadowColor, "shadow");
    const { sizeType } = useComponentSize(size.value);
    const avatarClass = vue.computed(() => {
      const cls = [];
      cls.push(ns.b());
      if (type.value)
        cls.push(`tn-type-${type.value}_bg`);
      if (!type.value && bgColorClass.value)
        cls.push(bgColorClass.value);
      if (sizeType.value === "inner")
        cls.push(ns.m(size.value));
      if (shape.value)
        cls.push(ns.m(shape.value));
      if (border.value) {
        cls.push("tn-border");
        if (borderColorClass.value)
          cls.push(borderColorClass.value);
      }
      if (shadow.value) {
        cls.push("tn-shadow");
        if (shadowColorClass.value)
          cls.push(shadowColorClass.value);
      }
      return cls.join(" ");
    });
    const avatarStyle = vue.computed(() => {
      const style = {};
      if (sizeType.value === "custom") {
        style.width = formatDomSizeValue(size.value);
        style.height = style.width;
      }
      if (bgColorStyle.value)
        style.backgroundColor = bgColorStyle.value;
      if (border.value && borderColorStyle.value)
        style.borderColor = borderColorStyle.value;
      if (groupIndex.value != -1) {
        style.zIndex = groupIndex.value + 1;
        if (groupIndex.value > 0) {
          style.marginLeft = `calc(-${avatarWidth.value * avatarGap.value}px)`;
        } else {
          style.marginLeft = "0px";
        }
      }
      return style;
    });
    return {
      ns,
      avatarClass,
      avatarStyle
    };
  };
  const useAvatar = (props, emits) => {
    const instance = vue.getCurrentInstance();
    if (!instance) {
      debugWarn("TnAvatarGroup", "请在 setup 中使用 useAvatarGroup");
    }
    const { uid } = instance;
    const avatarGroup = vue.inject(avatarGroupContextKey, void 0);
    avatarGroup == null ? void 0 : avatarGroup.addItem({ uid });
    const componentId = `ta-${generateId()}`;
    const { getSelectorNodeInfo } = useSelectorQuery(instance);
    const groupAvatarCount = vue.computed(() => {
      return isEmptyVariableInDefault(avatarGroup == null ? void 0 : avatarGroup.avatarItems.length, 0);
    });
    const avatarGroupIndex = vue.ref(-1);
    vue.nextTick(() => {
      const avatarIndex = avatarGroup == null ? void 0 : avatarGroup.avatarItems.findIndex(
        (item) => item.uid === uid
      );
      avatarGroupIndex.value = isEmptyVariableInDefault(avatarIndex, -1);
      if (!avatarWidth.value && avatarGroupIndex.value !== -1) {
        getAvatarWidthNodeInfo();
      }
    });
    const avatarWidth = vue.ref(0);
    let initCount = 0;
    const getAvatarWidthNodeInfo = async () => {
      try {
        const rectInfo = await getSelectorNodeInfo(`#${componentId}`);
        if (!rectInfo.width) {
          throw new Error("获取头像宽度信息失败");
        }
        avatarWidth.value = rectInfo.width || 0;
      } catch (err) {
        if (initCount > 10) {
          initCount = 0;
          debugWarn("TnAvatar", `获取头像宽度信息失败：${err}`);
          return;
        }
        initCount++;
        setTimeout(() => {
          getAvatarWidthNodeInfo();
        }, 150);
      }
    };
    const avatarClick = () => {
      avatarGroup == null ? void 0 : avatarGroup.handleItemClick(uid);
      emits("click");
    };
    vue.onUnmounted(() => {
      avatarGroup == null ? void 0 : avatarGroup.removeItem(uid);
    });
    return {
      componentId,
      groupAvatarCount,
      avatarGroupIndex,
      avatarWidth,
      avatarClick
    };
  };
  const useAvatarBadgeProps = (props) => {
    const avatarGroup = vue.inject(avatarGroupContextKey, void 0);
    const max = vue.computed(() => {
      var _a, _b;
      return isEmptyDoubleVariableInDefault(
        (_a = props == null ? void 0 : props.badgeConfig) == null ? void 0 : _a.max,
        (_b = avatarGroup == null ? void 0 : avatarGroup.badgeConfig) == null ? void 0 : _b.max
      );
    });
    const type = vue.computed(() => {
      var _a, _b;
      return isEmptyDoubleVariableInDefault(
        (_a = props == null ? void 0 : props.badgeConfig) == null ? void 0 : _a.type,
        (_b = avatarGroup == null ? void 0 : avatarGroup.badgeConfig) == null ? void 0 : _b.type,
        "primary"
      );
    });
    const bgColor = vue.computed(() => {
      var _a, _b;
      return isEmptyDoubleVariableInDefault(
        (_a = props == null ? void 0 : props.badgeConfig) == null ? void 0 : _a.bgColor,
        (_b = avatarGroup == null ? void 0 : avatarGroup.badgeConfig) == null ? void 0 : _b.bgColor
      );
    });
    const textColor = vue.computed(() => {
      var _a, _b;
      return isEmptyDoubleVariableInDefault(
        (_a = props == null ? void 0 : props.badgeConfig) == null ? void 0 : _a.textColor,
        (_b = avatarGroup == null ? void 0 : avatarGroup.badgeConfig) == null ? void 0 : _b.textColor
      );
    });
    const fontSize = vue.computed(() => {
      var _a, _b;
      return isEmptyDoubleVariableInDefault(
        (_a = props == null ? void 0 : props.badgeConfig) == null ? void 0 : _a.fontSize,
        (_b = avatarGroup == null ? void 0 : avatarGroup.badgeConfig) == null ? void 0 : _b.fontSize
      );
    });
    const size = vue.computed(() => {
      var _a, _b;
      return isEmptyDoubleVariableInDefault(
        (_a = props == null ? void 0 : props.badgeConfig) == null ? void 0 : _a.size,
        (_b = avatarGroup == null ? void 0 : avatarGroup.badgeConfig) == null ? void 0 : _b.size
      );
    });
    const bold = vue.computed(() => {
      var _a, _b;
      return isEmptyDoubleVariableInDefault(
        (_a = props == null ? void 0 : props.badgeConfig) == null ? void 0 : _a.bold,
        (_b = avatarGroup == null ? void 0 : avatarGroup.badgeConfig) == null ? void 0 : _b.bold,
        false
      );
    });
    const dot = vue.computed(() => {
      var _a, _b;
      return isEmptyDoubleVariableInDefault(
        (_a = props == null ? void 0 : props.badgeConfig) == null ? void 0 : _a.dot,
        (_b = avatarGroup == null ? void 0 : avatarGroup.badgeConfig) == null ? void 0 : _b.dot,
        false
      );
    });
    const absolutePosition = vue.computed(() => {
      var _a, _b;
      return isEmptyDoubleVariableInDefault(
        (_a = props == null ? void 0 : props.badgeConfig) == null ? void 0 : _a.absolutePosition,
        (_b = avatarGroup == null ? void 0 : avatarGroup.badgeConfig) == null ? void 0 : _b.absolutePosition,
        {}
      );
    });
    const absoluteCenter = vue.computed(() => {
      var _a, _b;
      return isEmptyDoubleVariableInDefault(
        (_a = props == null ? void 0 : props.badgeConfig) == null ? void 0 : _a.absoluteCenter,
        (_b = avatarGroup == null ? void 0 : avatarGroup.badgeConfig) == null ? void 0 : _b.absoluteCenter,
        true
      );
    });
    const badgeConfig = vue.computed(() => {
      return {
        value: props.badge,
        max: max.value,
        type: type.value,
        bgColor: bgColor.value,
        textColor: textColor.value,
        fontSize: fontSize.value,
        size: size.value,
        bold: bold.value,
        customClass: "",
        customStyle: {},
        dot: dot.value,
        absolute: true,
        absolutePosition: absolutePosition.value,
        absoluteCenter: absoluteCenter.value,
        index: ""
      };
    });
    return {
      badgeConfig
    };
  };
  const _sfc_main$7 = /* @__PURE__ */ vue.defineComponent({
    __name: "avatar",
    props: avatarProps,
    emits: avatarEmits,
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emits = __emit;
      const { componentId, avatarGroupIndex, avatarWidth, avatarClick } = useAvatar(
        props,
        emits
      );
      const { ns, avatarClass, avatarStyle } = useAvatarCustomStyle(
        props,
        avatarGroupIndex,
        avatarWidth
      );
      const { imgMode } = useAvatarProps(props);
      const { iconSize, iconColor, iconBold } = useAvatarIconConfig(props.iconConfig);
      const { badgeConfig } = useAvatarBadgeProps(props);
      const __returned__ = { props, emits, componentId, avatarGroupIndex, avatarWidth, avatarClick, ns, avatarClass, avatarStyle, imgMode, iconSize, iconColor, iconBold, badgeConfig, TnIcon, TnBadge };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", {
      id: $setup.componentId,
      class: vue.normalizeClass([$setup.avatarClass]),
      style: vue.normalizeStyle($setup.avatarStyle),
      onClick: _cache[0] || (_cache[0] = (...args) => $setup.avatarClick && $setup.avatarClick(...args))
    }, [
      vue.createCommentVNode(" 图片头像 "),
      _ctx.url ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 0,
          class: vue.normalizeClass([$setup.ns.e("image")])
        },
        [
          vue.createElementVNode("image", {
            class: "image",
            src: _ctx.url,
            mode: $setup.imgMode
          }, null, 8, ["src", "mode"])
        ],
        2
        /* CLASS */
      )) : _ctx.icon ? (vue.openBlock(), vue.createElementBlock(
        vue.Fragment,
        { key: 1 },
        [
          vue.createCommentVNode(" 图标头像 "),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass([$setup.ns.e("icon")])
            },
            [
              vue.createVNode($setup["TnIcon"], {
                name: _ctx.icon,
                color: $setup.iconColor,
                size: $setup.iconSize,
                bold: $setup.iconBold
              }, null, 8, ["name", "color", "size", "bold"])
            ],
            2
            /* CLASS */
          )
        ],
        2112
        /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
      )) : (vue.openBlock(), vue.createElementBlock(
        vue.Fragment,
        { key: 2 },
        [
          vue.createCommentVNode(" 自定义 "),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass([$setup.ns.e("custom")])
            },
            [
              vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
            ],
            2
            /* CLASS */
          )
        ],
        2112
        /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
      )),
      vue.createCommentVNode(" 角标 "),
      vue.createVNode(
        $setup["TnBadge"],
        vue.normalizeProps(vue.guardReactiveProps($setup.badgeConfig)),
        null,
        16
        /* FULL_PROPS */
      )
    ], 14, ["id"]);
  }
  const TnAvatar = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__scopeId", "data-v-b8570693"], ["__file", "/Users/zhizhi/node_modules/@tuniao/tnui-vue3-uniapp/components/avatar/src/avatar.vue"]]);
  const _sfc_main$6 = {
    __name: "Roles",
    props: {
      modelValue: {
        type: Boolean,
        default: false
      }
    },
    emits: ["update:modelValue"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const show = vue.ref(true);
      const props = __props;
      const emit = __emit;
      function onClose() {
        emit("update:modelValue", false);
      }
      const roles = vue.ref([
        {
          id: 1,
          name: "红眼",
          value: 900,
          avatar: "/static/t0.jpeg"
        },
        {
          id: 2,
          name: "大枪",
          value: 1,
          avatar: "/static/t1.jpeg"
        },
        {
          id: 3,
          name: "大枪",
          value: 1,
          avatar: "/static/t2.jpeg"
        },
        {
          id: 4,
          name: "大枪",
          value: 1,
          avatar: "/static/big_gun.png"
        },
        {
          id: 5,
          name: "大枪",
          value: 1,
          avatar: "/static/big_gun.png"
        },
        {
          id: 6,
          name: "大枪",
          value: 1,
          avatar: "/static/big_gun.png"
        },
        {
          id: 7,
          name: "大枪",
          value: 1,
          avatar: "/static/big_gun.png"
        },
        {
          id: 8,
          name: "大枪",
          value: 1,
          avatar: "/static/big_gun.png"
        },
        {
          id: 9,
          name: "大枪",
          value: 1,
          avatar: "/static/big_gun.png"
        },
        {
          id: 10,
          name: "大枪",
          value: 1,
          avatar: "/static/big_gun.png"
        },
        {
          id: 11,
          name: "大枪",
          value: 1,
          avatar: "/static/big_gun.png"
        },
        {
          id: 12,
          name: "大枪",
          value: 1,
          avatar: "/static/big_gun.png"
        },
        {
          id: 13,
          name: "大枪",
          value: 1,
          avatar: "/static/big_gun.png"
        },
        {
          id: 14,
          name: "大枪",
          value: 1,
          avatar: "/static/big_gun.png"
        },
        {
          id: 15,
          name: "大枪",
          value: 1,
          avatar: "/static/big_gun.png"
        }
      ]);
      const activeRoleId = vue.ref(1);
      function selectRole(role) {
        activeRoleId.value = role.id;
      }
      function manageRoles() {
        uni.navigateTo({
          url: "/pages/role/manage"
        });
      }
      function createRole() {
        uni.navigateTo({
          url: "/pages/role/create"
        });
      }
      const __returned__ = { show, props, emit, onClose, roles, activeRoleId, selectRole, manageRoles, createRole, ref: vue.ref, TnIcon, TnButton, TnAvatar, TnPopup };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createCommentVNode(" 标题 "),
        vue.createElementVNode("view", { class: "wrap" }, [
          vue.createElementVNode("view", { class: "popup-header" }, "选择角色"),
          vue.createElementVNode("view", {
            class: "fui-icon__close",
            onClick: $setup.onClose
          }, [
            vue.createVNode($setup["TnIcon"], { name: "close" }),
            vue.createCommentVNode(' <fui-icon name="close" :size="48"></fui-icon> ')
          ]),
          vue.createCommentVNode(" 滚动区 + CSS Grid 布局 "),
          vue.createElementVNode("scroll-view", {
            "scroll-y": "",
            class: "popup-body"
          }, [
            vue.createElementVNode("view", { class: "role-list" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.roles, (role, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: index,
                    class: vue.normalizeClass(["role-card", { "card-active": $setup.activeRoleId === role.id }]),
                    onClick: ($event) => $setup.selectRole(role)
                  }, [
                    vue.createCommentVNode(' <image class="card-active" src="/static/right_active.png" mode=""></image> '),
                    vue.createVNode($setup["TnAvatar"], {
                      url: role.avatar,
                      size: "80rpx"
                    }, null, 8, ["url"]),
                    vue.createElementVNode("view", { class: "role-info" }, [
                      vue.createElementVNode(
                        "view",
                        { class: "role-value" },
                        vue.toDisplayString(role.value) + " " + vue.toDisplayString(role.name),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "view",
                        { class: "role-subtitle" },
                        "测试" + vue.toDisplayString(role.id) + "-",
                        1
                        /* TEXT */
                      )
                    ])
                  ], 10, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ]),
          vue.createCommentVNode(" 底部自定义按钮组 "),
          vue.createElementVNode("view", { class: "popup-footer" }, [
            vue.createElementVNode("view", {
              class: "btn btn-default",
              onClick: $setup.manageRoles
            }, "管理角色"),
            vue.createElementVNode("view", {
              class: "btn btn-primary",
              onClick: $setup.createRole
            }, "新建角色")
          ])
        ])
      ],
      2112
      /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
    );
  }
  const Roles = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__scopeId", "data-v-28c75cb3"], ["__file", "/Users/zhizhi/Documents/HBuilderProjects/dnf/components/Roles.vue"]]);
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  const _sfc_main$5 = {
    __name: "team",
    setup(__props, { expose: __expose }) {
      __expose();
      const show = vue.ref(true);
      const sys = uni.getSystemInfoSync();
      const popupHeight = sys.windowHeight * 0.7 + "px";
      const dungeons = [
        { id: 1, cover: "/static/d1.jpg", label: "攻坚·奥兹玛" },
        { id: 2, cover: "/static/d2.jpg", label: "降临·奥兹玛" }
      ];
      const innerTabs = [
        { value: "charter", label: "包车", icon: "car" },
        { value: "taira", label: "泰拉车", icon: "shield" }
      ];
      const currentRole = { id: 2, avatar: "/static/t0.jpeg", name: "大枪", value: "1.0" };
      const positions = [
        { value: "charter", label: "包车" },
        { value: "puncher", label: "打手" },
        { value: "mix", label: "混子" }
      ];
      const closureOptions = [
        { value: 0, label: "无" },
        { value: 1, label: "1个" },
        { value: 2, label: "2个" }
      ];
      const hireOptions = [
        { value: 0, label: "无" },
        { value: 1, label: "1名" },
        { value: 2, label: "2名" }
      ];
      const selectedDungeon = vue.ref(1);
      const selectedTab = vue.ref("charter");
      const selectedPosition = vue.ref("charter");
      const selectedClosure = vue.ref(0);
      const selectedHire = vue.ref(1);
      function selectRole(r) {
        formatAppLog("log", "at components/team.vue:163", "选中角色", r);
      }
      function createRoom() {
        uni.navigateTo({ url: "/pages/room/create" });
      }
      function joinQuick() {
        uni.navigateTo({ url: "/pages/room/join" });
      }
      function tip(msg) {
        uni.showToast({ title: msg, icon: "none" });
      }
      const __returned__ = { show, sys, popupHeight, dungeons, innerTabs, currentRole, positions, closureOptions, hireOptions, selectedDungeon, selectedTab, selectedPosition, selectedClosure, selectedHire, selectRole, createRoom, joinQuick, tip, ref: vue.ref, TnIcon, TnAvatar };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createCommentVNode(" 弹窗 "),
        vue.createCommentVNode(" 标题栏 "),
        vue.createElementVNode("view", { class: "hd" }, [
          vue.createElementVNode("text", { class: "title" }, "选择团本"),
          vue.createElementVNode("view", {
            class: "btn-close",
            onClick: _cache[0] || (_cache[0] = ($event) => $setup.show = false)
          }, [
            vue.createVNode($setup["TnIcon"], { name: "close" })
          ])
        ]),
        vue.createCommentVNode(" 滚动区域 "),
        vue.createElementVNode("scroll-view", {
          class: "bd",
          "scroll-y": ""
        }, [
          vue.createCommentVNode(" 团本图 "),
          vue.createElementVNode("view", { class: "dungeon-list" }, [
            (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.dungeons, (d, i) => {
                return vue.createElementVNode("view", {
                  key: d.id,
                  class: vue.normalizeClass(["dungeon-item", { active: $setup.selectedDungeon === d.id }]),
                  onClick: ($event) => $setup.selectedDungeon = d.id
                }, [
                  vue.createElementVNode("image", {
                    src: d.cover,
                    mode: "aspectFill",
                    class: "dungeon-img"
                  }, null, 8, ["src"]),
                  vue.createElementVNode(
                    "view",
                    { class: "dungeon-label" },
                    vue.toDisplayString(d.label),
                    1
                    /* TEXT */
                  )
                ], 10, ["onClick"]);
              }),
              64
              /* STABLE_FRAGMENT */
            ))
          ]),
          vue.createCommentVNode(" 内部切换 Tab "),
          vue.createElementVNode("view", { class: "inner-tab" }, [
            (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.innerTabs, (tab) => {
                return vue.createElementVNode("view", {
                  key: tab.value,
                  class: vue.normalizeClass(["inner-tab-item", { active: $setup.selectedTab === tab.value }]),
                  onClick: ($event) => $setup.selectedTab = tab.value
                }, [
                  vue.createVNode($setup["TnIcon"], {
                    name: tab.icon,
                    size: "32rpx"
                  }, null, 8, ["name"]),
                  vue.createElementVNode(
                    "text",
                    null,
                    vue.toDisplayString(tab.label),
                    1
                    /* TEXT */
                  )
                ], 10, ["onClick"]);
              }),
              64
              /* STABLE_FRAGMENT */
            ))
          ]),
          vue.createCommentVNode(" 当前角色 "),
          vue.createElementVNode("view", { class: "current-role" }, [
            vue.createElementVNode("text", { class: "label" }, "当前角色"),
            vue.createElementVNode("view", { class: "role-display" }, [
              vue.createVNode($setup["TnAvatar"], {
                url: $setup.currentRole.avatar,
                size: "60rpx"
              }, null, 8, ["url"]),
              vue.createElementVNode(
                "text",
                { class: "role-name" },
                vue.toDisplayString($setup.currentRole.value) + " " + vue.toDisplayString($setup.currentRole.name),
                1
                /* TEXT */
              )
            ])
          ]),
          vue.createCommentVNode(" 选择位置 "),
          vue.createElementVNode("view", { class: "form-group" }, [
            vue.createElementVNode("text", { class: "label" }, "选择位置"),
            vue.createElementVNode("view", { class: "options" }, [
              (vue.openBlock(), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.positions, (pos) => {
                  return vue.createElementVNode("view", {
                    key: pos.value,
                    class: vue.normalizeClass(["option-btn", { active: $setup.selectedPosition === pos.value }]),
                    onClick: ($event) => $setup.selectedPosition = pos.value
                  }, vue.toDisplayString(pos.label), 11, ["onClick"]);
                }),
                64
                /* STABLE_FRAGMENT */
              ))
            ])
          ]),
          vue.createCommentVNode(" 关闭位置 "),
          vue.createElementVNode("view", { class: "form-group" }, [
            vue.createElementVNode("view", { class: "label-with-tip" }, [
              vue.createElementVNode("text", null, "关闭位置"),
              vue.createVNode($setup["TnIcon"], {
                name: "help",
                size: "24rpx",
                onClick: _cache[1] || (_cache[1] = ($event) => $setup.tip("关闭位置用法"))
              })
            ]),
            vue.createElementVNode("view", { class: "options" }, [
              (vue.openBlock(), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.closureOptions, (opt) => {
                  return vue.createElementVNode("view", {
                    key: opt.value,
                    class: "radio-item",
                    onClick: ($event) => $setup.selectedClosure = opt.value
                  }, [
                    vue.createElementVNode(
                      "view",
                      {
                        class: vue.normalizeClass(["radio", { checked: $setup.selectedClosure === opt.value }])
                      },
                      null,
                      2
                      /* CLASS */
                    ),
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString(opt.label),
                      1
                      /* TEXT */
                    )
                  ], 8, ["onClick"]);
                }),
                64
                /* STABLE_FRAGMENT */
              ))
            ])
          ]),
          vue.createCommentVNode(" 雇佣打手 "),
          vue.createElementVNode("view", { class: "form-group" }, [
            vue.createElementVNode("view", { class: "label-with-tip" }, [
              vue.createElementVNode("text", null, "雇佣打手"),
              vue.createVNode($setup["TnIcon"], {
                name: "help",
                size: "24rpx",
                onClick: _cache[2] || (_cache[2] = ($event) => $setup.tip("雇佣打手说明"))
              })
            ]),
            vue.createElementVNode("view", { class: "options" }, [
              (vue.openBlock(), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.hireOptions, (opt) => {
                  return vue.createElementVNode("view", {
                    key: opt.value,
                    class: "radio-item",
                    onClick: ($event) => $setup.selectedHire = opt.value
                  }, [
                    vue.createElementVNode(
                      "view",
                      {
                        class: vue.normalizeClass(["radio", { checked: $setup.selectedHire === opt.value }])
                      },
                      null,
                      2
                      /* CLASS */
                    ),
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString(opt.label),
                      1
                      /* TEXT */
                    )
                  ], 8, ["onClick"]);
                }),
                64
                /* STABLE_FRAGMENT */
              ))
            ])
          ])
        ]),
        vue.createCommentVNode(" 红色提示 "),
        vue.createCommentVNode(" 底部按钮 "),
        vue.createElementVNode("view", { class: "ft" }, [
          vue.createElementVNode("view", { class: "warning" }, " 如被抢拍，申诉上传出价+被抢价（2张截图） "),
          vue.createElementVNode("view", { class: "btn-group" }, [
            vue.createElementVNode("view", {
              class: "btn btn-outline",
              onClick: $setup.createRoom
            }, "创建房间"),
            vue.createElementVNode("view", {
              class: "btn btn-primary",
              onClick: $setup.joinQuick
            }, "快速加入")
          ])
        ])
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const Team = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__scopeId", "data-v-176a9427"], ["__file", "/Users/zhizhi/Documents/HBuilderProjects/dnf/components/team.vue"]]);
  const _imports_0$1 = "/static/home/wechat.png";
  const _imports_1 = "/static/home/qq.png";
  const _imports_2 = "/static/01.png";
  const _imports_3 = "/static/t3.jpeg";
  const _imports_4 = "/static/06.png";
  const _imports_5 = "/static/05.png";
  const _imports_6 = "/static/home/03.png";
  const _imports_7 = "/static/banner.png";
  const _imports_8 = "/static/kefu.png";
  const _imports_9 = "/static/avatar.png";
  const _imports_10 = "/static/time.png";
  const _imports_11 = "/static/success_3.png";
  const _imports_12 = "/static/car_active.png";
  const _imports_13 = "/static/08.png";
  const _imports_14 = "/static/08_active.png";
  const _sfc_main$4 = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const statusBarHeight = vue.ref(0);
      const navBarHeight = vue.ref(0);
      vue.onMounted(() => {
        const sys = uni.getSystemInfoSync();
        let padding = 0;
        padding = sys.statusBarHeight + 0;
        navBarHeight.value = padding;
      });
      const leftMenu = vue.ref([
        "降临·奥兹玛（困难）",
        "降临·奥兹玛（简单）",
        "奥兹玛·攻坚·包车混车",
        "奥兹玛·攻坚·自由竞拍",
        "金币泰拉车（100w）",
        "金币泰拉车（200w）",
        "幻境团本",
        "100 级常规团",
        "泰波尔斯"
      ]);
      const activeTab = vue.ref("包车");
      const show = vue.ref(false);
      const teamShow = vue.ref(false);
      const currentMenu = vue.ref(leftMenu.value[0]);
      const linkTo = () => {
        uni.navigateTo({
          url: "/pages/room/room"
        });
      };
      const __returned__ = { statusBarHeight, navBarHeight, leftMenu, activeTab, show, teamShow, currentMenu, linkTo, TnPopup, fuiBottomPopup, ref: vue.ref, computed: vue.computed, onMounted: vue.onMounted, Roles, Team };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode(
        "view",
        {
          style: vue.normalizeStyle({ height: $setup.navBarHeight + "px" })
        },
        null,
        4
        /* STYLE */
      ),
      vue.createCommentVNode(" 顶部状态栏（真实系统状态） "),
      vue.createCommentVNode(' <view class="real-status-bar"></view> '),
      vue.createCommentVNode(' <TnPopup v-model="show" open-direction="bottom" height="80%" borderRadius="16rpx" :safe-area-inset-bottom="true"\n			closeBtn>\n			<Roles></Roles>\n		</TnPopup> '),
      vue.createVNode($setup["fuiBottomPopup"], { show: $setup.show }, {
        default: vue.withCtx(() => [
          vue.createVNode($setup["Roles"], {
            modelValue: $setup.show,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.show = $event)
          }, null, 8, ["modelValue"])
        ]),
        _: 1
        /* STABLE */
      }, 8, ["show"]),
      vue.createCommentVNode(' <fui-bottom-popup :show="true">\n			<Team></Team>\n		</fui-bottom-popup> '),
      vue.createVNode($setup["TnPopup"], {
        "model-value": $setup.teamShow,
        width: "90%",
        height: "60%",
        borderRadius: "16rpx"
      }, {
        default: vue.withCtx(() => [
          vue.createVNode($setup["Team"])
        ]),
        _: 1
        /* STABLE */
      }, 8, ["model-value"]),
      vue.createCommentVNode(" 顶部标签栏 "),
      vue.createElementVNode("view", { class: "top-tabs-wrap" }, [
        vue.createElementVNode("view", { class: "top-kefu" }, " 客服 "),
        vue.createElementVNode("view", { class: "top-tabs" }, [
          vue.createElementVNode("view", { class: "tab active" }, [
            vue.createElementVNode("image", {
              class: "tab-icon",
              src: _imports_0$1,
              mode: "aspectFill"
            }),
            vue.createTextVNode(" 微信区")
          ]),
          vue.createElementVNode("view", { class: "tab" }, [
            vue.createElementVNode("image", {
              class: "tab-icon",
              src: _imports_1,
              mode: "aspectFill"
            }),
            vue.createTextVNode(" QQ区")
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "team-layout" }, [
        vue.createElementVNode("view", {
          class: "create-join-btn",
          onClick: _cache[1] || (_cache[1] = ($event) => $setup.teamShow = true)
        }, [
          vue.createElementVNode("image", {
            class: "fighting-icon",
            src: _imports_2,
            mode: "aspectFill"
          }),
          vue.createElementVNode("text", { class: "join-title" }, "创建/加入")
        ]),
        vue.createElementVNode("view", { class: "team-panel" }, [
          vue.createElementVNode("view", { class: "team-header" }, [
            vue.createElementVNode("image", {
              src: _imports_3,
              mode: "aspectFit",
              class: "team-avatar"
            }),
            vue.createElementVNode("text", { class: "team-title" }, "泰拉车")
          ]),
          vue.createElementVNode("view", { class: "team-cards" }, [
            vue.createCommentVNode(' <view class="team-btn">\n			 			<image class="buy-icon" src="/static/home/01.png" mode="aspectFit"></image>\n			 			<text class="team-btn-title">卖家</text>\n			 		</view>\n			 		<view class="team-btn">\n			 			<image class="buy-icon" src="/static/home/02.png" mode="aspectFit"></image>\n			 			<text class="team-btn-title">买家</text>\n			 		</view> '),
            vue.createElementVNode("view", { class: "team-btn orange" }, [
              vue.createElementVNode("image", {
                class: "buy-icon",
                src: _imports_4,
                mode: "aspectFit"
              }),
              vue.createElementVNode("text", { class: "team-btn-title" }, "卖家")
            ]),
            vue.createElementVNode("view", { class: "team-btn yellow" }, [
              vue.createElementVNode("image", {
                class: "buy-icon",
                src: _imports_5,
                mode: "aspectFit"
              }),
              vue.createElementVNode("text", { class: "team-btn-title" }, "买家")
            ]),
            vue.createElementVNode("view", { class: "team-btn" }, [
              vue.createElementVNode("image", {
                class: "buy-icon primary",
                src: _imports_6,
                mode: "aspectFit"
              }),
              vue.createElementVNode("text", { class: "team-btn-title" }, "角色")
            ]),
            vue.createCommentVNode(' <view class="team-btn">\n			 			<image class="avatar" src="/static/avatar.png" mode="aspectFill" />\n			 			<text class="profile-name">100.0 红眼</text>\n			 		</view> ')
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "app" }, [
        vue.createElementVNode("view", { class: "gz" })
      ]),
      vue.createCommentVNode(' <tn-button @click="show = true">打开弹窗</tn-button> '),
      vue.createCommentVNode(" 主体左右结构 "),
      vue.createElementVNode("view", { class: "main-layout" }, [
        vue.createCommentVNode(" 左侧侧边栏（结合优化） "),
        vue.createElementVNode("view", { class: "left-sidebar" }, [
          vue.createElementVNode("view", { class: "left-layout" }, [
            vue.createElementVNode("view", { class: "rule-btn" }, "游戏分类"),
            vue.createCommentVNode(' <view class="create-join-btn" @click="teamShow = true">\n						<image class="fighting-icon" src="/static/01.png" mode="aspectFill" />\n						<text>创建/加入</text>\n					</view> '),
            vue.createElementVNode("view", { class: "left-category" }, [
              vue.createCommentVNode(" 可滚动副本分类 "),
              vue.createElementVNode("scroll-view", {
                "scroll-y": "",
                class: "left-scroll"
              }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($setup.leftMenu, (item) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      key: item,
                      class: vue.normalizeClass(["nav-item", item === $setup.currentMenu ? "active" : ""]),
                      onClick: ($event) => $setup.currentMenu = item
                    }, null, 10, ["onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])
            ]),
            vue.createElementVNode("view", { class: "rule-btn" }),
            vue.createCommentVNode(' <view class="side-btn orange shadow">\n						<image class="buy-icon" src="/static/06.png" mode="aspectFit"></image>\n						<text>卖家</text>\n					</view>\n					<view class="side-btn yellow shadow">\n						<image class="buy-icon" src="/static/05.png" mode="aspectFit"></image>\n						<text>买家</text>\n					</view>\n\n					<view class="profile-box">\n						<image class="avatar" src="/static/avatar.png" mode="aspectFill" />\n						<text class="profile-name">100.0 红眼</text>\n					</view> ')
          ]),
          vue.createElementVNode("view", { class: "banner-box" }, [
            vue.createElementVNode("image", {
              class: "banner",
              src: _imports_7,
              mode: "aspectFill"
            })
          ]),
          vue.createElementVNode("view", { class: "kefu-btn" }, [
            vue.createElementVNode("image", {
              class: "kefu-img",
              src: _imports_8,
              mode: "aspectFill"
            }),
            vue.createElementVNode("view", { class: "kefu-tag" }, "客服")
          ])
        ]),
        vue.createCommentVNode(" 右侧列表内容（示例） "),
        vue.createElementVNode("view", { class: "right-content" }, [
          vue.createElementVNode("view", { class: "right-tabs-wrapper" }, [
            vue.createElementVNode("view", { class: "right-tabs" }, [
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["right-tab", { active: $setup.activeTab === "包车" }]),
                  onClick: _cache[2] || (_cache[2] = ($event) => $setup.activeTab = "包车")
                },
                [
                  vue.createElementVNode("image", {
                    class: "right-tab-icon",
                    src: _imports_9,
                    mode: "aspectFit"
                  }),
                  vue.createElementVNode("text", { class: "right-tab-text" }, "包车"),
                  $setup.activeTab === "包车" ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "right-tab-underline"
                  })) : vue.createCommentVNode("v-if", true)
                ],
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["right-tab", { active: $setup.activeTab === "泰拉车" }]),
                  onClick: _cache[3] || (_cache[3] = ($event) => $setup.activeTab = "泰拉车")
                },
                [
                  vue.createElementVNode("image", {
                    class: "right-tab-icon",
                    src: _imports_9,
                    mode: "aspectFit"
                  }),
                  vue.createElementVNode("text", { class: "right-tab-text" }, "泰拉车"),
                  $setup.activeTab === "泰拉车" ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "right-tab-underline"
                  })) : vue.createCommentVNode("v-if", true)
                ],
                2
                /* CLASS */
              )
            ])
          ]),
          vue.createElementVNode("view", { class: "card-layout" }, [
            vue.createElementVNode("scroll-view", {
              "scroll-y": "",
              style: { "height": "100vh" }
            }, [
              (vue.openBlock(), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList(30, (item) => {
                  return vue.createElementVNode("view", {
                    class: "card",
                    key: item,
                    onClick: _cache[4] || (_cache[4] = ($event) => $setup.linkTo())
                  }, [
                    item == 3 ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 0,
                      class: "card-tag"
                    }, [
                      item == 3 ? (vue.openBlock(), vue.createElementBlock("text", { key: 0 }, "等待中")) : vue.createCommentVNode("v-if", true)
                    ])) : vue.createCommentVNode("v-if", true),
                    vue.createElementVNode("view", { class: "card-content" }, [
                      vue.createElementVNode("view", { class: "card-avatar" }, [
                        vue.createElementVNode("image", {
                          class: "user-avatar",
                          src: _imports_9
                        })
                      ]),
                      vue.createElementVNode("view", { class: "card-info" }, [
                        vue.createElementVNode("view", { class: "card-top" }, [
                          vue.createElementVNode("view", { class: "nickname" }, "3.9 红眼")
                        ]),
                        vue.createElementVNode("view", { class: "card-time" }, [
                          vue.createElementVNode("image", {
                            class: "time-img",
                            src: _imports_10,
                            mode: "aspectFill"
                          }),
                          vue.createTextVNode(" 2分钟前 ")
                        ])
                      ]),
                      item != 3 ? (vue.openBlock(), vue.createElementBlock("view", {
                        key: 0,
                        class: "card-status"
                      }, [
                        vue.createElementVNode("image", {
                          class: "success-img",
                          src: _imports_11,
                          mode: "aspectFill"
                        })
                      ])) : vue.createCommentVNode("v-if", true)
                    ]),
                    vue.createElementVNode("view", { class: "card-bottom" }, [
                      vue.createCommentVNode(' <view class="card-bottom-tag">\n								比例5000\n							</view> '),
                      vue.createElementVNode("view", { class: "card-icons" }, [
                        vue.createElementVNode("image", {
                          class: "tag-img",
                          src: _imports_12,
                          mode: "aspectFill"
                        }),
                        vue.createElementVNode("image", {
                          class: "tag-img",
                          src: _imports_13,
                          mode: "aspectFill"
                        }),
                        item == 3 ? (vue.openBlock(), vue.createElementBlock("image", {
                          key: 0,
                          class: "tag-img",
                          src: _imports_14,
                          mode: "aspectFill"
                        })) : vue.createCommentVNode("v-if", true)
                      ])
                    ])
                  ]);
                }),
                64
                /* STABLE_FRAGMENT */
              ))
            ])
          ])
        ])
      ])
    ]);
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__scopeId", "data-v-1cf27b2a"], ["__file", "/Users/zhizhi/Documents/HBuilderProjects/dnf/pages/index/index.vue"]]);
  const _sfc_main$3 = {
    data() {
      return {};
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view");
  }
  const PagesUserUser = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__file", "/Users/zhizhi/Documents/HBuilderProjects/dnf/pages/user/user.vue"]]);
  const _sfc_main$2 = {
    data() {
      return {};
    },
    methods: {}
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view");
  }
  const PagesRedRed = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__file", "/Users/zhizhi/Documents/HBuilderProjects/dnf/pages/red/red.vue"]]);
  const _imports_0 = "/static/banner.jpg";
  const _sfc_main$1 = {
    __name: "room",
    setup(__props, { expose: __expose }) {
      __expose();
      vue.onMounted(() => uni.stopPullDownRefresh());
      const players = vue.ref([
        { id: 1, name: "剑豪", value: "4.1", avatar: "/static/p1.png", subtitle: "晚安女王殿下", role: "puncher", roleLabel: "打手" },
        { id: 2, name: "暗帝", value: "3.1", avatar: "/static/p2.png", subtitle: "打黑工小暗妹", role: "charter", roleLabel: "包车" },
        { id: 3, name: "红眼", value: "2.6", avatar: "/static/p3.png", subtitle: "第二天发烧", role: "mix", roleLabel: "混子" },
        { id: 4, name: "瞳子", value: "2.8", avatar: "/static/p4.png", subtitle: "贝奇趣兔哔", role: "mix", roleLabel: "混子" },
        { id: 5, name: "龙女", value: "2.8", avatar: "/static/p5.png", subtitle: "稚于最初丶焱", role: "mix", roleLabel: "混子" },
        { id: 6, name: "武神", value: "3.5", avatar: "/static/p6.png", subtitle: "它爱我o", role: "mix", roleLabel: "混子" }
      ]);
      const messages = vue.ref([
        { id: 1, self: false, name: "弃坑失败丶", avatar: "/static/p4.png", text: "1" },
        { id: 2, self: false, name: "老王阿韬气功", avatar: "/static/p5.png", text: "1" },
        { id: 3, self: false, name: "老王阿韬气功", avatar: "/static/p5.png", text: "人在吗房主" },
        { id: 4, self: false, name: "老王阿韬气功", avatar: "/static/p5.png", text: "房间" },
        { id: 5, self: false, name: "晚安女王殿下", avatar: "/static/p1.png", text: "在" },
        { id: 6, self: true, name: "晚安女王殿下", avatar: "/static/p1.png", text: "老板在吗" },
        { id: 7, self: true, name: "3区中鸟2号", avatar: "/static/p2.png", text: "老板在不在" },
        { id: 8, self: false, name: "贝奇趣兔哔", avatar: "/static/p4.png", text: "还有人吗" },
        { id: 9, self: false, name: "稚于最初丶焱", avatar: "/static/p5.png", text: "大佬在吗" },
        { id: 10, self: false, name: "它爱我o", avatar: "/static/p6.png", text: "?" }
      ]);
      const inputText = vue.ref("");
      function goBack() {
        uni.navigateBack();
      }
      function sendMessage() {
        if (!inputText.value.trim())
          return;
        messages.value.push({
          id: Date.now(),
          self: true,
          name: "我",
          avatar: "/static/me.png",
          text: inputText.value
        });
        inputText.value = "";
        uni.nextTick(() => {
          uni.pageScrollTo({ scrollTop: 99999, duration: 0 });
        });
      }
      const __returned__ = { players, messages, inputText, goBack, sendMessage, ref: vue.ref, onMounted: vue.onMounted, TnAvatar };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "room-container" }, [
      vue.createCommentVNode(" 1. 顶部区域：Banner + 玩家卡片 "),
      vue.createElementVNode("view", { class: "room-header" }, [
        vue.createCommentVNode(" Banner "),
        vue.createElementVNode("view", { class: "banner-wrap" }, [
          vue.createElementVNode("image", {
            src: _imports_0,
            mode: "aspectFill",
            class: "banner-img"
          }),
          vue.createElementVNode("view", { class: "banner-overlay" }, [
            vue.createElementVNode("view", {
              class: "back",
              onClick: $setup.goBack
            }, "←"),
            vue.createElementVNode("view", { class: "zone" }, "微信区 · 包车 155"),
            vue.createElementVNode("view", { class: "waiting" }, "等候中 01:47:16")
          ])
        ]),
        vue.createCommentVNode(" 玩家列表 "),
        vue.createElementVNode("view", { class: "player-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($setup.players, (p) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: p.id,
                class: "player-card"
              }, [
                vue.createVNode($setup["TnAvatar"], {
                  src: p.avatar,
                  size: "64rpx"
                }, null, 8, ["src"]),
                vue.createElementVNode("view", { class: "info" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "value" },
                    vue.toDisplayString(p.value) + " " + vue.toDisplayString(p.name),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "subtitle" },
                    vue.toDisplayString(p.subtitle),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["tag", p.role])
                  },
                  vue.toDisplayString(p.roleLabel),
                  3
                  /* TEXT, CLASS */
                )
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ]),
      vue.createCommentVNode(" 2. 聊天区：flex:1，内部 scroll-view 滚动 "),
      vue.createElementVNode("scroll-view", {
        class: "chat-list",
        "scroll-y": "",
        "scroll-with-animation": true
      }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($setup.messages, (m) => {
            return vue.openBlock(), vue.createElementBlock(
              "view",
              {
                key: m.id,
                class: vue.normalizeClass(["chat-item", { self: m.self }])
              },
              [
                vue.createVNode($setup["TnAvatar"], {
                  src: m.avatar,
                  size: "40rpx",
                  class: "chat-avatar"
                }, null, 8, ["src"]),
                vue.createElementVNode("view", { class: "chat-bubble" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "chat-name" },
                    vue.toDisplayString(m.name) + "：",
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    null,
                    vue.toDisplayString(m.text),
                    1
                    /* TEXT */
                  )
                ])
              ],
              2
              /* CLASS */
            );
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ]),
      vue.createCommentVNode(" 3. 底部固定输入区 "),
      vue.createElementVNode("view", { class: "chat-input-wrap" }, [
        vue.withDirectives(vue.createElementVNode(
          "input",
          {
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.inputText = $event),
            class: "chat-input",
            placeholder: "该房间最新消息，2小时前",
            onConfirm: $setup.sendMessage
          },
          null,
          544
          /* NEED_HYDRATION, NEED_PATCH */
        ), [
          [vue.vModelText, $setup.inputText]
        ]),
        vue.createElementVNode("view", { class: "btn-emoji" }, "😊"),
        vue.createElementVNode("view", {
          class: "btn-send",
          onClick: $setup.sendMessage
        }, "发送")
      ])
    ]);
  }
  const PagesRoomRoom = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__scopeId", "data-v-49055c66"], ["__file", "/Users/zhizhi/Documents/HBuilderProjects/dnf/pages/room/room.vue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/user/user", PagesUserUser);
  __definePage("pages/red/red", PagesRedRed);
  __definePage("pages/room/room", PagesRoomRoom);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:4", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:7", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:10", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "/Users/zhizhi/Documents/HBuilderProjects/dnf/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue, uni.VueShared);
