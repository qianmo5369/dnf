<script lang="ts" setup>
import {useNamespace} from '../../../hooks'
import {waterFallProps} from './water-fall'
import {useWaterFall} from './composables'

const props = defineProps(waterFallProps)

const ns = useNamespace('water-fall')

const {componentId, resetWaterFall, processedRightData, processedLeftData } = useWaterFall(props)

defineExpose({
  /**
   * @description 重置瀑布流
   */
  reset: resetWaterFall,
})
</script>

// #ifdef MP-WEIXIN
<script lang="ts">
export default {
  options: {
    // 在微信小程序中将组件节点渲染为虚拟节点，更加接近Vue组件的表现(不会出现shadow节点下再去创建元素)
    virtualHost: true,
  },
}
</script>
// #endif

<template>
  <view :class="[ns.b()]">
    <!-- 左边数据 -->
    <view :id="`${componentId}-left`" class="left" :class="[ns.e('container')]">

      <view
        v-for="(item, index) in processedLeftData"
        :key="index"
        :class="[ns.e('item')]"
      >
        <template v-if="item.__is_insertion">
          <slot :name="item.slot"/>
        </template>
        <template v-else>
          <slot name="left" :item="item" :index="index"/>
        </template>
      </view>
    </view>
    <!-- 右边数据 -->
    <view
      :id="`${componentId}-right`"
      class="right"
      :class="[ns.e('container')]"
    >
      <view
        v-for="(item, index) in processedRightData"
        :key="index"
        :class="[ns.e('item')]"
      >
        <template v-if="item.__is_insertion">
          <slot :name="item.slot"/>
        </template>
        <template v-else>
          <slot name="right" :item="item" :index="index"/>
        </template>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import '../../../theme-chalk/src/water-fall.scss';
</style>
