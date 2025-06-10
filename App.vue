<script>
	import ws from './util/ws.js'
	export default {
		// onLaunch: function() {
		// 	console.log('App Launch')
		// },
		onLaunch() {
			const token = uni.getStorageSync('token');
			    if (token) {
			      ws.connect(token);
			      uni.$ws = ws; // ✅ 全局挂载
			      console.log('[WS] 全局挂载成功');
			    } else {
			      console.warn('[WS] 无 token，未连接');
			    }
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	/* 全局样式 */
	/* 	@import '@tuniao/tn-style/dist/uniapp/index.css';
	@import '@tuniao/tn-icon/dist/index.css'; */
	@import '@/uni_modules/tuniaoui-vue3/index.css';

	/* 底部安全边距 start*/
	.tn-tabbar-height {
		min-height: 120rpx;
		height: calc(140rpx + env(safe-area-inset-bottom) / 2);
		height: calc(140rpx + constant(safe-area-inset-bottom));
	}
</style>