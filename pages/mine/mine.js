// pages/mine/mine.js
var app = getApp();
var common = require('../../utils/common.js');
var request = function(that, hidd) {
  var userinfo = common.getUserInfo()
  common.Post('user/mine', {
    user_id: userinfo.user_id
  }, function(data) {
    that.setData({
      userinfo: data.userinfo,
      myProdInfo: data.myProdInfo
    })
    wx.setStorageSync('userinfo', JSON.stringify(data.userinfo))
    if (hidd) {
      wx.stopPullDownRefresh();
    }
  });
}
Page({
  data: {},
  onLoad: function(options) {
    var that = common.that = this;
    // common.style();
    common.globalData = app.globalData;
    if (!common.checkAuthLogin(true)) {
      console.log('没登录')
      common.login();
    }
  },
  onShow: function() {
    console.log('onshow')
    var that = this;
    request(that);
  },

  onPullDownRefresh: function() {
    var that = this;
    console.log('onPullDownRefresh')
    request(that, true);
  },
  pay: function(e) {
    wx.navigateTo({
      url: "/pages/mine/paid/paid?current=" + e.currentTarget.dataset.current,
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