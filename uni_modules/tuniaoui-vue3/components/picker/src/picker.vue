<script lang="ts" setup>
import TnPopup from '../../popup/src/popup.vue'
import { pickerEmits, pickerProps } from './picker'
import { usePicker, usePickerCustomStyle } from './composables'

const props = defineProps(pickerProps)
defineEmits(pickerEmits)

const {
  openPopup,
  showPicker,
  pickerData,
  currentPickerIndex,
  isPickerScrolling,
  closePopupEvent,
  pickerViewPickStartEvent,
  pickerViewPickerEndEvent,
  pickerViewChangeEvent,
  confirmEvent,
  cancelEvent,
  initDefaultPickerIndex,
  resetPickerIndexWithPosition,
} = usePicker(props)
const { ns, overlayOpacity, operationBtnClass, operationBtnStyle } =
  usePickerCustomStyle(props)

const resetPickerViewIndex = () => {
  initDefaultPickerIndex()
}

defineExpose({
  /**
   * @description: 重置选择器的值
   */
  resetPickerViewIndex,
  /**
   * @description: 重置指定位置选择器的值
   */
  resetPickerIndexWithPosition,
})
</script>

<template>
  <TnPopup
    v-model="openPopup"
    open-direction="bottom"
    :overlay="true"
    :overlay-opacity="overlayOpacity"
    :radius="0"
    :safe-area-inset-bottom="false"
    :z-index="zIndex"
    @close="closePopupEvent"
  >
    <view class="tn-u-safe-area" :class="[ns.b()]">
      <!-- 操作按钮 -->
      <view :class="[ns.e('operation'), ns.is('only-confirm', !showCancel)]">
        <view
          v-if="showCancel"
          :class="[operationBtnClass('cancel', false)]"
          :style="operationBtnStyle('cancel')"
          @tap.stop="cancelEvent"
        >
          <slot name="cancel">
            {{ props.cancelText }}
          </slot>
        </view>
        <view
          :class="[operationBtnClass('confirm', isPickerScrolling)]"
          :style="operationBtnStyle('confirm')"
          @tap.stop="confirmEvent"
        >
          <slot name="confirm">
            {{ props.confirmText }}
          </slot>
        </view>
      </view>

      <!-- 内容区域 -->
      <view :class="[ns.e('content')]">
        <picker-view
          v-if="showPicker"
          :class="[ns.e('picker-view')]"
          :value="currentPickerIndex"
          :indicator-style="`height: ${props.indicatorHeight || 44}px;`"
          indicator-class="tn-picker-indicator"
          :immediate-change="immediateChange"
          @change="pickerViewChangeEvent"
          @pickstart="pickerViewPickStartEvent"
          @pickend="pickerViewPickerEndEvent"
        >
          <picker-view-column
            v-for="(item, index) in pickerData"
            :key="index"
            :class="[ns.e('picker-view-column')]"
          >
            <view
              v-for="(dItem, dIndex) in item"
              :key="dIndex"
              :class="ns.e('content-item')"
            >
              <view
                class="tn-text-ellipsis-1"
                :class="ns.em('content-item', 'data')"
              >
                {{ dItem['label'] }}
              </view>
            </view>
          </picker-view-column>
        </picker-view>
      </view>
    </view>
  </TnPopup>
</template>

<style lang="scss" scoped>
@import '../../../theme-chalk/src/picker.scss';
</style>
