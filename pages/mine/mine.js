// pages/mine/mine.js
var app = getApp();
var common = require('../../utils/common.js');
var request = function(that, hidd) {
  common.Post('user/userinfo', {
    user_id: that.data.userinfo.user_id
  }, function(data) {
    that.setData({
      userinfo: data
    })
    wx.setStorageSync('userinfo', JSON.stringify(data))
    if (hidd) {
      wx.stopPullDownRefresh();
    }
  });
}
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
    that.setData({
      userinfo: common.getUserInfo()
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
    request(that);
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
    var that = this;
    request(that, true);
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
  pay: function() {
    wx.navigateTo({
      url: "paid/paid",
    })
  },
  attention: function() {
    wx.navigateTo({
      url: "attention/attention",
    })
  },
  card: function() {
    wx.navigateTo({
      url: "card/card",
    })
  },
  note: function() {
    wx.navigateTo({
      url: "TransactionRecords/TransactionRecords",
    })
  },
})