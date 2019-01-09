// pages/mine/order/express.js
const app = getApp();
var common = require('../../../utils/common.js');
Page({
  data: {

  },
  onLoad: function(options) {
    var that = this;
    wx.showNavigationBarLoading();
    wx.showLoading();
    wx.hideShareMenu();
    common.Post('prodlist/getOrderExpressInfo', {
      between_id: options.id
    }, function(res) {
      that.setData({
        data: res
      });
      wx.hideNavigationBarLoading();
      wx.hideLoading();
    });
  },
  onShow: function() {

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