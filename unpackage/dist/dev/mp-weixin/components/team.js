"use strict";
const common_vendor = require("../common/vendor.js");
const util_ws = require("../util/ws.js");
const stores_user = require("../stores/user.js");
if (!Math) {
  (Parse + TnPopup + TnIcon + fuiHorizontalScroll + TnAvatar)();
}
const TnIcon = () => "../uni_modules/tuniaoui-vue3/components/icon/src/icon.js";
const TnAvatar = () => "../uni_modules/tuniaoui-vue3/components/avatar/src/avatar.js";
const TnPopup = () => "../uni_modules/tuniaoui-vue3/components/popup/src/popup.js";
const Parse = () => "./parse.js";
const fuiHorizontalScroll = () => "./fui-horizontal-scroll/fui-horizontal-scroll.js";
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
  emits: ["update:modelValue", "confirm-select", "confirm-share", "confirm-recharge"],
  setup(__props, { emit: __emit }) {
    common_vendor.ref(true);
    const sys = common_vendor.index.getSystemInfoSync();
    sys.windowHeight * 0.7 + "px";
    const userStore = stores_user.useUserStore();
    const props = __props;
    const emit = __emit;
    const handleSelectorClick = () => {
      common_vendor.index.__f__("log", "at components/team.vue:186", "通知父组件");
      emit("confirm-select");
    };
    const contentId = common_vendor.ref(null);
    const contentShow = common_vendor.ref(false);
    const onTips = (tips) => {
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
    common_vendor.computed(
      () => modeMapCode.value === "ozma_assault" && ["leader", "baoche"].includes(selectedRole.value.code)
    );
    common_vendor.computed(
      () => modeMapCode.value === "ozma_assault" && ["leader", "baoche"].includes(selectedRole.value.code)
    );
    common_vendor.computed(() => ["seller", "deck", "team"].includes(selectedRole.value.code));
    common_vendor.computed(
      () => selectedRole.value.code === "dps"
    );
    common_vendor.computed(
      () => ["seller", "deck", "team"].includes(selectedRole.value.code)
    );
    common_vendor.computed(() => ["seller"].includes(selectedRole.value.code));
    common_vendor.computed(
      () => modeMapCode.value === "ozma_descent" && selectedRole.value.code === "dps"
    );
    const onSelectMap = (index) => {
      selectedMapIndex.value = index;
      selectedPosition.value = null;
      currentConfigOptions.value = [];
    };
    const currentConfigOptions = common_vendor.ref([]);
    const selectedOptions = common_vendor.reactive({});
    const onSelectRole = (role) => {
      selectedPosition.value = role.id;
      currentConfigOptions.value = JSON.parse(JSON.stringify(role.config_options || []));
      selectedOptionsClear();
      if (currentConfigOptions.value.length) {
        currentConfigOptions.value.forEach((opt) => {
          var _a, _b;
          selectedOptions[opt.id] = (_b = (_a = opt.options) == null ? void 0 : _a[0]) == null ? void 0 : _b.value;
        });
      }
    };
    function selectedOptionsClear() {
      Object.keys(selectedOptions).forEach((key) => delete selectedOptions[key]);
    }
    common_vendor.watch(
      () => props.modeMapTree,
      (val) => {
        if (val.length > 0) {
          selectedDungeonIndex.value = 0;
          selectedDungeon.value = val[0].id;
          selectedMapIndex.value = 0;
          common_vendor.index.__f__("log", "at components/team.vue:289", currentMap.value.code);
        }
      },
      {
        immediate: true
      }
    );
    const onSelectDungeon = (index) => {
      selectedDungeonIndex.value = index;
      selectedDungeon.value = props.modeMapTree[index].id;
      selectedMapIndex.value = 0;
      selectedPosition.value = null;
      currentConfigOptions.value = [];
    };
    const getPayloadConfig = () => {
      if (!currentConfigOptions.value.length)
        return [];
      return currentConfigOptions.value.map((opt) => ({
        option_id: opt.id,
        value: selectedOptions[opt.id]
      }));
    };
    const createRoom = async (type = "create") => {
      var _a;
      const payload = {
        channel: props.channel,
        map_id: (_a = currentMap.value) == null ? void 0 : _a.id,
        role_id: selectedPosition.value,
        hero_id: 0,
        // 如果你有英雄选择逻辑
        config: getPayloadConfig()
      };
      common_vendor.index.__f__("log", "at components/team.vue:330", type);
      const res = await common_vendor.index.$http.post(`/dungeon/${type}`, {
        payload
      });
      if (res.code == 100) {
        emit("confirm-recharge", res.data);
        return false;
      }
      if (res.code === 1) {
        util_ws.ws.send({
          type: "join",
          room_code: `room_${res.data.roomInfo.room_id}`
        });
        emit("update:modelValue", false);
        if (type == "create") {
          emit("confirm-share", res.data.roomInfo);
        } else {
          emit("confirm-share", res.data.roomInfo, "join");
          common_vendor.index.navigateTo({
            url: `/pages/room/room?room_id=${res.data.roomInfo.room_id}`
          });
        }
      }
    };
    const onClose = () => {
      emit("update:modelValue", false);
    };
    return (_ctx, _cache) => {
      var _a, _b, _c, _d;
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
          width: "100%",
          height: "100%",
          borderRadius: "16rpx"
        }),
        e: common_vendor.p({
          name: "close"
        }),
        f: common_vendor.o(onClose),
        g: common_vendor.f(__props.modeMapTree, (d, index, i0) => {
          return {
            a: common_vendor.t(d.title),
            b: common_vendor.n(selectedDungeon.value === d.id ? "mask-hidden" : ""),
            c: d.id,
            d: `url(${d.image})`,
            e: common_vendor.o(($event) => onSelectDungeon(index), d.id)
          };
        }),
        h: common_vendor.p({
          background: "rgba(255, 43, 43, .08)",
          scrollBarColor: "#007aff"
        }),
        i: common_vendor.f(((_a = currentDungeon.value) == null ? void 0 : _a.maps) || [], (map, index, i0) => {
          return {
            a: map.image,
            b: common_vendor.t(map.title),
            c: map.id,
            d: selectedMapIndex.value === index ? 1 : "",
            e: common_vendor.o(($event) => onSelectMap(index), map.id)
          };
        }),
        j: common_vendor.p({
          url: (_b = common_vendor.unref(userStore).userInfo.default_hero) == null ? void 0 : _b.hero_avatar,
          size: "70rpx"
        }),
        k: common_vendor.t(((_c = common_vendor.unref(userStore).userInfo.default_hero) == null ? void 0 : _c.resist_power) || ""),
        l: common_vendor.t(((_d = common_vendor.unref(userStore).userInfo.default_hero) == null ? void 0 : _d.hero_name) || "默认角色"),
        m: selectedRole.value.code == "seller"
      }, selectedRole.value.code == "seller" ? {} : {}, {
        n: selectedRole.value.code == "deck" || selectedRole.value.code == "team"
      }, selectedRole.value.code == "deck" || selectedRole.value.code == "team" ? {} : {}, {
        o: common_vendor.o(($event) => handleSelectorClick()),
        p: !selectedRole.value.code != "seller"
      }, !selectedRole.value.code != "seller" ? {
        q: common_vendor.f(currentRoles.value, (role, k0, i0) => {
          return {
            a: common_vendor.t(role.title),
            b: role.id,
            c: selectedPosition.value === role.id ? 1 : "",
            d: common_vendor.o(($event) => onSelectRole(role), role.id)
          };
        })
      } : {}, {
        r: currentConfigOptions.value && currentConfigOptions.value.length
      }, currentConfigOptions.value && currentConfigOptions.value.length ? {
        s: common_vendor.f(currentConfigOptions.value, (opt, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(opt.label),
            b: opt.show
          }, opt.show ? {
            c: common_vendor.o(($event) => onTips(opt.tips), opt.id),
            d: "176a9427-5-" + i0,
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
        t: common_vendor.t(selectedRole.value.tip),
        v: selectedRole.value.code == "dps" || selectedRole.value.code == "seller" || selectedRole.value.code == "baoche" || selectedRole.value.code == "leader"
      }, selectedRole.value.code == "dps" || selectedRole.value.code == "seller" || selectedRole.value.code == "baoche" || selectedRole.value.code == "leader" ? {
        w: common_vendor.n(selectedRole.value.code === "seller" ? "btn-primary" : "btn-outline"),
        x: common_vendor.o(($event) => createRoom("create"))
      } : {}, {
        y: selectedRole.value.code != "seller"
      }, selectedRole.value.code != "seller" ? {
        z: !selectedRole.value.code ? 1 : "",
        A: common_vendor.o(($event) => createRoom("join"))
      } : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-176a9427"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/team.js.map
