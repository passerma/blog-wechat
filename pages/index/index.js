var translate = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowDate: '',
    bligList: []
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
    this.getDate()
    this.getBlogList(() => {
      wx.hideToast()
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000,
      mask: true
    })
    this.getBlogList(() => {
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

  /**
   * 获取日期
   */
  getDate: function () {
    let a = new Date();
    let year = a.getFullYear();
    let month = a.getMonth();
    let data = a.getDate();
    let day = a.getDay();
    switch (day) {
      case 0:
        day = "日";
        break;
      case 1:
        day = "一";
        break;
      case 2:
        day = "二";
        break;
      case 3:
        day = "三";
        break;
      case 4:
        day = "四";
        break;
      case 5:
        day = "五";
        break;
      case 6:
        day = "六"
        break;
      default:
        day = "-"
    }
    let endDate = `${year}年${month + 1}月${data}日星期${day}，欢迎您来到PASSERMA小程序`
    this.setData({
      nowDate: endDate
    })
  },

  /**
   * 获取文章
   */
  getBlogList: function (callback) {
    let that = this
    let url = 'https://www.passerma.com/api/blog/listBeauti'
    wx.request({
      url,
      method: 'GET',
      success: function (res) {
        const data = res.data
        if (data.ErrCode === 0) {
          let bligList = []
          for (let i = 0; i < data.data.length; i++) {
            const element = data.data[i];
            bligList.push({
              bgurl: element.bgurl,
              title: element.title,
              text: translate.translateText(element.text),
              class: element.class,
              id: element.id,
              createtime: translate.translateDate(element.createtime)
            })
          }
          that.setData({
            bligList
          })
        }
        callback && callback()
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
  }
})