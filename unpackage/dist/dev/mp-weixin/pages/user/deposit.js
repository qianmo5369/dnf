"use strict";
const common_vendor = require("../../common/vendor.js");
const uni_modules_zPaging_components_zPaging_js_hooks_useZPaging = require("../../uni_modules/z-paging/components/z-paging/js/hooks/useZPaging.js");
const stores_system = require("../../stores/system.js");
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
  __name: "deposit",
  setup(__props) {
    const paging = common_vendor.ref(null);
    uni_modules_zPaging_components_zPaging_js_hooks_useZPaging.useZPaging(paging);
    const sum_coin = common_vendor.ref(null);
    const amount = common_vendor.ref(null);
    const coin = common_vendor.ref(null);
    const is_coin = common_vendor.ref(null);
    const deposit_coin = common_vendor.ref(null);
    common_vendor.ref({});
    const depositShow = common_vendor.ref(false);
    stores_system.useSystemStore();
    const tabs = [
      { label: "流水记录", value: "coin_log" },
      { label: "提现记录", value: "deposit_log" }
    ];
    const activeTab = common_vendor.ref("coin_log");
    const coinList = common_vendor.ref([]);
    const handleTab = (value) => {
      activeTab.value = value;
      paging.value.reload();
    };
    const getCoinLogs = async (pageNo, pageSize) => {
      const res = await common_vendor.index.$http.post("/dungeon/coinLogs", {
        page: pageNo,
        page_size: pageSize,
        type: activeTab.value
      });
      if (res.code === 1) {
        coin.value = res.data.coin;
        is_coin.value = res.data.is_coin;
        sum_coin.value = res.data.sum_coin;
        deposit_coin.value = res.data.deposit_coin;
        unitPrice.value = res.data.unitPrice;
        feeRate.value = res.data.feeRate;
        paging.value.complete(res.data.list);
      } else {
        paging.value.complete(false);
      }
    };
    const unitPrice = common_vendor.ref(5);
    const feeRate = common_vendor.ref(0.1);
    const actualAmount = common_vendor.computed(() => {
      const n = parseFloat(amount.value);
      const price = parseFloat(unitPrice.value);
      if (!n || n <= 0 || !price || price <= 0)
        return 0;
      return (n * price * (1 - feeRate.value)).toFixed(2);
    });
    const doDeposit = async () => {
      if (amount.value <= 0) {
        common_vendor.index.showToast({
          title: "请输入提现数量",
          icon: "none"
        });
        return false;
      }
      const res = await common_vendor.index.$http.post("/dungeon/applyWithdraw", {
        amount: amount.value
      });
      if (res.code === 1) {
        depositShow.value = false;
        paging.value.reload();
      } else {
        common_vendor.index.showToast({
          title: res.msg,
          icon: "none"
        });
      }
    };
    const cancelWithdraw = async (id) => {
      const res = await common_vendor.index.$http.post("/dungeon/cancelWithdraw", {
        id
      });
      if (res.code === 1) {
        common_vendor.index.showToast({
          title: res.msg,
          icon: "none"
        });
        paging.value.reload();
      } else {
        common_vendor.index.showToast({
          title: res.msg,
          icon: "none"
        });
      }
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          name: "close"
        }),
        b: common_vendor.o(($event) => {
          depositShow.value = false;
          amount.value = null;
        }),
        c: amount.value,
        d: common_vendor.o(($event) => amount.value = $event.detail.value),
        e: common_vendor.t(unitPrice.value),
        f: common_vendor.t(actualAmount.value),
        g: common_vendor.t(feeRate.value * 100),
        h: common_vendor.o(($event) => doDeposit()),
        i: common_vendor.p({
          ["model-value"]: depositShow.value,
          width: "80%",
          height: "500rpx",
          borderRadius: "16rpx"
        }),
        j: common_vendor.t(sum_coin.value),
        k: common_vendor.o(($event) => depositShow.value = true),
        l: common_vendor.t(is_coin.value),
        m: common_vendor.t(deposit_coin.value),
        n: common_vendor.t(coin.value),
        o: common_vendor.f(tabs, (tab, k0, i0) => {
          return {
            a: common_vendor.t(tab.label),
            b: tab.value,
            c: activeTab.value === tab.value ? 1 : "",
            d: common_vendor.o(($event) => handleTab(tab.value), tab.value)
          };
        }),
        p: common_vendor.f(coinList.value, (item, index, i0) => {
          return common_vendor.e(activeTab.value == "coin_log" ? {
            a: common_vendor.t(item.remark),
            b: common_vendor.t(item.created_text),
            c: common_vendor.t(item.type == "in" ? "+" : "-"),
            d: common_vendor.t(item.amount),
            e: common_vendor.n(item.type == "in" ? "positive" : "negative")
          } : common_vendor.e({
            f: common_vendor.t(item.amount),
            g: common_vendor.t(item.expect_amount),
            h: common_vendor.t(item.created_text),
            i: item.status == "pending"
          }, item.status == "pending" ? {} : {}, {
            j: item.status == "approved"
          }, item.status == "approved" ? {} : {}, {
            k: item.status == "rejected"
          }, item.status == "rejected" ? {} : {}, {
            l: item.status == "cancelled"
          }, item.status == "cancelled" ? {} : {}, {
            m: item.status == "rejected"
          }, item.status == "rejected" ? {
            n: common_vendor.t(item.remark)
          } : {}, {
            o: item.status == "pending"
          }, item.status == "pending" ? {
            p: common_vendor.o(($event) => cancelWithdraw(item.id), index)
          } : {}), {
            q: index
          });
        }),
        q: activeTab.value == "coin_log",
        r: common_vendor.sr(paging, "bd3e538d-2", {
          "k": "paging"
        }),
        s: common_vendor.o(getCoinLogs),
        t: common_vendor.o(($event) => coinList.value = $event),
        v: common_vendor.p({
          fixed: false,
          modelValue: coinList.value
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-bd3e538d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/deposit.js.map
