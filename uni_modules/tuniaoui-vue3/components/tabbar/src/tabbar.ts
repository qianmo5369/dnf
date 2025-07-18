import { CHANGE_EVENT, UPDATE_MODEL_EVENT, ZIndex } from '../../../constants'
import { buildProps, definePropType, isNumber, isString } from '../../../utils'
import { tabbarBaseProps } from '../../base/common-props/tabbar'

import type { ExtractPropTypes } from 'vue'

export type TabbarSwitchBeforeSwitchFunc = (
  index: number
) => Promise<boolean> | boolean

export const tabbarProps = buildProps({
  ...tabbarBaseProps,
  /**
   * @description tabbar选中绑定的值
   */
  modelValue: {
    type: [String, Number],
    default: 0,
  },
  /**
   * @description tabbar高度
   */
  height: {
    type: String,
    default: '100rpx',
  },
  /**
   * @description 凸起按钮的最大尺寸，单位 px
   */
  bulgeMaxSize: {
    type: Number,
    default: 80,
  },
  /**
   * @description 凸起按钮的尺寸比例，取值范围 0 ~ 1
   */
  bulgeSizePercent: {
    type: Number,
    default: 0.75,
  },
  /**
   * @description tabbar背景颜色，如果需要设置毛玻璃的背景颜色，只能传递rgba的颜色值
   */
  bgColor: String,
  /**
   * @description 开启毛玻璃效果
   */
  frosted: Boolean,
  /**
   * @description 显示顶部阴影
   */
  topShadow: {
    type: Boolean,
    default: true,
  },
  /**
   * @description 切换时是否显示动画
   */
  switchAnimation: Boolean,
  /**
   * @description 是否固定在底部
   */
  fixed: Boolean,
  /**
   * @description 在固定之后是否开启占位空间
   */
  placeholder: {
    type: Boolean,
    default: true,
  },
  /**
   * @description 是否开启底部安全边距
   */
  safeAreaInsetBottom: {
    type: Boolean,
    default: true,
  },
  /**
   * @description 切换前回调
   */
  beforeSwitch: {
    type: definePropType<TabbarSwitchBeforeSwitchFunc>(Function),
  },
  /**
   * @description zIndex
   */
  zIndex: {
    type: Number,
    default: ZIndex.tabbar,
  },
  /**
   * @description 隐藏固定在底部的tabbar
   */
  hiddenFixedTabbar: {
    type: Boolean,
    default: false,
  },
})

export const tabbarEmits = {
  [UPDATE_MODEL_EVENT]: (val: string | number) =>
    isNumber(val) || isString(val),
  [CHANGE_EVENT]: (val: string | number) => isNumber(val) || isString(val),
}

export type TabbarProps = ExtractPropTypes<typeof tabbarProps>
export type TabbarEmits = typeof tabbarEmits
