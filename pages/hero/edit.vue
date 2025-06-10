<template>
	<view class="page-container">

		<fui-bottom-popup :show="showRoleSelect">

			<view class="role-select-popup">
				<view class="popup-header">选择角色</view>
				<view class="fui-icon__close" @tap="showRoleSelect = false">
					<TnIcon name="close" />
				</view>
				<scroll-view scroll-y class="role-group-scroll">
					<view v-for="group in heroList" :key="group.category" class="role-group">
						<text class="group-title">{{ group.name }}</text>
						<view class="role-list">
							<view class="role-item" v-for="role in group.heroes" :key="role.id"
								@click="selectRole(role)">
								<image class="role-avatar" :src="role.avatar" />
								<text class="role-name">{{ role.name }}</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</fui-bottom-popup>
		<view class="form">
			
			<view class="form-item">
				<text class="label">角色职业<text class="required">*</text></text>
				<view class="input-select" @click="showRoleSelect = true">
					<image v-if="selectedRole.avatar" class="form-avatar" :src="selectedRole.avatar" />
					<text>{{ selectedRole.name || '请选择职业' }}</text>
				</view>
			</view>

			<view class="form-item">
				<text class="label">角色昵称<text class="required">*</text></text>
				<input class="input" v-model="roleName" placeholder="请输入昵称" />
			</view>

			<view class="form-item">
				<text class="label">抗魔值 (万)<text class="required">*</text></text>
				<input class="input" type="number" v-model="resist" placeholder="抗魔值 比如3.2(单位万)"
					@input="onResistInput" />
			</view>

			<view class="button-group">
				<button class="save-btn" @click="saveRole">保存</button>
				<button v-if="isEdit" class="delete-btn" @click="deleteRole">删除</button>
			</view>
		</view>

	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app';
	import fuiBottomPopup from "@/components/fui-bottom-popup.vue"
	import TnIcon from '@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue'
	import Roles from '@/components/Roles.vue';

	const showRoleSelect = ref(false)
	const roleName = ref('')
	const resist = ref('')
	const selectedRole = ref({})
	const isEdit = ref(false)
	const userHero = ref({})
	const id = ref(null)


	const selectRole = (item) => {
		selectedRole.value = item
		// roleName.value = item.name;
		showRoleSelect.value = false
	}

	const saveRole = async () => {
		const value = parseFloat(resist.value)
		if (!selectedRole.value.name || !roleName.value || !resist.value) {
			return uni.showToast({
				title: '请填写完整信息',
				icon: 'none'
			})
		}
		if (isNaN(value) || value > 999) {
			return uni.showToast({
				title: '抗魔值不能大于999',
				icon: 'none'
			})
		}
		// console.log('保存', selectedRole.value, roleName.value, resist_power)

		const res = await uni.$http.post('/dungeon/saveUserHero', {
			id: id.value,
			hero_id: selectedRole.value.id,
			nickname: roleName.value,
			resist_power: resist.value
		})

		if (res.code === 1) {
			// heroList.value = res.data;
			uni.showToast({
				title: res.msg,
				icon: 'none'
			})
			
			setTimeout(()=>{
				uni.navigateBack()
			},1500)
			
		} else {
			uni.showToast({
				title: res.msg,
				icon: 'none'
			})
		}

	}

	const deleteRole = () => {
		console.log('删除角色')
	}

	const onResistInput = (e) => {
		let val = e.detail.value
		if (parseFloat(val) > 999) {
			resist.value = '999';
			// return false;
			// uni.showToast({ title: '抗魔值不能大于999', icon: 'none' })
		} else {
			resist.value = val
		}
	}



	onLoad((params) => {
		if (params.id) {
			uni.setNavigationBarTitle({
				title: '编辑角色'
			})
			isEdit.value = true;
			id.value = params.id;
			getUserHero(params.id)
		} else {
			uni.setNavigationBarTitle({
				title: '新增角色'
			})
		}
	})


	const heroList = ref([])

	const getHeroList = async () => {

		const res = await uni.$http.get('/dungeon/heroList')

		if (res.code === 1) {
			heroList.value = res.data;
		} else {
			uni.showToast({
				title: res.msg,
				icon: 'none'
			})
		}
	}

	const getUserHero = async (id) => {

		const res = await uni.$http.post('/dungeon/getUserHero', {
			id: id
		})

		if (res.code === 1) {
			// selectedRole.value = res.data;
			roleName.value = res.data.nickname;
			resist.value = res.data.resist_power;
			selectedRole.value = {
				id: res.data.hero_id,
				name: res.data.hero_name,
				avatar: res.data.hero_avatar
			}
		} else {
			uni.showToast({
				title: res.msg,
				icon: 'none'
			})
		}
	}


	onMounted(() => {
		getHeroList()
	})
</script>

<style scoped>
	.page-container {
		background: #fff;
		/* min-height: 100vh; */
	}

	.form {
		padding: 30rpx;
	}

	.form-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 10rpx;
		border-bottom: 1rpx solid #f2f2f2;

	}

	.label {
		font-size: 26rpx;
		color: #333;
		margin-bottom: 12rpx;
		display: block;
	}

	.required {
		color: red;
		margin-left: 8rpx;
	}

	.input,
	.input-select {
		height: 100rpx;
		/* background: #f7f8fa; */
		border-radius: 12rpx;
		padding: 20rpx;
		font-size: 25rpx;
		color: #333;
		text-align: right;
		/* border-radius: 50%; */
	}

	.input-select {
		color: #333 !important;
		display: flex;
		align-items: center;
		/* border: 1px solid #ddd; */
	}

	.form-avatar {
		width: 66rpx;
		height: 66rpx;
		border-radius: 50%;
		object-fit: cover;
		margin-right: 10rpx;
	}

	.button-group {
		/* display: flex;
		justify-content: space-between; */
		/* margin-top: 40rpx; */
		margin: 40rpx 0rpx;
	}

	.save-btn,
	.delete-btn {
		flex: 1;
		/* height: 80rpx; */
		padding: 5rpx 0;
		font-size: 28rpx;
		border-radius: 10rpx;
		text-align: center;
		color: #fff;
	}

	.save-btn {
		background-color: #1677ff;
		margin: 50rpx 0rpx;
		/* margin-right: 20rpx; */
	}

	.delete-btn {
		background-color: #fff;
		border: 1rpx solid #ccc;

		color: #333;
	}

	.role-list-popup {
		margin: 20rpx 0rpx;
		max-height: 400rpx;
		padding: 20rpx;
	}

	.role-option {
		padding: 24rpx;
		border-bottom: 1px solid #eee;
		font-size: 28rpx;
	}

	.role-select-popup {
		position: relative;
		/* height: 1000rpx; */
		display: flex;
		/* height: 80vh; */
		flex-direction: column;
		/* height: 800rpx;	 */
		/* max-height: 1000rpx; */
		/* min-height: 1000rpx; */
	}

	.popup-header {
		text-align: center;
		font-size: 30rpx;
		padding: 24rpx;
		color: #3366ff;
		border-bottom: 1rpx solid #eee;
	}

	.fui-icon__close {
		position: absolute;
		top: 24rpx;
		right: 54rpx;

	}

	.role-group-scroll {
		/* flex: 1; */
		/* height: 800rpx;	 */
		height: 70vh;
		padding: 20rpx;
	}

	.role-group {
		margin-bottom: 20rpx;
	}

	.group-title {
		font-size: 28rpx;
		font-weight: bold;
		margin-bottom: 16rpx;
		color: #333;
	}

	.role-list {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		/* justify-content: space-between; */
		/* gap: 20rpx 32rpx; */
		border-bottom: 1rpx solid #f2f2f2;
	}

	.role-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 120rpx;
		margin: 20rpx 0rpx;
	}

	.role-avatar {
		width: 86rpx;
		height: 86rpx;
		border-radius: 50%;
		object-fit: cover;
	}

	.role-name {
		margin-top: 8rpx;
		font-size: 24rpx;
		color: #444;
		text-align: center;
	}
</style>