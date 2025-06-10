"use strict";
const common_vendor = require("../common/vendor.js");
const stores_user = require("../stores/user.js");
if (!Math) {
  (TnIcon + TnAvatar)();
}
const TnIcon = () => "../uni_modules/tuniaoui-vue3/components/icon/src/icon.js";
const TnAvatar = () => "../uni_modules/tuniaoui-vue3/components/avatar/src/avatar.js";
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
  emits: ["update:modelValue", "confirm-select", "confirm-share"],
  setup(__props, { emit: __emit }) {
    common_vendor.ref(true);
    const sys = common_vendor.index.getSystemInfoSync();
    sys.windowHeight * 0.7 + "px";
    const userStore = stores_user.useUserStore();
    const props = __props;
    const emit = __emit;
    const handleSelectorClick = () => {
      common_vendor.index.__f__("log", "at components/dungeonSelect.vue:227", "通知父组件");
      emit("confirm-select");
    };
    const handleSelectPosition = (role) => {
      var _a;
      if (((_a = currentMap.value) == null ? void 0 : _a.code) === "terache" && role.code === "seller")
        return;
      selectedPosition.value = role.id;
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
    const showPositionSelector = common_vendor.computed(() => {
      var _a;
      const mapCode = (_a = currentMap.value) == null ? void 0 : _a.code;
      const roleCode = selectedRole.value.code;
      if (mapCode === "terache" && roleCode === "seller")
        return false;
      return ["deck", "team"].includes(roleCode);
    });
    const filteredRoles = common_vendor.computed(() => {
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
    const showClosureOption = common_vendor.computed(
      () => modeMapCode.value === "ozma_assault" && ["leader", "baoche"].includes(selectedRole.value.code)
    );
    const showHireOption = common_vendor.computed(
      () => modeMapCode.value === "ozma_assault" && ["leader", "baoche"].includes(selectedRole.value.code)
    );
    const showTeraOptions = common_vendor.computed(() => ["seller", "deck", "team"].includes(selectedRole.value.code));
    const showIsSoloOption = common_vendor.computed(
      () => modeMapCode.value === "ozma_assault" && selectedRole.value.code === "dps"
    );
    const showTeraOwnOption = common_vendor.computed(
      () => ["seller", "deck", "team"].includes(selectedRole.value.code)
    );
    const showPrivateOption = common_vendor.computed(() => ["seller"].includes(selectedRole.value.code));
    const showEnableSupport = common_vendor.computed(
      () => modeMapCode.value === "ozma_descent" && selectedRole.value.code === "dps"
    );
    common_vendor.index.__f__("log", "at components/dungeonSelect.vue:355", currentMap.value.code);
    common_vendor.ref(false);
    const initSelection = () => {
      var _a, _b, _c, _d, _e;
      const val = props.modeMapTree;
      common_vendor.index.__f__("log", "at components/dungeonSelect.vue:379", "props.modeMapTree.length:", val.length);
      const dungeon = val.find((d) => d.code === props.defaultDungeonCode);
      if (!dungeon)
        return;
      common_vendor.index.__f__("log", "at components/dungeonSelect.vue:384", "dungeon.maps:", dungeon.maps);
      common_vendor.index.__f__("log", "at components/dungeonSelect.vue:385", "roles:", (_b = (_a = dungeon.maps) == null ? void 0 : _a[0]) == null ? void 0 : _b.roles);
      selectedDungeon.value = dungeon.id;
      selectedDungeonIndex.value = val.findIndex((d) => d.id === dungeon.id);
      const mapIndex = (_c = dungeon.maps) == null ? void 0 : _c.findIndex((m) => m.code === props.defaultMapCode);
      selectedMapIndex.value = mapIndex >= 0 ? mapIndex : 0;
      const map = (_d = dungeon.maps) == null ? void 0 : _d[selectedMapIndex.value];
      const role = (_e = map == null ? void 0 : map.roles) == null ? void 0 : _e.find((r) => r.code === props.defaultRoleCode);
      selectedPosition.value = (role == null ? void 0 : role.id) ?? null;
      common_vendor.index.__f__("log", "at components/dungeonSelect.vue:397", "selectedMapIndex:", selectedMapIndex.value);
      common_vendor.index.__f__("log", "at components/dungeonSelect.vue:398", "selectedPosition:", selectedPosition.value);
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
    common_vendor.watch(() => configOptions.value.closure_count, (opts) => {
      if (opts == null ? void 0 : opts.length)
        selectedClosure.value = opts[0].value;
    }, {
      immediate: true
    });
    common_vendor.watch(() => configOptions.value.hire_count, (opts) => {
      if (opts == null ? void 0 : opts.length)
        selectedHire.value = opts[0].value;
    }, {
      immediate: true
    });
    common_vendor.watch(() => configOptions.value.tera_ratio, (opts) => {
      if (opts == null ? void 0 : opts.length)
        selectedTeraRatio.value = opts[0].value;
    }, {
      immediate: true
    });
    common_vendor.watch(() => configOptions.value.tera_own, (opts) => {
      if (opts == null ? void 0 : opts.length)
        selectedTeraOwn.value = opts[0].value;
    }, {
      immediate: true
    });
    common_vendor.watch(() => configOptions.value.is_solo, (opts) => {
      if (opts == null ? void 0 : opts.length)
        selectedIsSolo.value = opts[0].value;
    }, {
      immediate: true
    });
    common_vendor.watch(() => configOptions.value.is_private, (opts) => {
      if (opts == null ? void 0 : opts.length)
        selectedPrivate.value = opts[0].value;
    }, {
      immediate: true
    });
    common_vendor.watch(() => configOptions.value.enable_support, (opts) => {
      if (opts == null ? void 0 : opts.length)
        selectedSupport.value = opts[0].value;
    }, {
      immediate: true
    });
    const createRoom = async () => {
      var _a;
      common_vendor.index.__f__("log", "at components/dungeonSelect.vue:503", props.channel);
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
      common_vendor.index.__f__("log", "at components/dungeonSelect.vue:580", "用户信息:", res);
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
        a: common_vendor.p({
          name: "close"
        }),
        b: common_vendor.o(onClose),
        c: ozmaDungeon.value
      }, ozmaDungeon.value ? {
        d: `url(${ozmaDungeon.value.image})`
      } : {}, {}, {
        f: common_vendor.p({
          url: (_a = common_vendor.unref(userStore).userInfo.default_hero) == null ? void 0 : _a.hero_avatar,
          size: "70rpx"
        }),
        g: common_vendor.t(((_b = common_vendor.unref(userStore).userInfo.default_hero) == null ? void 0 : _b.resist_power) || ""),
        h: common_vendor.t(((_c = common_vendor.unref(userStore).userInfo.default_hero) == null ? void 0 : _c.hero_name) || "默认角色"),
        i: selectedRole.value.code == "seller"
      }, selectedRole.value.code == "seller" ? {} : {}, {
        j: selectedRole.value.code == "deck" || selectedRole.value.code == "team"
      }, selectedRole.value.code == "deck" || selectedRole.value.code == "team" ? {} : {}, {
        k: common_vendor.o(($event) => handleSelectorClick()),
        l: showPositionSelector.value
      }, showPositionSelector.value ? {
        m: common_vendor.f(filteredRoles.value, (role, k0, i0) => {
          return {
            a: common_vendor.t(role.title),
            b: role.id,
            c: selectedPosition.value === role.id ? 1 : "",
            d: common_vendor.o(() => handleSelectPosition(role), role.id)
          };
        })
      } : {}, {
        n: showClosureOption.value
      }, showClosureOption.value ? {
        o: common_vendor.f(configOptions.value.closure_count, (opt, k0, i0) => {
          return {
            a: selectedClosure.value === opt.value ? 1 : "",
            b: common_vendor.t(opt.label),
            c: opt.value,
            d: common_vendor.o(($event) => selectedClosure.value = opt.value, opt.value)
          };
        })
      } : {}, {
        p: showHireOption.value
      }, showHireOption.value ? {
        q: common_vendor.o(($event) => _ctx.tip("雇佣打手说明")),
        r: common_vendor.p({
          name: "help",
          size: "24rpx"
        }),
        s: common_vendor.f(configOptions.value.hire_count, (opt, k0, i0) => {
          return {
            a: selectedHire.value === opt.value ? 1 : "",
            b: common_vendor.t(opt.label),
            c: opt.value,
            d: common_vendor.o(($event) => selectedHire.value = opt.value, opt.value)
          };
        })
      } : {}, {
        t: showIsSoloOption.value
      }, showIsSoloOption.value ? {
        v: common_vendor.f(configOptions.value.is_solo, (opt, k0, i0) => {
          return {
            a: selectedIsSolo.value === opt.value ? 1 : "",
            b: common_vendor.t(opt.label),
            c: opt.value,
            d: common_vendor.o(($event) => selectedIsSolo.value = opt.value, opt.value)
          };
        })
      } : {}, {
        w: showEnableSupport.value
      }, showEnableSupport.value ? {
        x: common_vendor.f(configOptions.value.is_solo, (opt, k0, i0) => {
          return {
            a: selectedSupport.value === opt.value ? 1 : "",
            b: common_vendor.t(opt.label),
            c: opt.value,
            d: common_vendor.o(($event) => selectedSupport.value = opt.value, opt.value)
          };
        })
      } : {}, {
        y: showTeraOwnOption.value
      }, showTeraOwnOption.value ? {
        z: common_vendor.o(($event) => _ctx.tip("拥有泰拉说明")),
        A: common_vendor.p({
          name: "help",
          size: "24rpx"
        }),
        B: common_vendor.f(configOptions.value.tera_own, (opt, k0, i0) => {
          return {
            a: selectedTeraOwn.value === opt.value ? 1 : "",
            b: common_vendor.t(opt.label),
            c: opt.value,
            d: common_vendor.o(($event) => selectedTeraOwn.value = opt.value, opt.value)
          };
        })
      } : {}, {
        C: showTeraOptions.value
      }, showTeraOptions.value ? {
        D: common_vendor.o(($event) => _ctx.tip("泰拉比例说明")),
        E: common_vendor.p({
          name: "help",
          size: "24rpx"
        }),
        F: common_vendor.f(configOptions.value.tera_ratio, (opt, k0, i0) => {
          return {
            a: selectedTeraRatio.value === opt.value ? 1 : "",
            b: common_vendor.t(opt.label),
            c: opt.value,
            d: common_vendor.o(($event) => selectedTeraRatio.value = opt.value, opt.value)
          };
        })
      } : {}, {
        G: showPrivateOption.value
      }, showPrivateOption.value ? {
        H: common_vendor.o(($event) => _ctx.tip("私密房间说明")),
        I: common_vendor.p({
          name: "help",
          size: "24rpx"
        }),
        J: common_vendor.f(configOptions.value.is_private, (opt, k0, i0) => {
          return {
            a: selectedPrivate.value === opt.value ? 1 : "",
            b: common_vendor.t(opt.label),
            c: opt.value,
            d: common_vendor.o(($event) => selectedPrivate.value = opt.value, opt.value)
          };
        })
      } : {}, {
        K: common_vendor.t(selectedRole.value.tip),
        L: selectedRole.value.code == "dps" || selectedRole.value.code == "seller" || selectedRole.value.code == "baoche" || selectedRole.value.code == "leader"
      }, selectedRole.value.code == "dps" || selectedRole.value.code == "seller" || selectedRole.value.code == "baoche" || selectedRole.value.code == "leader" ? {
        M: common_vendor.n(selectedRole.value.code === "seller" ? "btn-primary" : "btn-outline"),
        N: common_vendor.o(createRoom)
      } : {}, {
        O: selectedRole.value.code != "seller"
      }, selectedRole.value.code != "seller" ? {} : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0f35f836"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/dungeonSelect.js.map
