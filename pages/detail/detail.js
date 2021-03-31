var translate = require('../../utils/util');
var fetch = require('../../utils/fetch');
const app = getApp();
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		detail: {},
		comments: {}
	},

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
		this.getDetail(options.id)
		this.getComments(options.id)
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

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

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

	/**
	 * 获取文章
	 */
	getDetail: function (id) {
		let that = this
		fetch(`blog/detail?id=${id}`, {}, (res) => {
			let data = res.data
			let result = app.towxml(data.content, 'html');
			let detail = {
				title: data.title,
				look: data.look,
				commentNum: data.commentNum,
				time: translate.translateDate(data.createtime, true),
				content: result
			}
			that.setData({
				detail
			})
			wx.hideToast()
		})
	},

	/**
	 * 获取评论
	 */
	getComments: function (id) {
		let that = this
		fetch(`blog/detail/comments?id=${id}`, {}, (res) => {
			that._dealComments(res.data)
		})
	},
	/** 
	 * 处理评论
	 */
	_dealComments: function (data) {
		let that = this
		let newFirstData = []
		let dataReplay = {}
		let allComments = {}
		for (let i = 0; i < data.length; i++) {
			allComments[data[i].id] = data[i]
			if (!dataReplay[data[i].id]) {
				dataReplay[data[i].id] = []
			}
			if (data[i].touser === '') {
				let img = data[i].img || 'moren'
				data[i].img = `https://www.passerma.com/api/file/get/avatar?avatar=${img}`
				data[i].createtime = translate.translateDate(data[i].createtime, true)
				data[i].comments = data[i].comments
				const imgArr = data[i].commentImg ? data[i].commentImg.split('-') : []
				let imgsDiv = []
				for (let i = 0; i < imgArr.length; i++) { // 生成评论图片
					const element = imgArr[i];
					if (element) {
						imgsDiv.push(`https://www.passerma.com/api/file/commentImg?img=${element}`)
						// imgsDiv.push(`http://localhost:7010/api/file/commentImg?img=${element}`)
					}
				}
				data[i].commentImg = imgsDiv
				newFirstData.push(data[i])
			} else {
				if (!dataReplay[data[i].touser]) {
					dataReplay[data[i].touser] = []
				}
				let img = data[i].img || 'moren'
				data[i].img = `https://www.passerma.com/api/file/get/avatar?avatar=${img}`
				data[i].createtime = translate.translateDate(data[i].createtime, true)
				data[i].comments = translate.translateComment(data[i].comments)
				dataReplay[data[i].touser].unshift(data[i])
			}
		}
		let comments = {
			newFirstData,
			dataReplay,
			allComments
		}
		console.log(newFirstData);

		that.setData({
			comments
		})
	},

	/**
	 * 预览图片
	 */
	preview: function (e) {
		let current = e.currentTarget.dataset.src
		let urls = e.currentTarget.dataset.list
		wx.previewImage({
			current, // 当前显示图片的http链接
			urls // 需要预览的图片http链接列表
	  })
	}
})