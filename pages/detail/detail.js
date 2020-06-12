var translate = require('../../utils/util');
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
    let url = `https://www.passerma.com/api/blog/detail?id=${id}`
    wx.request({
      url,
      success: (res) => {
        let data = res.data.data
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
      }
    })
  },

  /**
   * 获取评论
   */
  getComments: function (id) {
    let that = this
    let url = `https://www.passerma.com/api/blog/detail/comments?id=${id}`
    wx.request({
      url,
      success: (res) => {
        let data = res.data.data
        that._dealComments(data)
      }
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
        data[i].createtime =  translate.translateDate(data[i].createtime, true),
        newFirstData.push(data[i])
      } else {
        if (!dataReplay[data[i].touser]) {
          dataReplay[data[i].touser] = []
        }
        let img = data[i].img || 'moren'
        data[i].img = `https://www.passerma.com/api/file/get/avatar?avatar=${img}`
        data[i].createtime =  translate.translateDate(data[i].createtime, true),
        dataReplay[data[i].touser].unshift(data[i])
      }
    }
    let comments = {
      newFirstData,
      dataReplay,
      allComments
    }
    that.setData({
      comments
    })
  }
})