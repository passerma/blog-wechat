// pages/article/article.js
var translate = require('../../utils/util');
var fetch = require('../../utils/fetch');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		bligList: [],
		show: false,
		allClass: '',
		mainActiveIndex: 0,
		activeId: [],
		showSelect: [],
		searchData: '',
		max: 4,
		items: [{
			// 导航名称
			text: '分类',
			// 禁用选项
			disabled: false,
			// 该导航下所有的可选项
			children: [{
					// 名称
					text: '插件',
					// id，作为匹配选中状态的标识
					id: 1,
				},
				{
					text: 'nodejs',
					id: 2,
				},
				{
					text: '树莓派',
					id: 3,
				},
				{
					text: '关于',
					id: 4,
				}
			],
		}, {
			// 导航名称
			text: '排序',
			// 禁用选项
			disabled: false,
			// 该导航下所有的可选项
			children: [{
					// 名称
					text: '阅读多-少',
					// id，作为匹配选中状态的标识
					id: 'look desc',
				},
				{
					text: '阅读少-多',
					id: 'look',
				},
				{
					text: '评论多-少',
					id: 'commentNum desc',
				},
				{
					text: '评论少-多',
					id: 'commentNum',
				}
			],
		}, ],
		activeOrderId: [],
		orderData: '',
	},

	//#region 生命周期
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.showToast({
			title: '加载中',
			icon: 'loading',
			duration: 10000,
			mask: true
		})
		this.getBlogList('', '', '', () => {
			wx.hideToast();
		})
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},
	//#endregion

	//#region 页面处理
	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {
		const {
			searchData,
			allClass,
			orderData
		} = this.data;
		wx.showToast({
			title: '加载中',
			icon: 'loading',
			duration: 10000,
			mask: true
		})
		this.getBlogList(searchData, allClass, orderData, () => {
			wx.hideNavigationBarLoading();
			wx.stopPullDownRefresh();
			wx.hideToast();
		})
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	},
	//#endregion

	//#region 文章
	/**
	 * 获取文章
	 */
	getBlogList: function (keyword, classAll, order, callBack) {
		let that = this
		fetch(`blog/list?keyword=${keyword}&classAll=${classAll}&order=${order}`, {}, res => {
			const data = res.data
			callBack && callBack()
			if (res.ErrCode === 0) {
				let bligList = []
				for (let i = 0; i < data.length; i++) {
					const element = data[i];
					bligList.push({
						bgurl: element.bgurl,
						title: element.title,
						text: translate.translateText(element.text),
						class: element.class,
						id: element.id,
						look: element.look,
						commentNum: element.commentNum,
						createtime: translate.translateDate(element.createtime),
						beauti: element.beauti
					})
				}
				that.setData({
					bligList
				})
			}
		})
	},

	/** 
	 * 跳转文章
	 */
	toDetail: function (e) {
		let id = e.currentTarget.dataset.flag.id
		let url = `/pages/detail/detail?id=${id}`
		wx.navigateTo({
			url,
		})
	},

	/** 
	 * 清空所有
	 */
	clearAll: function () {
		const {
			mainActiveIndex,
			searchData
		} = this.data
		this.setData({
			orderData: '',
			activeId: [],
			allClass: '',
			showSelect: mainActiveIndex === 0 ? [] : ''
		})
		wx.showToast({
			title: '加载中',
			icon: 'loading',
			duration: 10000,
			mask: true
		})
		this.getBlogList(searchData, '', '', () => {
			wx.hideToast();
		})
	},
	//#endregion

	//#region 搜索
	/**
	 * 搜索
	 */
	onSearch: function (data) {
		const {
			allClass,
			orderData
		} = this.data;
		wx.showToast({
			title: '加载中',
			icon: 'loading',
			duration: 10000,
			mask: true
		})
		this.setData({
			searchData: data.detail
		})
		this.getBlogList(data.detail, allClass, orderData, () => {
			wx.hideToast();
		})
	},

	/**
	 * 取消
	 */
	onCancel: function () {
		const {
			allClass,
			orderData
		} = this.data;
		wx.showToast({
			title: '加载中',
			icon: 'loading',
			duration: 10000,
			mask: true
		})
		this.setData({
			searchData: ''
		})
		this.getBlogList('', allClass, orderData, () => {
			wx.hideToast();
		})
	},
	//#endregion

	//#region 弹出层
	showPopup() {
		this.setData({
			show: true
		});
	},

	onClose() {
		this.setData({
			show: false
		});
	},
	//#endregion

	//#region 筛选
	onClickNav({
		detail = {}
	}) {
		const {
			activeId,
			orderData
		} = this.data
		let index = detail.index || 0
		this.setData({
			mainActiveIndex: detail.index || 0,
			showSelect: index === 0 ? activeId : orderData
		});
	},

	onClickItem({
		detail = {}
	}) {
		const {
			activeId,
			items,
			searchData,
			mainActiveIndex,
			allClass,
			orderData
		} = this.data;
		if (mainActiveIndex === 0) {
			const index = activeId.indexOf(detail.id);
			if (index > -1) {
				activeId.splice(index, 1);
			} else {
				activeId.push(detail.id);
			}
			let value = []
			for (let i = 0; i < activeId.length; i++) {
				const element = activeId[i];
				value.push(items[0].children[element - 1].text)
			}
			let newAllClass = value.join('_')
			this.setData({
				activeId,
				allClass: newAllClass,
				showSelect: activeId
			});
			wx.showToast({
				title: '加载中',
				icon: 'loading',
				duration: 10000,
				mask: true
			})
			this.getBlogList(searchData, newAllClass, orderData, () => {
				wx.hideToast();
			})
		} else {
			wx.showToast({
				title: '加载中',
				icon: 'loading',
				duration: 10000,
				mask: true
			})
			let newOrderData = orderData === detail.id ? '' : detail.id
			this.getBlogList(searchData, allClass, newOrderData, () => {
				wx.hideToast();
			})
			this.setData({
				orderData: newOrderData,
				showSelect: newOrderData
			})
		}
	},
	//#endregion
})