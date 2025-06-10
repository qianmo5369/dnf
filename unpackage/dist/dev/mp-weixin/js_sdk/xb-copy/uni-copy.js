"use strict";
const common_vendor = require("../../common/vendor.js");
function uniCopy({ content, title = "角色名字已复制~", success, error }) {
  if (!content)
    return error("复制的内容不能为空 !");
  content = typeof content === "string" ? content : content.toString();
  common_vendor.index.setClipboardData({
    data: content,
    success: function() {
      success("复制成功~");
      common_vendor.index.__f__("log", "at js_sdk/xb-copy/uni-copy.js:12", "success");
    },
    fail: function() {
      success("复制失败~");
    }
  });
}
exports.uniCopy = uniCopy;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/js_sdk/xb-copy/uni-copy.js.map
