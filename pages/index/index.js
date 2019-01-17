//index.js
var app = getApp();
var common = require('../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    filepath: app.globalData.filepath,
    swiper: {
      autoplay: true,
      interval: 3000,
      duration: 1000,
    },

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
    var that = common.that = this;
    // common.style();
    common.globalData = app.globalData;
    if (!common.checkAuthLogin(true)) {
      common.login();
    }
  },
  search: function(e) {
    wx.navigateTo({
      url: '/pages/index/screen/screen?searchKey=' + e.detail.value,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    common.Post('index/index', {}, function(res) {
      that.setData({
        banner: res.banner,
        collection: res.collection,
        shareProd: res.shareProd,
        article: res.article,
        navData: res.navData,
      })
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  more: function() {
    wx.navigateTo({
      url: "/pages/article/list/list",
    })
  },
  collection: function() {
    wx.navigateTo({
      url: "/pages/collection/collection",
    })
  },
  colldetails: function(e) {
    wx.navigateTo({
      url: "/pages/collection/coll-details/coll-details?id=" + e.currentTarget.dataset.id,
    })
  },
  cate: function() {
    wx.switchTab({
      url: "/pages/index/category/category",
    })
  },
  CollectionDetails: function(e) {
    wx.navigateTo({
      url: "/pages/index/CollectionDetails/CollectionDetails?id=" + e.currentTarget.dataset.id,
    })
  },
  articleDetails: function(e) {

    wx.navigateTo({
      url: "/pages/article/details/details?id=" + e.currentTarget.dataset.id,
    })
  },
  /**
   * 自定义跳转
   */
  navDefine: function(e) {
    var url = e.currentTarget.dataset.url;
    if (!url) {
      return null;
    }
    wx.navigateTo({
      url: url,
      fail: function(res) {
        wx.switchTab({
          url: url,
        })
      }
    })
  }
})