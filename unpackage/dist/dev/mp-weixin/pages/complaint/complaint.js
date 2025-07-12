"use strict";
const common_vendor = require("../../common/vendor.js");
const util_ws = require("../../util/ws.js");
if (!Math) {
  (TnAvatar + fuiSteps + fuiSafeArea)();
}
const TnAvatar = () => "../../uni_modules/tuniaoui-vue3/components/avatar/src/avatar.js";
const fuiSafeArea = () => "../../components/fui-safe-area.js";
const fuiSteps = () => "../../components/fui-steps.js";
const _sfc_main = {
  __name: "complaint",
  setup(__props) {
    const complaint_id = common_vendor.ref(null);
    const complaintInfo = common_vendor.ref({});
    common_vendor.onLoad((params) => {
      if (params.complaint_id) {
        complaint_id.value = params.complaint_id;
      } else {
        common_vendor.index.showToast({
          title: "房间不存在",
          icon: "none"
        });
      }
    });
    const steps = common_vendor.ref([]);
    common_vendor.ref(0);
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
    const getComplaintDetail = async () => {
      const res = await common_vendor.index.$http.post("/room/complaintDetail", {
        complaint_id: complaint_id.value
      });
      if (res.code === 1) {
        complaintInfo.value = res.data;
        buildSteps(res.data);
      }
    };
    const requestPlatformIntervention = async () => {
      const res = await common_vendor.index.$http.post("/room/requestPlatformIntervention", {
        complaint_id: complaint_id.value
      });
      if (res.code === 1) {
        common_vendor.index.showToast({
          title: res.msg,
          icon: "none"
        });
        getComplaintDetail();
      }
    };
    const agreeToSettlement = async () => {
      const res = await common_vendor.index.$http.post("/room/agreeToSettlement", {
        complaint_id: complaint_id.value
      });
      if (res.code === 1) {
        common_vendor.index.showToast({
          title: res.msg,
          icon: "none"
        });
        getComplaintDetail();
      }
    };
    const cancelComplaint = async () => {
      const res = await common_vendor.index.$http.post("/room/cancelComplaint", {
        complaint_id: complaint_id.value
      });
      if (res.code === 1) {
        common_vendor.index.showToast({
          title: res.msg,
          icon: "none"
        });
        getComplaintDetail();
      }
    };
    const previewImage = (e) => {
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
    const buildSteps = (data) => {
      const result = [];
      result.push({
        type: "complaint",
        title: "玩家发起投诉",
        from_user: data.from_user,
        target_users: data.target_users,
        reason: data.reason,
        created_at_text: data.created_at_text
      });
      if (Array.isArray(data.replies)) {
        data.replies.forEach((reply) => {
          common_vendor.index.__f__("log", "at pages/complaint/complaint.vue:254", reply);
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
      common_vendor.index.__f__("log", "at pages/complaint/complaint.vue:293", result);
      steps.value = result;
    };
    common_vendor.onMounted(() => {
      getComplaintDetail();
      util_ws.ws.on("complaintUpdated", (msg) => {
        buildSteps(msg.data);
      });
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: complaintInfo.value.status == "pending"
      }, complaintInfo.value.status == "pending" ? {} : {}, {
        b: complaintInfo.value.status == "processing"
      }, complaintInfo.value.status == "processing" ? {} : {}, {
        c: complaintInfo.value.status == "resolved"
      }, complaintInfo.value.status == "resolved" ? {} : {}, {
        d: complaintInfo.value.status == "cancelled"
      }, complaintInfo.value.status == "cancelled" ? {} : {}, {
        e: common_vendor.w(({
          item,
          index
        }, s0, i0) => {
          return common_vendor.e({
            a: item.type === "complaint"
          }, item.type === "complaint" ? common_vendor.e({
            b: "516bbc45-1-" + i0 + ",516bbc45-0",
            c: common_vendor.p({
              size: "lg",
              url: complaintInfo.value.from_user.avatar
            }),
            d: common_vendor.t(complaintInfo.value.from_user.nickname),
            e: common_vendor.t(complaintInfo.value.from_user.id),
            f: common_vendor.t(complaintInfo.value.created_at_text),
            g: "516bbc45-2-" + i0 + ",516bbc45-0",
            h: common_vendor.p({
              size: "70rpx",
              url: complaintInfo.value.from_user.hero_avatar
            }),
            i: common_vendor.t(complaintInfo.value.from_user.hero_name),
            j: common_vendor.t(complaintInfo.value.from_user.role_title),
            k: common_vendor.t(complaintInfo.value.from_user.hero_nickname),
            l: common_vendor.f(complaintInfo.value.target_users, (target, idx, i1) => {
              return {
                a: "516bbc45-3-" + i0 + "-" + i1 + ",516bbc45-0",
                b: common_vendor.p({
                  size: "70rpx",
                  url: target.hero_avatar
                }),
                c: common_vendor.t(target.hero_name),
                d: common_vendor.t(target.role_title),
                e: common_vendor.t(target.hero_nickname),
                f: idx
              };
            }),
            m: common_vendor.t(complaintInfo.value.reason),
            n: complaintInfo.value.image_urls
          }, complaintInfo.value.image_urls ? {
            o: common_vendor.f(complaintInfo.value.image_urls, (replyImg, i, i1) => {
              return {
                a: common_vendor.o(($event) => previewImage(replyImg), i),
                b: replyImg,
                c: i
              };
            })
          } : {}, {
            p: index
          }) : {}, {
            q: item.type === "reply"
          }, item.type === "reply" ? common_vendor.e({
            r: "516bbc45-4-" + i0 + ",516bbc45-0",
            s: common_vendor.p({
              size: "70rpx",
              url: item.hero_avatar
            }),
            t: common_vendor.t(item.hero_name),
            v: common_vendor.t(item.hero_nickname),
            w: common_vendor.t(item.reply_time),
            x: common_vendor.t(item.content),
            y: item.images
          }, item.images ? {
            z: common_vendor.f(item.images, (replyImg, i, i1) => {
              return {
                a: common_vendor.o(($event) => previewImage(replyImg), i),
                b: replyImg,
                c: i
              };
            })
          } : {}, {
            A: index
          }) : {}, {
            B: item.type === "tips"
          }, item.type === "tips" ? {} : {}, {
            C: item.type === "status"
          }, item.type === "status" ? {
            D: common_vendor.t(item.content)
          } : {}, {
            E: i0,
            F: s0
          });
        }, {
          name: "d",
          path: "e",
          vueId: "516bbc45-0"
        }),
        f: common_vendor.p({
          items: steps.value,
          direction: "column",
          current: steps.value.length - 0
        }),
        g: complaintInfo.value.status != "cancelled" && complaintInfo.value.status != "resolved"
      }, complaintInfo.value.status != "cancelled" && complaintInfo.value.status != "resolved" ? common_vendor.e({
        h: complaintInfo.value.self_role == "initiator"
      }, complaintInfo.value.self_role == "initiator" ? common_vendor.e({
        i: complaintInfo.value.is_platform_involved
      }, complaintInfo.value.is_platform_involved ? {} : {
        j: common_vendor.o(requestPlatformIntervention)
      }) : {}, {
        k: complaintInfo.value.self_role == "target" && complaintInfo.value.status != "cancelled"
      }, complaintInfo.value.self_role == "target" && complaintInfo.value.status != "cancelled" ? {
        l: common_vendor.o(agreeToSettlement)
      } : {}, {
        m: complaintInfo.value.self_role == "initiator" && complaintInfo.value.status != "cancelled"
      }, complaintInfo.value.self_role == "initiator" && complaintInfo.value.status != "cancelled" ? {
        n: common_vendor.o(cancelComplaint)
      } : {}, {
        o: common_vendor.o(($event) => linkTo(`/pages/complaint/reply?complaint_id=${complaintInfo.value.id}`))
      }) : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-516bbc45"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/complaint/complaint.js.map
