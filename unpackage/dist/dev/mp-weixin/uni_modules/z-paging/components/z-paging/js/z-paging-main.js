"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const uni_modules_zPaging_components_zPaging_js_zPagingStatic = require("./z-paging-static.js");
const uni_modules_zPaging_components_zPaging_js_zPagingConstant = require("./z-paging-constant.js");
const uni_modules_zPaging_components_zPaging_js_zPagingUtils = require("./z-paging-utils.js");
const uni_modules_zPaging_components_zPaging_js_modules_commonLayout = require("./modules/common-layout.js");
const uni_modules_zPaging_components_zPaging_js_modules_dataHandle = require("./modules/data-handle.js");
const uni_modules_zPaging_components_zPaging_js_modules_i18n = require("./modules/i18n.js");
const uni_modules_zPaging_components_zPaging_js_modules_nvue = require("./modules/nvue.js");
const uni_modules_zPaging_components_zPaging_js_modules_empty = require("./modules/empty.js");
const uni_modules_zPaging_components_zPaging_js_modules_refresher = require("./modules/refresher.js");
const uni_modules_zPaging_components_zPaging_js_modules_loadMore = require("./modules/load-more.js");
const uni_modules_zPaging_components_zPaging_js_modules_loading = require("./modules/loading.js");
const uni_modules_zPaging_components_zPaging_js_modules_chatRecordMode = require("./modules/chat-record-mode.js");
const uni_modules_zPaging_components_zPaging_js_modules_scroller = require("./modules/scroller.js");
const uni_modules_zPaging_components_zPaging_js_modules_backToTop = require("./modules/back-to-top.js");
const uni_modules_zPaging_components_zPaging_js_modules_virtualList = require("./modules/virtual-list.js");
const uni_modules_zPaging_components_zPaging_js_zPagingEnum = require("./z-paging-enum.js");
const zPagingRefresh = () => "../components/z-paging-refresh.js";
const zPagingLoadMore = () => "../components/z-paging-load-more.js";
const zPagingEmptyView = () => "../../z-paging-empty-view/z-paging-empty-view.js";
const systemInfo = uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.getSystemInfoSync();
const _sfc_main = {
  name: "z-paging",
  components: {
    zPagingRefresh,
    zPagingLoadMore,
    zPagingEmptyView
  },
  mixins: [
    uni_modules_zPaging_components_zPaging_js_modules_commonLayout.commonLayoutModule,
    uni_modules_zPaging_components_zPaging_js_modules_dataHandle.dataHandleModule,
    uni_modules_zPaging_components_zPaging_js_modules_i18n.i18nModule,
    uni_modules_zPaging_components_zPaging_js_modules_nvue.nvueModule,
    uni_modules_zPaging_components_zPaging_js_modules_empty.emptyModule,
    uni_modules_zPaging_components_zPaging_js_modules_refresher.refresherModule,
    uni_modules_zPaging_components_zPaging_js_modules_loadMore.loadMoreModule,
    uni_modules_zPaging_components_zPaging_js_modules_loading.loadingModule,
    uni_modules_zPaging_components_zPaging_js_modules_chatRecordMode.chatRecordModerModule,
    uni_modules_zPaging_components_zPaging_js_modules_scroller.scrollerModule,
    uni_modules_zPaging_components_zPaging_js_modules_backToTop.backToTopModule,
    uni_modules_zPaging_components_zPaging_js_modules_virtualList.virtualListModule
  ],
  data() {
    return {
      // --------------静态资源---------------
      base64BackToTop: uni_modules_zPaging_components_zPaging_js_zPagingStatic.zStatic.base64BackToTop,
      // -------------全局数据相关--------------
      // 当前加载类型
      loadingType: uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.LoadingType.Refresher,
      requestTimeStamp: 0,
      wxsPropType: "",
      renderPropScrollTop: -1,
      checkScrolledToBottomTimeOut: null,
      cacheTopHeight: -1,
      statusBarHeight: systemInfo.statusBarHeight,
      // --------------状态&判断---------------
      insideOfPaging: -1,
      isLoadFailed: false,
      isIos: systemInfo.platform === "ios",
      disabledBounce: false,
      fromCompleteEmit: false,
      disabledCompleteEmit: false,
      pageLaunched: false,
      active: false,
      // ---------------wxs相关---------------
      wxsIsScrollTopInTopRange: true,
      wxsScrollTop: 0,
      wxsPageScrollTop: 0,
      wxsOnPullingDown: false
    };
  },
  props: {
    // 调用complete后延迟处理的时间，单位为毫秒，默认0毫秒，优先级高于minDelay
    delay: {
      type: [Number, String],
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("delay", 0)
    },
    // 触发@query后最小延迟处理的时间，单位为毫秒，默认0毫秒，优先级低于delay（假设设置为300毫秒，若分页请求时间小于300毫秒，则在调用complete后延迟[300毫秒-请求时长]；若请求时长大于300毫秒，则不延迟），当show-refresher-when-reload为true或reload(true)时，其最小值为400
    minDelay: {
      type: [Number, String],
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("minDelay", 0)
    },
    // 设置z-paging的style，部分平台(如微信小程序)无法直接修改组件的style，可使用此属性代替
    pagingStyle: {
      type: Object,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("pagingStyle", {})
    },
    // z-paging的高度，优先级低于pagingStyle中设置的height；传字符串，如100px、100rpx、100%
    height: {
      type: String,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("height", "")
    },
    // z-paging的宽度，优先级低于pagingStyle中设置的width；传字符串，如100px、100rpx、100%
    width: {
      type: String,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("width", "")
    },
    // z-paging的最大宽度，优先级低于pagingStyle中设置的max-width；传字符串，如100px、100rpx、100%。默认为空，也就是铺满窗口宽度，若设置了特定值则会自动添加margin: 0 auto
    maxWidth: {
      type: String,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("maxWidth", "")
    },
    // z-paging的背景色，优先级低于pagingStyle中设置的background。传字符串，如"#ffffff"
    bgColor: {
      type: String,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("bgColor", "")
    },
    // 设置z-paging的容器(插槽的父view)的style
    pagingContentStyle: {
      type: Object,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("pagingContentStyle", {})
    },
    // z-paging是否自动高度，若自动高度则会自动铺满屏幕
    autoHeight: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("autoHeight", false)
    },
    // z-paging是否自动高度时，附加的高度，注意添加单位px或rpx，若需要减少高度，则传负数
    autoHeightAddition: {
      type: [Number, String],
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("autoHeightAddition", "0px")
    },
    // loading(下拉刷新、上拉加载更多)的主题样式，支持black，white，默认black
    defaultThemeStyle: {
      type: String,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("defaultThemeStyle", "black")
    },
    // z-paging是否使用fixed布局，若使用fixed布局，则z-paging的父view无需固定高度，z-paging高度默认为100%，默认为是(当使用内置scroll-view滚动时有效)
    fixed: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("fixed", true)
    },
    // 是否开启底部安全区域适配
    safeAreaInsetBottom: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("safeAreaInsetBottom", false)
    },
    // 开启底部安全区域适配后，是否使用placeholder形式实现，默认为否。为否时滚动区域会自动避开底部安全区域，也就是所有滚动内容都不会挡住底部安全区域，若设置为是，则滚动时滚动内容会挡住底部安全区域，但是当滚动到底部时才会避开底部安全区域
    useSafeAreaPlaceholder: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("useSafeAreaPlaceholder", false)
    },
    // z-paging bottom的背景色，默认透明，传字符串，如"#ffffff"
    bottomBgColor: {
      type: String,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("bottomBgColor", "")
    },
    // slot="top"的view的z-index，默认为99，仅使用页面滚动时有效
    topZIndex: {
      type: Number,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("topZIndex", 99)
    },
    // z-paging内容容器父view的z-index，默认为1
    superContentZIndex: {
      type: Number,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("superContentZIndex", 1)
    },
    // z-paging内容容器部分的z-index，默认为1
    contentZIndex: {
      type: Number,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("contentZIndex", 1)
    },
    // z-paging二楼的z-index，默认为100
    f2ZIndex: {
      type: Number,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("f2ZIndex", 100)
    },
    // 使用页面滚动时，是否在不满屏时自动填充满屏幕，默认为是
    autoFullHeight: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("autoFullHeight", true)
    },
    // 是否监听列表触摸方向改变，默认为否
    watchTouchDirectionChange: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("watchTouchDirectionChange", false)
    },
    // z-paging中布局的单位，默认为rpx
    unit: {
      type: String,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("unit", "rpx")
    }
  },
  created() {
    if (this.createdReload && !this.refresherOnly && this.auto) {
      this._startLoading();
      this.$nextTick(this._preReload);
    }
  },
  mounted() {
    this.active = true;
    this.wxsPropType = uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.getTime().toString();
    this.renderJsIgnore;
    if (!this.createdReload && !this.refresherOnly && this.auto) {
      uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.delay(() => this.$nextTick(this._preReload), 0);
    }
    this.finalUseCache && this._setListByLocalCache();
    let delay = 0;
    delay = uni_modules_zPaging_components_zPaging_js_zPagingConstant.c.delayTime;
    this.$nextTick(() => {
      this.systemInfo = uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.getSystemInfoSync();
      !this.usePageScroll && this.autoHeight && this._setAutoHeight();
      this.loaded = true;
      uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.delay(() => {
        this.updateFixedLayout();
        this._updateCachedSuperContentHeight();
      });
    });
    this.updatePageScrollTopHeight();
    this.updatePageScrollBottomHeight();
    this.updateLeftAndRightWidth();
    if (this.finalRefresherEnabled && this.useCustomRefresher) {
      this.$nextTick(() => {
        this.isTouchmoving = true;
      });
    }
    this._onEmit();
    this.finalUseVirtualList && this._virtualListInit();
    this.$nextTick(() => {
      setTimeout(() => {
        this._getCssSafeAreaInsetBottom(() => this.safeAreaInsetBottom && this.updatePageScrollBottomHeight());
      }, delay);
    });
  },
  destroyed() {
    this._handleUnmounted();
  },
  unmounted() {
    this._handleUnmounted();
  },
  watch: {
    defaultThemeStyle: {
      handler(newVal) {
        if (newVal.length) {
          this.finalRefresherDefaultStyle = newVal;
        }
      },
      immediate: true
    },
    autoHeight(newVal) {
      this.loaded && !this.usePageScroll && this._setAutoHeight(newVal);
    },
    autoHeightAddition(newVal) {
      this.loaded && !this.usePageScroll && this.autoHeight && this._setAutoHeight(newVal);
    }
  },
  computed: {
    // 当前z-paging的内置样式
    finalPagingStyle() {
      const pagingStyle = { ...this.pagingStyle };
      if (!this.systemInfo)
        return pagingStyle;
      const { windowTop, windowBottom } = this;
      if (!this.usePageScroll && this.fixed) {
        if (windowTop && !pagingStyle.top) {
          pagingStyle.top = windowTop + "px";
        }
        if (windowBottom && !pagingStyle.bottom) {
          pagingStyle.bottom = windowBottom + "px";
        }
      }
      if (this.bgColor.length && !pagingStyle["background"]) {
        pagingStyle["background"] = this.bgColor;
      }
      if (this.height.length && !pagingStyle["height"]) {
        pagingStyle["height"] = this.height;
      }
      if (this.width.length && !pagingStyle["width"]) {
        pagingStyle["width"] = this.width;
      }
      if (this.maxWidth.length && !pagingStyle["max-width"]) {
        pagingStyle["max-width"] = this.maxWidth;
        pagingStyle["margin"] = "0 auto";
      }
      return pagingStyle;
    },
    // 当前z-paging内容的样式
    finalPagingContentStyle() {
      if (this.contentZIndex != 1) {
        this.pagingContentStyle["z-index"] = this.contentZIndex;
        this.pagingContentStyle["position"] = "relative";
      }
      return this.pagingContentStyle;
    },
    renderJsIgnore() {
      if (this.usePageScroll && this.useChatRecordMode || !this.refresherEnabled && this.scrollable || !this.useCustomRefresher) {
        this.$nextTick(() => {
          this.renderPropScrollTop = 10;
        });
      }
      return 0;
    },
    windowHeight() {
      if (!this.systemInfo)
        return 0;
      return this.systemInfo.windowHeight || 0;
    },
    windowBottom() {
      if (!this.systemInfo)
        return 0;
      let windowBottom = this.systemInfo.windowBottom || 0;
      if (this.safeAreaInsetBottom && !this.useSafeAreaPlaceholder && !this.useChatRecordMode) {
        windowBottom += this.safeAreaBottom;
      }
      return windowBottom;
    },
    isIosAndH5() {
      return false;
    }
  },
  methods: {
    // 当前版本号
    getVersion() {
      return `z-paging v${uni_modules_zPaging_components_zPaging_js_zPagingConstant.c.version}`;
    },
    // 设置nvue List的specialEffects
    setSpecialEffects(args) {
      this.setListSpecialEffects(args);
    },
    // 与setSpecialEffects等效，兼容旧版本
    setListSpecialEffects(args) {
      this.nFixFreezing = args && Object.keys(args).length;
      if (this.isIos) {
        this.privateRefresherEnabled = 0;
      }
      !this.usePageScroll && this.$refs["zp-n-list"].setSpecialEffects(args);
    },
    // 使手机发生较短时间的振动（15ms）
    _doVibrateShort() {
      common_vendor.index.vibrateShort();
    },
    // 设置z-paging高度
    async _setAutoHeight(shouldFullHeight = true, scrollViewNode = null) {
      const heightKey = "min-height";
      try {
        if (shouldFullHeight) {
          let finalScrollViewNode = scrollViewNode || await this._getNodeClientRect(".zp-scroll-view");
          let finalScrollBottomNode = await this._getNodeClientRect(".zp-page-bottom");
          if (finalScrollViewNode) {
            const scrollViewTop = finalScrollViewNode[0].top;
            let scrollViewHeight = this.windowHeight - scrollViewTop;
            scrollViewHeight -= finalScrollBottomNode ? finalScrollBottomNode[0].height : 0;
            const additionHeight = uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.convertToPx(this.autoHeightAddition);
            let importantSuffix = " !important";
            const finalHeight = scrollViewHeight + additionHeight - (this.insideMore ? 1 : 0) + "px" + importantSuffix;
            this.$set(this.scrollViewStyle, heightKey, finalHeight);
            this.$set(this.scrollViewInStyle, heightKey, finalHeight);
          }
        } else {
          this.$delete(this.scrollViewStyle, heightKey);
          this.$delete(this.scrollViewInStyle, heightKey);
        }
      } catch (e) {
      }
    },
    // 组件销毁后续处理
    _handleUnmounted() {
      this.active = false;
      this._offEmit();
      this.useChatRecordMode && common_vendor.index.offKeyboardHeightChange(this._handleKeyboardHeightChange);
    },
    // 触发更新是否超出页面状态
    _updateInsideOfPaging() {
      this.insideMore && this.insideOfPaging === true && setTimeout(this.doLoadMore, 200);
    },
    // 清除timeout
    _cleanTimeout(timeout) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      return timeout;
    },
    // 添加全局emit监听
    _onEmit() {
      common_vendor.index.$on(uni_modules_zPaging_components_zPaging_js_zPagingConstant.c.errorUpdateKey, (errorMsg) => {
        if (this.loading) {
          if (!!errorMsg) {
            this.customerEmptyViewErrorText = errorMsg;
          }
          this.complete(false).catch(() => {
          });
        }
      });
      common_vendor.index.$on(uni_modules_zPaging_components_zPaging_js_zPagingConstant.c.completeUpdateKey, (data) => {
        setTimeout(() => {
          if (this.loading) {
            if (!this.disabledCompleteEmit) {
              const type = data.type || "normal";
              const list = data.list || data;
              const rule = data.rule;
              this.fromCompleteEmit = true;
              switch (type) {
                case "normal":
                  this.complete(list);
                  break;
                case "total":
                  this.completeByTotal(list, rule);
                  break;
                case "nomore":
                  this.completeByNoMore(list, rule);
                  break;
                case "key":
                  this.completeByKey(list, rule);
                  break;
              }
            } else {
              this.disabledCompleteEmit = false;
            }
          }
        }, 1);
      });
    },
    // 销毁全局emit和listener监听
    _offEmit() {
      common_vendor.index.$off(uni_modules_zPaging_components_zPaging_js_zPagingConstant.c.errorUpdateKey);
      common_vendor.index.$off(uni_modules_zPaging_components_zPaging_js_zPagingConstant.c.completeUpdateKey);
    }
  }
};
exports._sfc_main = _sfc_main;
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/uni_modules/z-paging/components/z-paging/js/z-paging-main.js.map
