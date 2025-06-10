"use strict";
const common_vendor = require("../common/vendor.js");
const util_ws = require("../util/ws.js");
const stores_user = require("../stores/user.js");
if (!Math) {
  (TnIcon + TnAvatar)();
}
const TnIcon = () => "../uni_modules/tuniaoui-vue3/components/icon/src/icon.js";
const TnAvatar = () => "../uni_modules/tuniaoui-vue3/components/avatar/src/avatar.js";
const _sfc_main = {
  __name: "team",
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    modeMapTree: {
      type: Array,
      default: () => []
    },
    channel: {
      type: String,
      default: "wechat"
    }
  },
  emits: ["update:modelValue", "confirm-select", "confirm-share"],
  setup(__props, { emit: __emit }) {
    common_vendor.ref(true);
    const sys = common_vendor.index.getSystemInfoSync();
    sys.windowHeight * 0.7 + "px";
    const userStore = stores_user.useUserStore();
    const props = __props;
    const emit = __emit;
    const handleSelectorClick = () => {
      common_vendor.index.__f__("log", "at components/team.vue:243", "通知父组件");
      emit("confirm-select");
    };
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
    const configOptions = common_vendor.computed(() => {
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
    const selectedClosure = common_vendor.ref(null);
    const selectedHire = common_vendor.ref(null);
    const selectedTeraRatio = common_vendor.ref(null);
    const selectedTeraOwn = common_vendor.ref(null);
    const selectedIsSolo = common_vendor.ref(null);
    const selectedPrivate = common_vendor.ref(null);
    const selectedSupport = common_vendor.ref(null);
    const showClosureOption = common_vendor.computed(
      () => modeMapCode.value === "ozma_assault" && ["leader", "baoche"].includes(selectedRole.value.code)
    );
    const showHireOption = common_vendor.computed(
      () => modeMapCode.value === "ozma_assault" && ["leader", "baoche"].includes(selectedRole.value.code)
    );
    const showTeraOptions = common_vendor.computed(
      () => ["seller", "deck", "team"].includes(selectedRole.value.code)
    );
    const showIsSoloOption = common_vendor.computed(
      () => modeMapCode.value === "ozma_assault" && selectedRole.value.code === "dps"
    );
    const showTeraOwnOption = common_vendor.computed(
      () => ["seller", "deck", "team"].includes(selectedRole.value.code)
    );
    const showPrivateOption = common_vendor.computed(
      () => ["seller"].includes(selectedRole.value.code)
    );
    const showEnableSupport = common_vendor.computed(
      () => modeMapCode.value === "ozma_descent" && selectedRole.value.code === "dps"
    );
    common_vendor.index.__f__("log", "at components/team.vue:306", currentMap.value.code);
    common_vendor.watch(
      () => props.modeMapTree,
      (val) => {
        if (val.length > 0) {
          selectedDungeonIndex.value = 0;
          selectedDungeon.value = val[0].id;
          selectedMapIndex.value = 0;
          common_vendor.index.__f__("log", "at components/team.vue:320", currentMap.value.code);
        }
      },
      { immediate: true }
    );
    common_vendor.watch(() => configOptions.value.closure_count, (opts) => {
      if (opts == null ? void 0 : opts.length)
        selectedClosure.value = opts[0].value;
    }, { immediate: true });
    common_vendor.watch(() => configOptions.value.hire_count, (opts) => {
      if (opts == null ? void 0 : opts.length)
        selectedHire.value = opts[0].value;
    }, { immediate: true });
    common_vendor.watch(() => configOptions.value.tera_ratio, (opts) => {
      if (opts == null ? void 0 : opts.length)
        selectedTeraRatio.value = opts[0].value;
    }, { immediate: true });
    common_vendor.watch(() => configOptions.value.tera_own, (opts) => {
      if (opts == null ? void 0 : opts.length)
        selectedTeraOwn.value = opts[0].value;
    }, { immediate: true });
    common_vendor.watch(() => configOptions.value.is_solo, (opts) => {
      if (opts == null ? void 0 : opts.length)
        selectedIsSolo.value = opts[0].value;
    }, { immediate: true });
    common_vendor.watch(() => configOptions.value.is_private, (opts) => {
      if (opts == null ? void 0 : opts.length)
        selectedPrivate.value = opts[0].value;
    }, { immediate: true });
    common_vendor.watch(() => configOptions.value.enable_support, (opts) => {
      if (opts == null ? void 0 : opts.length)
        selectedSupport.value = opts[0].value;
    }, { immediate: true });
    const onSelectDungeon = (index) => {
      selectedDungeonIndex.value = index;
      selectedDungeon.value = props.modeMapTree[index].id;
      selectedMapIndex.value = 0;
      selectedPosition.value = null;
    };
    const createRoom = async () => {
      var _a;
      common_vendor.index.__f__("log", "at components/team.vue:366", props.channel);
      const payload = {
        channel: props.channel,
        map_id: (_a = currentMap.value) == null ? void 0 : _a.id,
        role_id: selectedPosition.value,
        hero_id: 0,
        // 如果你有英雄选择逻辑
        config: []
      };
      const findOptionId = (groupKey, value) => {
        const list = configOptions.value[groupKey] || [];
        const option = list.find((item) => item.value == value);
        return (option == null ? void 0 : option.id) || null;
      };
      if (showClosureOption.value && selectedClosure.value) {
        const id = findOptionId("closure_count", selectedClosure.value);
        if (id)
          payload.config.push(id);
      }
      if (showHireOption.value && selectedHire.value) {
        const id = findOptionId("hire_count", selectedHire.value);
        if (id)
          payload.config.push(id);
      }
      if (showTeraOptions.value && selectedTeraRatio.value) {
        const id = findOptionId("tera_ratio", selectedTeraRatio.value);
        if (id)
          payload.config.push(id);
      }
      if (showTeraOwnOption.value && selectedTeraOwn.value) {
        const id = findOptionId("tera_own", selectedTeraOwn.value);
        if (id)
          payload.config.push(id);
      }
      if (showIsSoloOption.value && selectedIsSolo.value) {
        const id = findOptionId("is_solo", selectedIsSolo.value);
        if (id)
          payload.config.push(id);
      }
      if (showPrivateOption.value && selectedPrivate.value) {
        const id = findOptionId("is_private", selectedPrivate.value);
        if (id)
          payload.config.push(id);
      }
      if (showEnableSupport.value && selectedSupport.value) {
        const id = findOptionId("enable_support", selectedSupport.value);
        if (id)
          payload.config.push(id);
      }
      const res = await common_vendor.index.$http.post("/dungeon/create", {
        payload
      });
      common_vendor.index.__f__("log", "at components/team.vue:452", "用户信息:", res);
      if (res.code === 1) {
        util_ws.ws.send({
          type: "join",
          room_code: `room_${res.data.roomInfo.room_id}`
        });
        emit("update:modelValue", false);
        emit("confirm-share", res.data.roomInfo);
      }
    };
    const onClose = () => {
      emit("update:modelValue", false);
    };
    return (_ctx, _cache) => {
      var _a, _b, _c, _d;
      return common_vendor.e({
        a: common_vendor.p({
          name: "close"
        }),
        b: common_vendor.o(onClose),
        c: common_vendor.f(__props.modeMapTree, (d, index, i0) => {
          return {
            a: common_vendor.t(d.title),
            b: common_vendor.n(selectedDungeon.value === d.id ? "mask-hidden" : ""),
            c: d.id,
            d: `url(${d.image})`,
            e: common_vendor.o(($event) => onSelectDungeon(index), d.id)
          };
        }),
        d: common_vendor.f(((_a = currentDungeon.value) == null ? void 0 : _a.maps) || [], (map, index, i0) => {
          return {
            a: common_vendor.t(map.title),
            b: map.id,
            c: selectedMapIndex.value === index ? 1 : "",
            d: common_vendor.o(($event) => {
              selectedMapIndex.value = index;
              selectedPosition.value = null;
            }, map.id)
          };
        }),
        e: common_vendor.p({
          url: (_b = common_vendor.unref(userStore).userInfo.default_hero) == null ? void 0 : _b.hero_avatar,
          size: "70rpx"
        }),
        f: common_vendor.t(((_c = common_vendor.unref(userStore).userInfo.default_hero) == null ? void 0 : _c.resist_power) || ""),
        g: common_vendor.t(((_d = common_vendor.unref(userStore).userInfo.default_hero) == null ? void 0 : _d.hero_name) || "默认角色"),
        h: selectedRole.value.code == "seller"
      }, selectedRole.value.code == "seller" ? {} : {}, {
        i: selectedRole.value.code == "deck" || selectedRole.value.code == "team"
      }, selectedRole.value.code == "deck" || selectedRole.value.code == "team" ? {} : {}, {
        j: common_vendor.o(($event) => handleSelectorClick()),
        k: !selectedRole.value.code != "seller"
      }, !selectedRole.value.code != "seller" ? {
        l: common_vendor.f(currentRoles.value, (role, k0, i0) => {
          return {
            a: common_vendor.t(role.title),
            b: role.id,
            c: selectedPosition.value === role.id ? 1 : "",
            d: common_vendor.o(($event) => selectedPosition.value = role.id, role.id)
          };
        })
      } : {}, {
        m: showClosureOption.value
      }, showClosureOption.value ? {
        n: common_vendor.f(configOptions.value.closure_count, (opt, k0, i0) => {
          return {
            a: selectedClosure.value === opt.value ? 1 : "",
            b: common_vendor.t(opt.label),
            c: opt.value,
            d: common_vendor.o(($event) => selectedClosure.value = opt.value, opt.value)
          };
        })
      } : {}, {
        o: showHireOption.value
      }, showHireOption.value ? {
        p: common_vendor.o(($event) => _ctx.tip("雇佣打手说明")),
        q: common_vendor.p({
          name: "help",
          size: "24rpx"
        }),
        r: common_vendor.f(configOptions.value.hire_count, (opt, k0, i0) => {
          return {
            a: selectedHire.value === opt.value ? 1 : "",
            b: common_vendor.t(opt.label),
            c: opt.value,
            d: common_vendor.o(($event) => selectedHire.value = opt.value, opt.value)
          };
        })
      } : {}, {
        s: showIsSoloOption.value
      }, showIsSoloOption.value ? {
        t: common_vendor.f(configOptions.value.is_solo, (opt, k0, i0) => {
          return {
            a: selectedIsSolo.value === opt.value ? 1 : "",
            b: common_vendor.t(opt.label),
            c: opt.value,
            d: common_vendor.o(($event) => selectedIsSolo.value = opt.value, opt.value)
          };
        })
      } : {}, {
        v: showEnableSupport.value
      }, showEnableSupport.value ? {
        w: common_vendor.f(configOptions.value.enable_support, (opt, k0, i0) => {
          return {
            a: selectedSupport.value === opt.value ? 1 : "",
            b: common_vendor.t(opt.label),
            c: opt.value,
            d: common_vendor.o(($event) => selectedSupport.value = opt.value, opt.value)
          };
        })
      } : {}, {
        x: showTeraOwnOption.value
      }, showTeraOwnOption.value ? {
        y: common_vendor.o(($event) => _ctx.tip("拥有泰拉说明")),
        z: common_vendor.p({
          name: "help",
          size: "24rpx"
        }),
        A: common_vendor.f(configOptions.value.tera_own, (opt, k0, i0) => {
          return {
            a: selectedTeraOwn.value === opt.value ? 1 : "",
            b: common_vendor.t(opt.label),
            c: opt.value,
            d: common_vendor.o(($event) => selectedTeraOwn.value = opt.value, opt.value)
          };
        })
      } : {}, {
        B: showTeraOptions.value
      }, showTeraOptions.value ? {
        C: common_vendor.o(($event) => _ctx.tip("泰拉比例说明")),
        D: common_vendor.p({
          name: "help",
          size: "24rpx"
        }),
        E: common_vendor.f(configOptions.value.tera_ratio, (opt, k0, i0) => {
          return {
            a: selectedTeraRatio.value === opt.value ? 1 : "",
            b: common_vendor.t(opt.label),
            c: opt.value,
            d: common_vendor.o(($event) => selectedTeraRatio.value = opt.value, opt.value)
          };
        })
      } : {}, {
        F: showPrivateOption.value
      }, showPrivateOption.value ? {
        G: common_vendor.o(($event) => _ctx.tip("私密房间说明")),
        H: common_vendor.p({
          name: "help",
          size: "24rpx"
        }),
        I: common_vendor.f(configOptions.value.is_private, (opt, k0, i0) => {
          return {
            a: selectedPrivate.value === opt.value ? 1 : "",
            b: common_vendor.t(opt.label),
            c: opt.value,
            d: common_vendor.o(($event) => selectedPrivate.value = opt.value, opt.value)
          };
        })
      } : {}, {
        J: common_vendor.t(selectedRole.value.tip),
        K: selectedRole.value.code == "dps" || selectedRole.value.code == "seller" || selectedRole.value.code == "baoche" || selectedRole.value.code == "leader"
      }, selectedRole.value.code == "dps" || selectedRole.value.code == "seller" || selectedRole.value.code == "baoche" || selectedRole.value.code == "leader" ? {
        L: common_vendor.n(selectedRole.value.code === "seller" ? "btn-primary" : "btn-outline"),
        M: common_vendor.o(createRoom)
      } : {}, {
        N: selectedRole.value.code != "seller"
      }, selectedRole.value.code != "seller" ? {} : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-176a9427"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/team.js.map
