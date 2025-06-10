"use strict";
const common_vendor = require("../../../../../../common/vendor.js");
function useZPaging(paging) {
  const cPaging = !!paging ? paging.value || paging : null;
  common_vendor.onPullDownRefresh(() => {
    if (!cPaging || !cPaging.value)
      return;
    cPaging.value.reload().catch(() => {
    });
  });
  common_vendor.onPageScroll((e) => {
    if (!cPaging || !cPaging.value)
      return;
    cPaging.value.updatePageScrollTop(e.scrollTop);
    e.scrollTop < 10 && cPaging.value.doChatRecordLoadMore();
  });
  common_vendor.onReachBottom(() => {
    if (!cPaging || !cPaging.value)
      return;
    cPaging.value.pageReachBottom();
  });
}
exports.useZPaging = useZPaging;
//# sourceMappingURL=../../../../../../../.sourcemap/mp-weixin/uni_modules/z-paging/components/z-paging/js/hooks/useZPaging.js.map
