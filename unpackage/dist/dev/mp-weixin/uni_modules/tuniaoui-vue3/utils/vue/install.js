"use strict";
const uni_modules_tuniaouiVue3_utils_isEmpty = require("../is-empty.js");
const withInstall = (main, extra) => {
  main.install = (app) => {
    for (const comp of [
      main,
      ...Object.values(uni_modules_tuniaouiVue3_utils_isEmpty.isEmptyVariableInDefault(extra, {}))
    ]) {
      app.component(comp.name, comp);
    }
  };
  if (extra) {
    for (const [key, comp] of Object.entries(extra)) {
      main[key] = comp;
    }
  }
  return main;
};
const withNoopInstall = (component) => {
  component.install = () => {
  };
  return component;
};
exports.withInstall = withInstall;
exports.withNoopInstall = withNoopInstall;
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/tuniaoui-vue3/utils/vue/install.js.map
