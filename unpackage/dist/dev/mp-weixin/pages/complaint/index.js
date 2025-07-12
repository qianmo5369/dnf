"use strict";
const common_vendor = require("../../common/vendor.js");
const util_formatNumber = require("../../util/formatNumber.js");
const util_ws = require("../../util/ws.js");
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
    common_vendor.ref(false);
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
    const confirmSettlement = async () => {
      const res = await common_vendor.index.$http.post("/room/confirmSettlement", {
        room_id: room_id.value
      });
      if (res.code === 1) {
        getSettlementDetail();
      }
    };
    common_vendor.onMounted(() => {
      getSettlementDetail();
      util_ws.ws.on("confirmSettlement", (msg) => {
        common_vendor.index.__f__("log", "at pages/complaint/index.vue:392", "泰拉车结算更新");
        detail.value = msg.data;
        buildSteps(msg.data);
      });
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
      if (data.complaint_thread.length > 0) {
        result.push({
          type: "tips",
          title: ""
        });
      }
      if (Array.isArray(data.complaint_thread)) {
        if (data.complaint_thread.length > 0) {
          result.push({
            type: "complaintsTips",
            title: "平台介入"
          });
        }
        data.complaint_thread.forEach((reply) => {
          common_vendor.index.__f__("log", "at pages/complaint/index.vue:439", reply);
          let reason = "";
          if (reply.is_topic == 1) {
            reason = reply.reason;
          } else {
            reason = reply.content;
          }
          result.push({
            type: "complaints",
            title: "买家发起争议",
            nickname: reply.nickname,
            hero_avatar: reply.hero_avatar,
            hero_name: reply.hero_name,
            hero_nickname: reply.hero_nickname,
            content: reason,
            role_title: reply.role_title,
            images: reply.images,
            reply_time: reply.created_at_text
          });
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
      if (data.status == "completed") {
        result.push({
          type: "completed",
          title: "",
          content: data.summary
        });
      }
      common_vendor.index.__f__("log", "at pages/complaint/index.vue:491", result);
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
          name: "help",
          color: "#fff"
        }),
        b: common_vendor.t(detail.value.settle_data.config.tera_ratio),
        c: common_vendor.p({
          name: "right",
          color: "#fff"
        }),
        d: common_vendor.o(($event) => linkTo(`/pages/room/room?room_id=${room_id.value}`)),
        e: !detail.value.is_seller
      }, !detail.value.is_seller ? {
        f: common_vendor.t(common_vendor.unref(util_formatNumber.formatWan)(detail.value.my_info.bonus)),
        g: common_vendor.t(detail.value.my_info.final_yuan),
        h: common_vendor.t(detail.value.my_info.final_yuan),
        i: common_vendor.t(detail.value.my_info.car_fee),
        j: common_vendor.t(detail.value.my_info.deposit)
      } : {
        k: common_vendor.t(detail.value.my_info.bonus_yuan),
        l: common_vendor.t(detail.value.my_info.card_bonus_yuan),
        m: common_vendor.t(detail.value.my_info.final_yuan)
      }, {
        n: common_vendor.w(({
          item,
          index
        }, s0, i0) => {
          return common_vendor.e({
            a: item.type == "step1"
          }, item.type == "step1" ? common_vendor.e({
            b: common_vendor.t(detail.value.settle_data.tera_cost),
            c: detail.value.settle_data.has_card
          }, detail.value.settle_data.has_card ? {} : {}, {
            d: detail.value.settle_data.has_card
          }, detail.value.settle_data.has_card ? {
            e: common_vendor.t(detail.value.settle_data.card_price)
          } : {}, {
            f: common_vendor.f(detail.value.settle_imgs, (settle_imgs, i, i1) => {
              return {
                a: common_vendor.o(($event) => showimage(settle_imgs), i),
                b: settle_imgs,
                c: i
              };
            }),
            g: index
          }) : {}, {
            h: item.type == "step2"
          }, item.type == "step2" ? {
            i: common_vendor.f(detail.value.members, (membersItem, index1, i1) => {
              return common_vendor.e({
                a: "0b10032c-3-" + i0 + "-" + i1 + ",0b10032c-2",
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
            j: index
          } : {}, {
            k: item.type == "complaintsTips"
          }, item.type == "complaintsTips" ? {
            l: "0b10032c-4-" + i0 + ",0b10032c-2",
            m: common_vendor.p({
              color: "#333",
              type: "info",
              size: "34"
            })
          } : {}, {
            n: item.type == "complaints"
          }, item.type == "complaints" ? common_vendor.e({
            o: "0b10032c-5-" + i0 + ",0b10032c-2",
            p: common_vendor.p({
              size: "70rpx",
              url: item.hero_avatar
            }),
            q: common_vendor.t(item.resist_power),
            r: common_vendor.t(item.hero_name),
            s: common_vendor.t(item.role_title),
            t: common_vendor.t(item.hero_nickname),
            v: common_vendor.t(item.content),
            w: item.images && item.images.length
          }, item.images && item.images.length ? common_vendor.e({
            x: item.images && item.images.length
          }, item.images && item.images.length ? {
            y: common_vendor.f(item.images, (replyImg, i, i1) => {
              return {
                a: common_vendor.o(($event) => showimage(replyImg), i),
                b: replyImg,
                c: i
              };
            })
          } : {}) : {}) : {}, {
            z: item.type == "tips"
          }, item.type == "tips" ? {
            A: "0b10032c-6-" + i0 + ",0b10032c-2",
            B: common_vendor.p({
              color: "#333",
              type: "info",
              size: "34"
            })
          } : {}, {
            C: item.type == "completed"
          }, item.type == "completed" ? {
            D: common_vendor.t(item.content)
          } : {}, {
            E: i0,
            F: s0
          });
        }, {
          name: "d",
          path: "n",
          vueId: "0b10032c-2"
        }),
        o: common_vendor.p({
          items: steps.value,
          direction: "column",
          current: steps.value.length - 0
        }),
        p: common_vendor.p({
          color: "#00aaff",
          type: "headphones",
          size: "14"
        }),
        q: detail.value.status != "completed"
      }, detail.value.status != "completed" ? common_vendor.e({
        r: detail.value.can_submit_complaint
      }, detail.value.can_submit_complaint ? {
        s: common_vendor.o(($event) => linkTo(`/pages/complaint/send?room_id=${detail.value.room_id}`))
      } : {}, {
        t: detail.value.can_reply_complaint
      }, detail.value.can_reply_complaint ? {
        v: common_vendor.o(($event) => linkTo(`/pages/complaint/reply?complaint_id=${detail.value.complaint_id}`))
      } : {}, {
        w: detail.value.show_confirm_button
      }, detail.value.show_confirm_button ? {
        x: common_vendor.o(confirmSettlement)
      } : {}) : {});
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/complaint/index.js.map
