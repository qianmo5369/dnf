"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
if (!Math) {
  (TnIcon + TnAvatar + fuiSteps)();
}
const fuiSteps = () => "../../components/fui-steps.js";
const TnAvatar = () => "../../uni_modules/tuniaoui-vue3/components/avatar/src/avatar.js";
const TnIcon = () => "../../uni_modules/tuniaoui-vue3/components/icon/src/icon.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const pageType = common_vendor.ref(false);
    common_vendor.ref("100vh");
    common_vendor.ref(null);
    common_vendor.ref(200);
    const steps = common_vendor.ref([]);
    common_vendor.ref([1, 2, 3, 4, 5]);
    const room_id = common_vendor.ref(null);
    const detail = common_vendor.ref({});
    common_vendor.onLoad((params) => {
      if (params.room_id) {
        room_id.value = params.room_id;
      } else {
        common_vendor.index.showToast({
          title: "房间不存在",
          icon: "none"
        });
      }
    });
    const linkTo = (path, type = "") => {
      if (type == "tabbar") {
        common_vendor.index.switchTab({
          url: path
        });
      } else {
        common_vendor.index.navigateTo({
          url: path
        });
      }
    };
    const getSettlementDetail = async () => {
      const res = await common_vendor.index.$http.post("/dungeon/getSettlementDetail", {
        room_id: room_id.value
      });
      if (res.code === 1) {
        detail.value = res.data;
        buildSteps(res.data);
      }
    };
    common_vendor.onMounted(() => {
      getSettlementDetail();
    });
    const buildSteps = (data) => {
      const result = [];
      result.push({
        type: "step1",
        title: "卖家提交初步结算"
      });
      result.push({
        type: "step2",
        title: "买家确认结算"
      });
      if (Array.isArray(data.replies)) {
        data.replies.forEach((reply) => {
          common_vendor.index.__f__("log", "at pages/complaint/index.vue:331", reply);
          result.push({
            type: "reply",
            title: "回复",
            nickname: reply.nickname,
            hero_avatar: reply.hero_avatar,
            hero_name: reply.hero_name,
            hero_nickname: reply.hero_nickname,
            content: reply.content,
            role_title: reply.role_title,
            images: reply.images,
            reply_time: reply.created_at_text
          });
        });
      }
      if (data.status == "pending") {
        result.push({
          type: "tips",
          title: "提示"
        });
      }
      if (data.status == "resolved") {
        result.push({
          type: "status",
          title: "处理完成",
          content: "同意和解"
        });
      }
      if (data.status == "cancelled") {
        result.push({
          type: "status",
          title: "处理完成",
          content: "撤回申诉"
        });
      }
      common_vendor.index.__f__("log", "at pages/complaint/index.vue:370", result);
      steps.value = result;
    };
    const showimage = (e) => {
      common_vendor.index.previewImage({
        urls: [e],
        // 需要预览的图片http链接列表
        current: "",
        // 当前显示图片的http链接，默认是第一个
        success: function(res) {
        },
        fail: function(res) {
        },
        complete: function(res) {
        }
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          color: "#fff",
          type: "help",
          size: "18"
        }),
        b: common_vendor.p({
          name: "help",
          color: "#fff"
        }),
        c: common_vendor.t(detail.value.bonus_tera),
        d: common_vendor.p({
          name: "right",
          color: "#fff"
        }),
        e: common_vendor.o(($event) => linkTo(`/pages/room/room?room_id=${room_id.value}`)),
        f: !detail.value.is_seller
      }, !detail.value.is_seller ? {} : {
        g: common_vendor.t(detail.value.final_income),
        h: common_vendor.t(detail.value.has_card),
        i: common_vendor.t(detail.value.final_income)
      }, {
        j: common_vendor.w(({
          item,
          index
        }, s0, i0) => {
          return common_vendor.e({
            a: item.type == "step1"
          }, item.type == "step1" ? {
            b: common_vendor.t(detail.value.tera_cost),
            c: common_vendor.f(detail.value.image_urls, (settlement, i, i1) => {
              return {
                a: common_vendor.o(($event) => showimage(settlement), i),
                b: settlement,
                c: i
              };
            }),
            d: index
          } : {}, {
            e: item.type == "step2"
          }, item.type == "step2" ? {
            f: common_vendor.f(detail.value.members, (membersItem, index1, i1) => {
              return common_vendor.e({
                a: "0b10032c-4-" + i0 + "-" + i1 + ",0b10032c-3",
                b: common_vendor.p({
                  size: "70rpx",
                  url: membersItem.hero_avatar
                }),
                c: common_vendor.t(membersItem.resist_power),
                d: common_vendor.t(membersItem.hero_name),
                e: common_vendor.t(membersItem.role_name),
                f: common_vendor.t(membersItem.hero_nickname),
                g: membersItem.confirmed == 0
              }, membersItem.confirmed == 0 ? {} : {}, {
                h: membersItem.confirmed == 1
              }, membersItem.confirmed == 1 ? {} : {}, {
                i: index1
              });
            }),
            g: index
          } : {}, {
            h: i0,
            i: s0
          });
        }, {
          name: "d",
          path: "j",
          vueId: "0b10032c-3"
        }),
        k: common_vendor.p({
          items: steps.value,
          direction: "column",
          current: steps.value.length - 0
        }),
        l: common_vendor.p({
          color: "#00aaff",
          type: "headphones",
          size: "14"
        }),
        m: pageType.value
      }, pageType.value ? {} : {});
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/complaint/index.js.map
