"use strict";
const uni_modules_tuniaouiVue3_libs_lodash__toString = require("./_toString.js");
const uni_modules_tuniaouiVue3_libs_lodash__common = require("./_common.js");
const stringToPath = function(string) {
  string = uni_modules_tuniaouiVue3_libs_lodash__toString.toString(string);
  const result = [];
  if (uni_modules_tuniaouiVue3_libs_lodash__common.reLeadingDot.test(string)) {
    result.push("");
  }
  string.replace(
    uni_modules_tuniaouiVue3_libs_lodash__common.rePropName,
    (match, number, quote, string2) => {
      result.push(quote ? string2.replace(uni_modules_tuniaouiVue3_libs_lodash__common.reEscapeChar, "$1") : number || match);
      return "";
    }
  );
  return result;
};
exports.stringToPath = stringToPath;
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/tuniaoui-vue3/libs/lodash/_stringToPath.js.map
