<template>
	<!--本文件由FirstUI授权予陈*强（会员ID：5 1 7）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<scroll-view class="fui-tabs__scrollbox"
		:class="{'fui-tabs__fixed':isFixed && !isSticky,'fui-tabs__sticky':isSticky}" :scroll-with-animation="true"
		:scroll-x="scroll" :show-scrollbar="false" :scroll-into-view="scrollInto"
		:style="{background:background,zIndex:(isFixed || isSticky)?zIndex:1,top: isFixed || isSticky ? top + 'px' : 'auto'}">
		<view class="fui-scroll__view" :class="{'fui-tabs__full':!alignLeft}">
			<view v-for="(tab, index) in vals" :key="index" class="fui-tabs__item"
				:class="{'fui-tabs__full':!alignLeft}"
				:style="{paddingLeft:itemPadding+'rpx',paddingRight:itemPadding+'rpx'}" :id="tab.fui_s_id"
				@tap="switchTab(index)">
				<view class="fui-tabs__text-wrap"
					:class="{'fui-tabs__wrap-disabled':tab[disabledKey],'fui-tabs__item-column':direction==='column' && tab.icon}"
					:style="{height:height+'rpx'}">
					<view class="fui-tabs__line-wrap" :class="{'fui-tabs__line-center':center}"
						:style="{bottom:bottom +'rpx',left:`-${padding}rpx`,right:`-${padding}rpx`}" v-if="isSlider">
						<view class="fui-tabs__ac-line"
							:class="{'fui-tabs__line-short':short,'fui-tabs__full':!short,'fui-tabs__slider-color':!getSliderBgColor}"
							:style="{height:sliderHeight+'rpx',background:getSliderBgColor,borderRadius:sliderRadius==-1?sliderHeight+'rpx':sliderRadius+'rpx',transform: `scale(${tabIndex===index?(isNvue?1:scale):(isNvue?0.00001:0)})`}">
						</view>
					</view>
					<image class="fui-tabs__icon" :class="{'fui-tabs__icon-column':direction==='column'}"
						:src="tabIndex===index && tab.selectedIcon?tab.selectedIcon:tab.icon" v-if="tab.icon">
					</image>
					<!-- #ifdef APP-NVUE -->
					<view class="fui-tabs__text">
						<text
							:style="{fontSize:selectedSize+'rpx',fontWeight:tabIndex===index?selectedFontWeight:fontWeight,height:height+'rpx',lineHeight:height+'rpx'}"
							style="opacity: 0;">{{tab[nameKey]}}</text>
						<text class="fui-tabs__text-nvue"
							:class="{'fui-tabs__selected-color':!getSelectedColor && tabIndex===index,'fui-tabs__text-color':!color && tabIndex!==index}"
							:style="{fontSize:(tabIndex===index && isNvue? selectedSize:size)+'rpx',color:tabIndex===index?getSelectedColor:color,fontWeight:tabIndex===index?selectedFontWeight:fontWeight,height:height+'rpx',lineHeight:height+'rpx'}">{{tab[nameKey]}}</text>
						<text
							:class="{'fui-tabs__badge-color':!getBadgeBgColor,'fui-tabs__badge-dot':isDot,'fui-tabs__badge':!isDot}"
							:style="{color:badgeColor,background:getBadgeBgColor,top:getTop+'rpx'}"
							v-if="tab[badgeKey]">{{isDot?'':tab[badgeKey]}}</text>
					</view>

					<!-- #endif -->
					<!-- #ifndef APP-NVUE -->
					<!--vue3中text嵌套text使用v-if会显示v-if文本-->
					<view class="fui-tabs__text"
						:class="{'fui-tabs__selected-color':!getSelectedColor && tabIndex===index,'fui-tabs__text-color':!color && tabIndex!==index}"
						:style="{fontSize:(tabIndex===index && isNvue? selectedSize:size)+'rpx',color:tabIndex===index?getSelectedColor:color,fontWeight:tabIndex===index?selectedFontWeight:fontWeight,transform:`scale(${tabIndex===index && !isNvue?scale:1})`}">
						{{tab[nameKey]}}<text
							:class="{'fui-tabs__badge-color':!getBadgeBgColor,'fui-tabs__badge-dot':isDot,'fui-tabs__badge':!isDot}"
							:style="{color:badgeColor,background:getBadgeBgColor}"
							v-if="tab[badgeKey]">{{isDot?'':tab[badgeKey]}}</text>
					</view>
					<!-- #endif -->
				</view>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	export default {
		name: 'fui-tabs',
		emits: ['change'],
		// #ifdef MP-WEIXIN
		options: {
			virtualHost: true
		},
		// #endif
		props: {
			// 标签页数据源
			tabs: {
				type: Array,
				default () {
					return []
				}
			},
			nameKey: {
				type: String,
				default: 'name'
			},
			badgeKey: {
				type: String,
				default: 'badge'
			},
			disabledKey: {
				type: String,
				default: 'disabled'
			},
			// 当前选项卡
			current: {
				type: Number,
				default: 0
			},
			// 是否可以滚动
			scroll: {
				type: Boolean,
				default: false
			},
			// tab高度 rpx
			height: {
				type: [Number, String],
				default: 96
			},
			background: {
				type: String,
				default: '#fff'
			},
			//字体大小
			size: {
				type: [Number, String],
				default: 28
			},
			//字体颜色
			// #ifdef APP-NVUE
			color: {
				type: String,
				default: '#7F7F7F'
			},
			// #endif
			// #ifndef APP-NVUE
			color: {
				type: String,
				default: ''
			},
			// #endif
			//选中前字重
			fontWeight: {
				type: [Number, String],
				default: 'normal'
			},
			//仅Nvue端生效，代替scale属性
			selectedSize: {
				type: [Number, String],
				default: 32
			},
			//选中后字体颜色
			selectedColor: {
				type: String,
				default: ''
			},
			//选中后字重
			selectedFontWeight: {
				type: [Number, String],
				default: 500
			},
			//选中后字体缩放倍数
			//Nvue端 Android 暂不支持设置overflow:visible，放大后文字超出部分被隐藏
			scale: {
				type: [Number, String],
				default: 1.2
			},
			badgeColor: {
				type: String,
				default: '#fff'
			},
			badgeBackground: {
				type: String,
				default: ''
			},
			isDot: {
				type: Boolean,
				default: false
			},
			isSlider: {
				type: Boolean,
				default: true
			},
			//滑块高度
			sliderHeight: {
				type: [Number, String],
				default: 5
			},
			//滑块背景颜
			sliderBackground: {
				type: String,
				default: ''
			},
			//滑块 radius
			sliderRadius: {
				type: [Number, String],
				default: -1
			},
			//滑块左右padding值
			padding: {
				type: [Number, String],
				default: 0
			},
			//滑块bottom
			bottom: {
				type: [Number, String],
				default: 0
			},
			//滑块是否固定为较短的长度45rpx
			short: {
				type: Boolean,
				default: true
			},
			//滑块是否居中显示
			center: {
				type: Boolean,
				default: false
			},
			//是否固定
			isFixed: {
				type: Boolean,
				default: false
			},
			//吸顶效果，为true时isFixed失效
			isSticky: {
				type: Boolean,
				default: false
			},
			//isFixed或isSticky为true时，tabs top值 px
			// #ifndef H5
			top: {
				type: [Number, String],
				default: 0
			},
			// #endif
			// #ifdef H5
			top: {
				type: [Number, String],
				default: 44
			},
			// #endif
			//当数据不满一屏时，item项是否靠左对齐，默认均分铺满
			alignLeft: {
				type: Boolean,
				default: false
			},
			//tabs item项排列方式：row、column
			direction: {
				type: String,
				default: 'row'
			},
			itemPadding: {
				type: [Number, String],
				default: 32
			},
			zIndex: {
				type: [Number, String],
				default: 996
			}
		},
		watch: {
			tabs(vals) {
				this.initData(vals)
			},
			current(newVal, oldVal) {
				this.switchTab(newVal);
			}
		},
		created() {
			this.initData(this.tabs)
		},
		computed: {
			// #ifdef APP-NVUE
			getTop() {
				const height = Number(this.height) - Number(this.selectedSize)
				return height / 2
			},
			// #endif
			getSelectedColor() {
				let color = this.selectedColor
				// #ifdef APP-NVUE
				if (!color || color === true) {
					const app = uni && uni.$fui && uni.$fui.color;
					color = (app && app.primary) || '#465CFF';
				}
				// #endif
				return color
			},
			getSliderBgColor() {
				let color = this.sliderBackground
				// #ifdef APP-NVUE
				if (!color || color === true) {
					const app = uni && uni.$fui && uni.$fui.color;
					color = (app && app.primary) || '#465CFF';
				}
				// #endif
				return color
			},
			getBadgeBgColor() {
				let color = this.badgeBackground
				// #ifdef APP-NVUE
				if (!color || color === true) {
					const app = uni && uni.$fui && uni.$fui.color;
					color = (app && app.danger) || '#FF2B2B';
				}
				// #endif
				return color
			}
		},
		data() {
			let isNvue = false;
			// #ifdef APP-NVUE
			isNvue = true;
			// #endif
			return {
				vals: [],
				scrollInto: '',
				tabIndex: 0,
				isNvue: isNvue
			};
		},
		methods: {
			getId() {
				return `fui_${Math.ceil(Math.random() * 10e5).toString(36)}`
			},
			initData(vals) {
				if (vals && vals.length > 0) {
					if (typeof vals[0] === 'object') {
						vals.map(item => {
							const scrollId = this.getId()
							item.fui_s_id = scrollId;
						});
					} else {
						//字符串
						vals = vals.map(item => {
							const scrollId = this.getId()
							return {
								[this.nameKey]: item,
								fui_s_id: scrollId
							}
						})
					}
					this.vals = vals;
					this.$nextTick(() => {
						setTimeout(() => {
							this.switchTab(this.current)
						}, 50)
					})
				}
			},
			switchTab(index) {
				const item = {
					...this.vals[index]
				}
				if (this.tabIndex === index || item[this.disabledKey]) return;
				this.tabIndex = index;
				let scrollIndex = index - 1 < 0 ? 0 : index - 1;
				this.scrollInto = this.vals[scrollIndex].fui_s_id;
				delete item.fui_s_id;
				this.$emit('change', {
					index: index,
					...item
				})
			}
		}
	};
</script>

<style scoped>
	/* #ifndef APP-NVUE */
	::-webkit-scrollbar {
		width: 0 !important;
		height: 0 !important;
		color: transparent !important;
		display: none;
	}

	/* #endif */
	.fui-tabs__scrollbox {
		/* #ifndef APP-NVUE */
		width: 100%;
		/* #endif */
		flex: 1;
		flex-direction: row;
		overflow: hidden;
	}

	.fui-tabs__fixed {
		position: fixed;
		left: 0;
		right: 0;
	}

	.fui-tabs__sticky {
		position: sticky;
		left: 0;
		right: 0;
	}

	.fui-scroll__view {
		/* #ifndef APP-NVUE */
		min-width: 100%;
		white-space: nowrap;
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
	}


	.fui-tabs__item {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-shrink: 0;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		position: relative;

	}

	.fui-tabs__full {
		flex: 1;
	}

	.fui-tabs__text-wrap {
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
		z-index: 3;
	}

	.fui-tabs__wrap-disabled {
		/* #ifdef H5 */
		cursor: not-allowed;
		/* #endif */
		opacity: 0.5;
	}

	.fui-tabs__icon {
		width: 40rpx;
		height: 40rpx;
		margin-right: 12rpx;
	}

	.fui-tabs__item-column {
		flex-direction: column !important;
	}

	.fui-tabs__icon-column {
		margin-right: 0 !important;
		margin-bottom: 8rpx;
	}

	.fui-tabs__text {
		/* #ifndef APP-NVUE */
		white-space: nowrap;
		display: block;
		transition: transform 0.2s linear;
		z-index: 3;
		/* #endif */
		/* #ifdef APP-NVUE */
		flex-wrap: nowrap;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		/* #endif */
		position: relative;
	}

	/* #ifdef APP-NVUE */
	.fui-tabs__text-nvue {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		text-align: center;
	}

	/* #endif */

	.fui-tabs__badge {
		height: 36rpx;
		padding: 0 12rpx;
		color: #FFFFFF;
		font-size: 24rpx;
		line-height: 36rpx;
		border-radius: 100px;
		position: absolute;
		/* #ifndef APP-NVUE */
		min-width: 36rpx !important;
		display: flex;
		box-sizing: border-box;
		right: -32rpx;
		top: -18rpx;
		z-index: 10;
		/* #endif */
		/* #ifdef APP-NVUE */
		right: 0;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		transform: scale(0.9);
	}

	.fui-tabs__badge-dot {
		height: 8px !important;
		width: 8px !important;
		/* #ifdef APP-NVUE */
		border-radius: 100px;
		/* #endif */
		position: absolute;
		/* #ifndef APP-NVUE */
		display: inline-block;
		right: -6px;
		top: -3px;
		border-radius: 50%;
		z-index: 10;
		/* #endif */
		/* #ifdef APP-NVUE */
		right: 0;
		/* #endif */
	}

	.fui-tabs__line-wrap {
		position: absolute;
		border-radius: 2px;
		z-index: 2;
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	.fui-tabs__line-center {
		justify-content: center;
		left: 0;
	}

	.fui-tabs__ac-line {
		transition: transform 0.2s linear;
	}

	.fui-tabs__line-short {
		width: 45rpx !important;
	}

	/* #ifndef APP-NVUE */
	.fui-tabs__selected-color {
		color: var(--fui-color-primary, #465CFF) !important;
	}

	.fui-tabs__text-color {
		color: var(--fui-color-subtitle, #7F7F7F) !important;
	}

	.fui-tabs__slider-color {
		background: var(--fui-color-primary, #465CFF) !important;
	}

	.fui-tabs__badge-color {
		background: var(--fui-color-danger, #FF2B2B) !important;
	}

	/* #endif */
</style>