// pages/article/list/list.js
var App = getApp();
var common = require('../../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    isShow: true,
    filepath: App.globalData.filepath
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(wx.getStorageInfoSync('userInfo'))
    wx.showLoading({
      title: '加载中',
    });
    var that = this;
    common.Post('article/index', {}, function(data) {
      // for (var i = 0; i < data.length; i++) {
      //   data[i]['details'] = JSON.parse(data[i].article_details);
      // }
      that.setData({
        navbar: data.articleCate,
        article: data.article,
      });
      wx.hideLoading();
    });
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
    return common.share();
  },
  /**
   * 文章分类切换
   */
  navbarTap: function(e) {

    wx.showNavigationBarLoading();
    var that = this;
    var param = e.currentTarget.dataset;
    console.log(param.idx)
    common.Post('article/index', {
      article_cate: param.id
    }, function(data) {
      var list = data.article;
      // for (var i = 0; i < list.length; i++) {
      //   list[i]['details'] = JSON.parse(list[i].article_details);
      // }
      that.setData({
        article: list,
        currentTab: param.idx
      });
      wx.hideNavigationBarLoading();
    })
  },
  navbarTap1: function(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
  /**
   * 跳转至文章详情
   */
  details: function(e) {
    // console.log(e.currentTarget.dataset.id)
    // return null;
    wx.navigateTo({
      url: "/pages/article/details/details?id=" + e.currentTarget.dataset.id,
    })
  },
})