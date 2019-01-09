// pages/mine/card/card.js
var app = getApp();
var common = require('../../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav_type: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = common.that = this;
    // common.style();
    common.globalData = app.globalData;
    if (!common.checkAuthLogin(true)) {
      common.login();
    }
    if (options.nav_type == 2) {
      that.setData({
        nav_type: 2
      })
    }
    if (options.need_money) {
      that.setData({
        need_money: options.need_money
      })
    }
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
    wx.showLoading();
    wx.showNavigationBarLoading();
    var that = this;
    var userinfo = common.getUserInfo();
    common.Post('coupon/index', {
      user_id: userinfo.user_id,
      need_money: that.data.need_money ? that.data.need_money : null
    }, function(res) {
      that.setData({
        data: res.data
      });
      wx.hideLoading();
      wx.hideNavigationBarLoading();
    })
  },
  useCoupon: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.setStorageSync('coupon_id', id);
    if (that.data.nav_type == 1) {
      wx.switchTab({
        url: '/pages/index/category/category',
      });
    } else {
      wx.navigateBack({
        delta: -1
      })
    }
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

  }
})