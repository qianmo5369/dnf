"use strict";
const common_vendor = require("../common/vendor.js");
const stores_user = require("../stores/user.js");
if (!Math) {
  (Parse + TnPopup + TnIcon + TnAvatar)();
}
const TnIcon = () => "../uni_modules/tuniaoui-vue3/components/icon/src/icon.js";
const TnAvatar = () => "../uni_modules/tuniaoui-vue3/components/avatar/src/avatar.js";
const TnPopup = () => "../uni_modules/tuniaoui-vue3/components/popup/src/popup.js";
const Parse = () => "./parse.js";
const _sfc_main = {
  __name: "dungeonSelect",
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    modeMapTree: {
      type: Array,
      default: () => []
    },
    defaultDungeonCode: {
      type: String,
      default: "ozma_assault"
    },
    defaultMapCode: {
      type: String,
      default: "baoche"
    },
    defaultRoleCode: {
      type: String,
      default: "deck"
    }
  },
  emits: ["update:modelValue", "confirm-select", "confirm-share", "confirm-recharge"],
  setup(__props, { emit: __emit }) {
    common_vendor.ref(true);
    const contentId = common_vendor.ref(null);
    const contentShow = common_vendor.ref(false);
    const handleContent = (id) => {
      contentId.value = id;
      contentShow.value = true;
    };
    const sys = common_vendor.index.getSystemInfoSync();
    sys.windowHeight * 0.7 + "px";
    const userStore = stores_user.useUserStore();
    const props = __props;
    const emit = __emit;
    const handleSelectorClick = () => {
      common_vendor.index.__f__("log", "at components/dungeonSelect.vue:162", "通知父组件");
      emit("confirm-select");
    };
    const ozmaDungeon = common_vendor.computed(
      () => props.modeMapTree.find((d) => d.code === "ozma_assault") || {}
    );
    const selectedDungeon = common_vendor.ref(0);
    const selectedDungeonIndex = common_vendor.ref(0);
    const selectedMapIndex = common_vendor.ref(0);
    const selectedPosition = common_vendor.ref(null);
    const currentDungeon = common_vendor.computed(() => props.modeMapTree[selectedDungeonIndex.value] || {});
    const currentMap = common_vendor.computed(() => {
      var _a, _b;
      return ((_b = (_a = currentDungeon.value) == null ? void 0 : _a.maps) == null ? void 0 : _b[selectedMapIndex.value]) || {};
    });
    const currentRoles = common_vendor.computed(() => {
      var _a;
      return ((_a = currentMap.value) == null ? void 0 : _a.roles) || [];
    });
    common_vendor.computed(() => {
      var _a;
      return ((_a = currentDungeon.value) == null ? void 0 : _a.config_option) || {};
    });
    const selectedRole = common_vendor.computed(
      () => currentRoles.value.find((r) => r.id === selectedPosition.value) || {}
    );
    const modeMapCode = common_vendor.computed(() => {
      var _a;
      return ((_a = currentDungeon.value) == null ? void 0 : _a.code) || "";
    });
    common_vendor.ref(null);
    common_vendor.ref(null);
    common_vendor.ref(null);
    common_vendor.ref(null);
    common_vendor.ref(null);
    common_vendor.ref(null);
    common_vendor.ref(null);
    common_vendor.computed(() => {
      var _a;
      const mapCode = (_a = currentMap.value) == null ? void 0 : _a.code;
      const roleCode = selectedRole.value.code;
      if (mapCode === "terache" && roleCode === "seller")
        return false;
      return ["deck", "team"].includes(roleCode);
    });
    common_vendor.computed(() => {
      var _a;
      const roleCode = selectedRole.value.code;
      const mapCode = (_a = currentMap.value) == null ? void 0 : _a.code;
      const roles = currentRoles.value;
      if (mapCode === "terache") {
        return roles.filter((r) => ["team", "deck"].includes(r.code));
      }
      if (["deck", "team"].includes(roleCode)) {
        return roles.filter((r) => r.code === roleCode);
      }
      return [];
    });
    const roleInited = common_vendor.ref(false);
    common_vendor.watch(
      () => selectedRole.value.code,
      (code) => {
        var _a;
        if (roleInited.value)
          return;
        const mapCode = (_a = currentMap.value) == null ? void 0 : _a.code;
        if (mapCode === "terache") {
          const match = currentRoles.value.find((r) => ["deck", "team"].includes(r.code));
          if (match)
            selectedPosition.value = match.id;
          roleInited.value = true;
          return;
        }
        if (["deck", "team"].includes(code)) {
          const match = currentRoles.value.find((r) => r.code === code);
          if (match)
            selectedPosition.value = match.id;
        } else {
          selectedPosition.value = null;
        }
        roleInited.value = true;
      },
      {
        immediate: true
      }
    );
    common_vendor.computed(
      () => modeMapCode.value === "ozma_assault" && ["leader", "baoche"].includes(selectedRole.value.code)
    );
    common_vendor.computed(
      () => modeMapCode.value === "ozma_assault" && ["leader", "baoche"].includes(selectedRole.value.code)
    );
    common_vendor.computed(() => ["seller", "deck", "team"].includes(selectedRole.value.code));
    common_vendor.computed(
      () => modeMapCode.value === "ozma_assault" && selectedRole.value.code === "dps"
    );
    common_vendor.computed(
      () => ["seller", "deck", "team"].includes(selectedRole.value.code)
    );
    common_vendor.computed(() => ["seller"].includes(selectedRole.value.code));
    common_vendor.computed(
      () => modeMapCode.value === "ozma_descent" && selectedRole.value.code === "dps"
    );
    common_vendor.index.__f__("log", "at components/dungeonSelect.vue:285", currentMap.value.code);
    common_vendor.ref(false);
    const currentConfigOptions = common_vendor.ref([]);
    const selectedOptions = common_vendor.reactive({});
    const initSelection = () => {
      var _a, _b, _c, _d, _e;
      const val = props.modeMapTree;
      common_vendor.index.__f__("log", "at components/dungeonSelect.vue:310", "props.modeMapTree.length:", val.length);
      const dungeon = val.find((d) => d.code === props.defaultDungeonCode);
      if (!dungeon)
        return;
      common_vendor.index.__f__("log", "at components/dungeonSelect.vue:315", "dungeon.maps:", dungeon.maps);
      common_vendor.index.__f__("log", "at components/dungeonSelect.vue:316", "roles:", (_b = (_a = dungeon.maps) == null ? void 0 : _a[0]) == null ? void 0 : _b.roles);
      selectedDungeon.value = dungeon.id;
      selectedDungeonIndex.value = val.findIndex((d) => d.id === dungeon.id);
      const mapIndex = (_c = dungeon.maps) == null ? void 0 : _c.findIndex((m) => m.code === props.defaultMapCode);
      selectedMapIndex.value = mapIndex >= 0 ? mapIndex : 0;
      const map = (_d = dungeon.maps) == null ? void 0 : _d[selectedMapIndex.value];
      const role = (_e = map == null ? void 0 : map.roles) == null ? void 0 : _e.find((r) => r.code === props.defaultRoleCode);
      selectedPosition.value = (role == null ? void 0 : role.id) ?? null;
      common_vendor.index.__f__("log", "at components/dungeonSelect.vue:330", role);
      currentConfigOptions.value = JSON.parse(JSON.stringify(role.config_options || []));
      if (currentConfigOptions.value.length) {
        currentConfigOptions.value.forEach((opt) => {
          var _a2, _b2;
          selectedOptions[opt.id] = (_b2 = (_a2 = opt.options) == null ? void 0 : _a2[0]) == null ? void 0 : _b2.value;
        });
      }
      common_vendor.index.__f__("log", "at components/dungeonSelect.vue:343", "selectedMapIndex:", selectedMapIndex.value);
      common_vendor.index.__f__("log", "at components/dungeonSelect.vue:344", "selectedPosition:", selectedPosition.value);
    };
    common_vendor.watch(
      () => props.modeMapTree,
      (val) => {
        if (val.length) {
          setTimeout(() => {
            initSelection();
          }, 50);
        }
      },
      { immediate: true }
    );
    const getPayloadConfig = () => {
      if (!currentConfigOptions.value.length)
        return [];
      return currentConfigOptions.value.map((opt) => ({
        option_id: opt.id,
        value: selectedOptions[opt.id]
      }));
    };
    const createRoom = async () => {
      var _a;
      common_vendor.index.__f__("log", "at components/dungeonSelect.vue:382", props.channel);
      const payload = {
        channel: props.channel,
        map_id: (_a = currentMap.value) == null ? void 0 : _a.id,
        role_id: selectedPosition.value,
        hero_id: 0,
        // 如果你有英雄选择逻辑
        config: getPayloadConfig()
      };
      const res = await common_vendor.index.$http.post("/dungeon/create", {
        payload
      });
      common_vendor.index.__f__("log", "at components/dungeonSelect.vue:396", "用户信息:", res);
      if (res.code == 100) {
        emit("confirm-recharge", res.data);
        return false;
      }
      if (res.code === 1) {
        emit("update:modelValue", false);
        emit("confirm-share", res.data.roomInfo);
      }
    };
    const onClose = () => {
      emit("update:modelValue", false);
    };
    return (_ctx, _cache) => {
      var _a, _b, _c;
      return common_vendor.e({
        a: contentShow.value
      }, contentShow.value ? {
        b: common_vendor.o(($event) => contentShow.value = $event),
        c: common_vendor.p({
          contentId: contentId.value,
          modelValue: contentShow.value
        })
      } : {}, {
        d: common_vendor.p({
          ["model-value"]: contentShow.value,
          ["z-index"]: 20079,
          width: "100%",
          height: "100%",
          borderRadius: "16rpx"
        }),
        e: common_vendor.p({
          name: "close"
        }),
        f: common_vendor.o(onClose),
        g: ozmaDungeon.value
      }, ozmaDungeon.value ? {
        h: common_vendor.o(($event) => handleContent(4)),
        i: `url(${ozmaDungeon.value.image})`
      } : {}, {}, {
        k: common_vendor.p({
          url: (_a = common_vendor.unref(userStore).userInfo.default_hero) == null ? void 0 : _a.hero_avatar,
          size: "70rpx"
        }),
        l: common_vendor.t(((_b = common_vendor.unref(userStore).userInfo.default_hero) == null ? void 0 : _b.resist_power) || ""),
        m: common_vendor.t(((_c = common_vendor.unref(userStore).userInfo.default_hero) == null ? void 0 : _c.hero_name) || "默认角色"),
        n: selectedRole.value.code == "seller"
      }, selectedRole.value.code == "seller" ? {} : {}, {
        o: selectedRole.value.code == "deck" || selectedRole.value.code == "team"
      }, selectedRole.value.code == "deck" || selectedRole.value.code == "team" ? {} : {}, {
        p: common_vendor.o(($event) => handleSelectorClick()),
        q: currentConfigOptions.value && currentConfigOptions.value.length
      }, currentConfigOptions.value && currentConfigOptions.value.length ? {
        r: common_vendor.f(currentConfigOptions.value, (opt, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(opt.label),
            b: opt.show
          }, opt.show ? {
            c: common_vendor.o(($event) => _ctx.onTips(opt.tips), opt.id),
            d: "0f35f836-4-" + i0,
            e: common_vendor.p({
              name: "help",
              size: "30rpx"
            })
          } : {}, {
            f: common_vendor.f(opt.options, (item, k1, i1) => {
              return common_vendor.e({
                a: selectedOptions[opt.id] === item.value
              }, selectedOptions[opt.id] === item.value ? {} : {}, {
                b: selectedOptions[opt.id] === item.value ? 1 : "",
                c: common_vendor.t(item.label),
                d: item.value,
                e: common_vendor.o(($event) => selectedOptions[opt.id] = item.value, item.value)
              });
            }),
            g: opt.id
          });
        })
      } : {}, {
        s: common_vendor.t(selectedRole.value.tip),
        t: selectedRole.value.code == "dps" || selectedRole.value.code == "seller" || selectedRole.value.code == "baoche" || selectedRole.value.code == "leader"
      }, selectedRole.value.code == "dps" || selectedRole.value.code == "seller" || selectedRole.value.code == "baoche" || selectedRole.value.code == "leader" ? {
        v: common_vendor.n(selectedRole.value.code === "seller" ? "btn-primary" : "btn-outline"),
        w: common_vendor.o(createRoom)
      } : {}, {
        x: selectedRole.value.code != "seller"
      }, selectedRole.value.code != "seller" ? {} : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0f35f836"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/dungeonSelect.js.map
