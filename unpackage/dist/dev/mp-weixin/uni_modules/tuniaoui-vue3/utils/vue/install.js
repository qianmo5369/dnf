"use strict";
const withNoopInstall = (component) => {
  component.install = () => {
  };
  return component;
};
exports.withNoopInstall = withNoopInstall;
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/tuniaoui-vue3/utils/vue/install.js.map
