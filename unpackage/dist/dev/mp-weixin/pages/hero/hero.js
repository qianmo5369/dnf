"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
if (!Math) {
  (TnAvatar + fuiSafeArea)();
}
const TnAvatar = () => "../../uni_modules/tuniaoui-vue3/components/avatar/src/avatar.js";
const fuiSafeArea = () => "../../components/fui-safe-area.js";
const _sfc_main = {
  __name: "hero",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const linkTo = (path) => {
      common_vendor.index.navigateTo({
        url: path
      });
    };
    const userHeroList = common_vendor.ref([]);
    const activeRoleId = common_vendor.ref(null);
    common_vendor.ref(true);
    common_vendor.ref(false);
    const selectRole = (item) => {
      linkTo(`/pages/hero/edit?id=${item.id}`);
    };
    const getUserHeroList = async () => {
      const res = await common_vendor.index.$http.get("/dungeon/getUserHeroList");
      if (res.code === 1) {
        userHeroList.value = res.data;
      } else {
        common_vendor.index.showToast({
          title: res.msg,
          icon: "none"
        });
      }
    };
    common_vendor.onMounted(() => {
      var _a;
      getUserHeroList();
      if ((_a = userStore.userInfo) == null ? void 0 : _a.default_user_hero_id) {
        activeRoleId.value = userStore.userInfo.default_user_hero_id;
      }
    });
    common_vendor.onShow(() => {
      getUserHeroList();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(userHeroList.value, (role, index, i0) => {
          return {
            a: "fea3dba7-0-" + i0,
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
        b: common_vendor.o(($event) => linkTo("/pages/hero/edit"))
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-fea3dba7"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/hero/hero.js.map
