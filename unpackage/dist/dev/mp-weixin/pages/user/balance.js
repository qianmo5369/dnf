"use strict";
const common_vendor = require("../../common/vendor.js");
const uni_modules_zPaging_components_zPaging_js_hooks_useZPaging = require("../../uni_modules/z-paging/components/z-paging/js/hooks/useZPaging.js");
if (!Array) {
  const _easycom_z_paging2 = common_vendor.resolveComponent("z-paging");
  _easycom_z_paging2();
}
const _easycom_z_paging = () => "../../uni_modules/z-paging/components/z-paging/z-paging.js";
if (!Math) {
  (TnIcon + TnPopup + _easycom_z_paging)();
}
const TnIcon = () => "../../uni_modules/tuniaoui-vue3/components/icon/src/icon.js";
const TnPopup = () => "../../uni_modules/tuniaoui-vue3/components/popup/src/popup.js";
const _sfc_main = {
  __name: "balance",
  setup(__props) {
    const paging = common_vendor.ref(null);
    uni_modules_zPaging_components_zPaging_js_hooks_useZPaging.useZPaging(paging);
    const balance = common_vendor.ref(null);
    const amount = common_vendor.ref(null);
    const rechargeShow = common_vendor.ref(false);
    const fundList = common_vendor.ref([]);
    const getFundLogs = async (pageNo, pageSize) => {
      const res = await common_vendor.index.$http.post("/dungeon/fundLogs", {
        page: pageNo,
        page_size: pageSize
      });
      if (res.code === 1) {
        balance.value = res.data.balance;
        paging.value.complete(res.data.list);
      } else {
        paging.value.complete(false);
      }
    };
    const goWithdraw = () => {
      common_vendor.index.showToast({
        title: "暂无提现接口",
        icon: "none"
      });
    };
    const doRecharge = async () => {
      if (amount.value <= 0) {
        common_vendor.index.showToast({
          title: "请输入充值金额",
          icon: "none"
        });
        return false;
      }
      const res = await common_vendor.index.$http.post("/dungeon/recharge", {
        amount: amount.value
      });
      if (res.code === 1) {
        common_vendor.index.requestPayment({
          appId: res.data.result.appId,
          timeStamp: res.data.result.timeStamp,
          nonceStr: res.data.result.nonceStr,
          package: res.data.result.package,
          signType: res.data.result.signType,
          paySign: res.data.result.paySign,
          success: (res2) => {
            common_vendor.index.showToast({
              title: "已完成支付",
              icon: "none"
            });
            paging.value.reload();
            rechargeShow.value = false;
          },
          fail: (err) => {
            common_vendor.index.__f__("log", "at pages/user/balance.vue:157", err);
            common_vendor.index.showToast({
              title: "未付款",
              icon: "none"
            });
          }
        });
      } else {
        common_vendor.index.showToast({
          title: res.msg || "请求支付错误",
          icon: "none"
        });
      }
    };
    const onCharge = () => {
      rechargeShow.value = true;
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          name: "close"
        }),
        b: common_vendor.o(($event) => {
          rechargeShow.value = false;
          amount.value = null;
        }),
        c: amount.value,
        d: common_vendor.o(($event) => amount.value = $event.detail.value),
        e: common_vendor.o(($event) => doRecharge()),
        f: common_vendor.p({
          ["model-value"]: rechargeShow.value,
          width: "80%",
          height: "400rpx",
          borderRadius: "16rpx"
        }),
        g: common_vendor.t(balance.value),
        h: common_vendor.o(goWithdraw),
        i: common_vendor.o(onCharge),
        j: common_vendor.f(fundList.value, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.remark),
            b: item.tip
          }, item.tip ? {} : {}, {
            c: common_vendor.t(item.balance),
            d: common_vendor.t(item.direction == "in" ? "+" : ""),
            e: common_vendor.t(item.amount),
            f: common_vendor.n(item.direction == "in" ? "positive" : "negative"),
            g: item.id
          });
        }),
        k: common_vendor.sr(paging, "b52f060d-2", {
          "k": "paging"
        }),
        l: common_vendor.o(getFundLogs),
        m: common_vendor.o(($event) => fundList.value = $event),
        n: common_vendor.p({
          modelValue: fundList.value
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b52f060d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/balance.js.map
