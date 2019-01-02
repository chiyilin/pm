// pages/mine/attention/attention.js
var app = getApp();
var common = require('../../../utils/common.js');
var request = function(that, hidd = false) {
  wx.showNavigationBarLoading();
  common.Post('user/collection', {
    user_id: that.data.userinfo.user_id,
    limit: [that.data.start, 8]
  }, function(res) {
    var data = that.data.data;
    if (data) {
      that.setData({
        data: data.concat(res)
      })
    }

    if (hidd) {
      wx.stopPullDownRefresh();
    }
    wx.hideNavigationBarLoading();
  });
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    filepath: app.globalData.filepath,
    start: 1,
    data: []
  },
  toupper: function() {
    var that = this;
    wx.startPullDownRefresh({
      success: function() {
        setTimeout(function() {
          that.setData({
            data: [],
            start: 1
          });
          request(that, true);
        }, 500);
      }
    });
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
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          system: res
        })
      },
    })
    that.data.userinfo = common.getUserInfo();
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
  tolower: function() {
    var that = this;
    that.data.start++;
    request(that)
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