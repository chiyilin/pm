// pages/mail/mail.js
var app = getApp();
var common = require('../../utils/common.js');
var app = getApp();
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

  },
  /**
   * 编辑邮箱
   */
  edit: function(e) {
    wx.navigateTo({
      url: '/pages/address/edit/edit?id=' + e.target.dataset.id,
    })
  },
  /**
   * 新增
   */
  creatMail: function() {
    wx.navigateTo({
      url: '/pages/address/add/add',
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
    var userinfo = common.getUserInfo();
    var that = this;
    common.Post('user/addrList', {
      user_id: userinfo.user_id
    }, function(res) {
      that.setData({
        data: res
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

  }
})