"use strict";
const reIsPlainProp = /^\w*$/;
const reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
const reLeadingDot = /^\./;
const rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
const reEscapeChar = /\\(\\)?/g;
const reIsUint = /^(?:0|[1-9]\d*)$/;
const INFINITY = 1 / 0;
const MAX_SAFE_INTEGER = 9007199254740991;
exports.INFINITY = INFINITY;
exports.MAX_SAFE_INTEGER = MAX_SAFE_INTEGER;
exports.reEscapeChar = reEscapeChar;
exports.reIsDeepProp = reIsDeepProp;
exports.reIsPlainProp = reIsPlainProp;
exports.reIsUint = reIsUint;
exports.reLeadingDot = reLeadingDot;
exports.rePropName = rePropName;
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/tuniaoui-vue3/libs/lodash/_common.js.map
