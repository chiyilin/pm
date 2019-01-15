// pages/transaction/transaction.js
var app = getApp();
var common = require('../../utils/common.js');
var commonSelect = function(that) {
  common.Post('user/myTransaction', {
    user_id: common.getUserInfo().user_id,
    currentTab: that.data.currentTab,
  }, function(res) {
    that.setData({
      data: res
    })
  })
}
Page({
  data: {
    navbar: ['竞买', '关注', '委托'],
    currentTab: 0,
    filepath: app.globalData.filepath,
  },
  onLoad: function(options) {
    var that = common.that = this;
    // common.style();
    common.globalData = app.globalData;
    if (!common.checkAuthLogin(true)) {
      common.login();
    }
  },
  onShow: function() {
    var that = this;
    commonSelect(that);
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
  navbarTap: function(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    });
    commonSelect(this);
  },
})