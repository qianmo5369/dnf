"use strict";
const common_vendor = require("../../../../../../common/vendor.js");
const uni_modules_tuniaouiVue3_utils_isEmpty = require("../../../../utils/is-empty.js");
const uni_modules_tuniaouiVue3_libs_lodash_isBoolean = require("../../../../libs/lodash/is-boolean.js");
require("../../../../libs/lodash/_baseToString.js");
const useModal = () => {
  const openModal = common_vendor.ref(false);
  const title = common_vendor.ref("");
  const content = common_vendor.ref("");
  const showCancel = common_vendor.ref(false);
  const cancelText = common_vendor.ref("");
  const cancelStyle = common_vendor.ref({});
  const confirmText = common_vendor.ref("");
  const confirmStyle = common_vendor.ref({});
  const mask = common_vendor.ref(true);
  const maskClosable = common_vendor.ref(false);
  const cancelFunc = common_vendor.ref(void 0);
  const confirmFunc = common_vendor.ref(void 0);
  const showModal = (options) => {
    openModal.value = true;
    title.value = uni_modules_tuniaouiVue3_utils_isEmpty.isEmptyVariableInDefault(options.title, "");
    content.value = options.content;
    showCancel.value = uni_modules_tuniaouiVue3_utils_isEmpty.isEmptyVariableInDefault(options == null ? void 0 : options.showCancel, false);
    cancelText.value = uni_modules_tuniaouiVue3_utils_isEmpty.isEmptyVariableInDefault(options == null ? void 0 : options.cancelText, "取 消");
    cancelStyle.value = uni_modules_tuniaouiVue3_utils_isEmpty.isEmptyVariableInDefault(options == null ? void 0 : options.cancelStyle, {});
    confirmText.value = uni_modules_tuniaouiVue3_utils_isEmpty.isEmptyVariableInDefault(options == null ? void 0 : options.confirmText, "确 认");
    confirmStyle.value = uni_modules_tuniaouiVue3_utils_isEmpty.isEmptyVariableInDefault(options == null ? void 0 : options.confirmStyle, {});
    mask.value = uni_modules_tuniaouiVue3_utils_isEmpty.isEmptyVariableInDefault(options == null ? void 0 : options.mask, true);
    maskClosable.value = uni_modules_tuniaouiVue3_utils_isEmpty.isEmptyVariableInDefault(options == null ? void 0 : options.maskClosable, false);
    cancelFunc.value = options == null ? void 0 : options.cancel;
    confirmFunc.value = options == null ? void 0 : options.confirm;
  };
  const closeModal = () => {
    openModal.value = false;
  };
  const clickCancel = () => {
    if (!cancelFunc.value) {
      closeModal();
      return;
    }
    const func = cancelFunc.value();
    const isPromiseOrBool = [common_vendor.isPromise(func), uni_modules_tuniaouiVue3_libs_lodash_isBoolean.isBoolean(func)].includes(true);
    if (!isPromiseOrBool) {
      closeModal();
      return;
    }
    if (common_vendor.isPromise(func)) {
      func.then((res) => {
        if (res)
          closeModal();
      }).catch((err) => {
        common_vendor.index.__f__("warn", "at uni_modules/tuniaoui-vue3/components/modal/src/composables/use-modal.ts:93", `[TnModal] some error occured: ${err}`);
      });
    } else if (func) {
      closeModal();
    }
  };
  const clickConfirm = () => {
    if (!confirmFunc.value) {
      closeModal();
      return;
    }
    const func = confirmFunc.value();
    const isPromiseOrBool = [common_vendor.isPromise(func), uni_modules_tuniaouiVue3_libs_lodash_isBoolean.isBoolean(func)].includes(true);
    if (!isPromiseOrBool) {
      closeModal();
      return;
    }
    if (common_vendor.isPromise(func)) {
      func.then((res) => {
        if (res)
          closeModal();
      }).catch((err) => {
        common_vendor.index.__f__("warn", "at uni_modules/tuniaoui-vue3/components/modal/src/composables/use-modal.ts:124", `[TnModal] some error occured: ${err}`);
      });
    } else if (func) {
      closeModal();
    }
  };
  return {
    openModal,
    showModal,
    title,
    content,
    showCancel,
    cancelText,
    cancelStyle,
    confirmText,
    confirmStyle,
    mask,
    maskClosable,
    cancelFunc,
    confirmFunc,
    clickCancel,
    clickConfirm
  };
};
exports.useModal = useModal;
//# sourceMappingURL=../../../../../../../.sourcemap/mp-weixin/uni_modules/tuniaoui-vue3/components/modal/src/composables/use-modal.js.map
