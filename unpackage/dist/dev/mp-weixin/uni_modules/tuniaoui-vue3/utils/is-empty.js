"use strict";
const isEmptyVariableInDefault = (variable, defaultValue = void 0) => {
  return variable === void 0 || variable === null ? defaultValue : variable;
};
const isEmptyDoubleVariableInDefault = (variable1, variable2, defaultValue = void 0) => {
  return isEmptyVariableInDefault(
    variable1,
    isEmptyVariableInDefault(variable2, defaultValue)
  );
};
exports.isEmptyDoubleVariableInDefault = isEmptyDoubleVariableInDefault;
exports.isEmptyVariableInDefault = isEmptyVariableInDefault;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/uni_modules/tuniaoui-vue3/utils/is-empty.js.map
