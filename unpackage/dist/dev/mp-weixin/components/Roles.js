"use strict";
const common_vendor = require("../common/vendor.js");
const stores_user = require("../stores/user.js");
if (!Math) {
  (TnIcon + TnAvatar)();
}
const TnIcon = () => "../uni_modules/tuniaoui-vue3/components/icon/src/icon.js";
const TnAvatar = () => "../uni_modules/tuniaoui-vue3/components/avatar/src/avatar.js";
const _sfc_main = {
  __name: "Roles",
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const userStore = stores_user.useUserStore();
    common_vendor.ref(true);
    const emit = __emit;
    function onClose() {
      emit("update:modelValue", false);
    }
    const userHeroList = common_vendor.ref([]);
    const activeRoleId = common_vendor.ref(1);
    const selectRole = async (role) => {
      activeRoleId.value = role.id;
      const res = await common_vendor.index.$http.post("/dungeon/setDefaultUserHero", {
        hero_id: role.id
      });
      if (res.code === 1) {
        const userStore2 = stores_user.useUserStore();
        await userStore2.fetchUserInfo();
        onClose();
      } else {
        common_vendor.index.showToast({
          title: res.msg,
          icon: "none"
        });
      }
    };
    const linkTo = (path) => {
      common_vendor.index.navigateTo({
        url: path
      });
    };
    const getUserHeroList = async () => {
      var _a;
      const res = await common_vendor.index.$http.get("/dungeon/getUserHeroList");
      if (res.code === 1) {
        userHeroList.value = res.data;
        if ((_a = userStore.userInfo) == null ? void 0 : _a.default_user_hero_id) {
          activeRoleId.value = userStore.userInfo.default_user_hero_id;
        }
      } else {
        common_vendor.index.showToast({
          title: res.msg,
          icon: "none"
        });
      }
    };
    common_vendor.onMounted(() => {
      getUserHeroList();
    });
    common_vendor.onShow(() => {
      getUserHeroList();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          name: "close"
        }),
        b: common_vendor.o(onClose),
        c: common_vendor.f(userHeroList.value, (role, index, i0) => {
          return {
            a: "28c75cb3-1-" + i0,
            b: common_vendor.p({
              url: role.hero_avatar,
              size: "80rpx"
            }),
            c: common_vendor.t(role.resist_power),
            d: common_vendor.t(role.hero_name),
            e: common_vendor.t(role.nickname),
            f: index,
            g: activeRoleId.value === role.id ? 1 : "",
            h: common_vendor.o(($event) => selectRole(role), index)
          };
        }),
        d: common_vendor.o(($event) => linkTo("/pages/hero/hero")),
        e: common_vendor.o(($event) => linkTo("/pages/hero/edit"))
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-28c75cb3"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/Roles.js.map
