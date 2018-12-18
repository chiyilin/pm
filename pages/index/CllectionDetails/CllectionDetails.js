// pages/index/CllectionDetails/CllectionDetails.js
var app = getApp();
var common = require('../../../utils/common.js');
var WxParse = require('../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    filepath: app.globalData.filepath
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
    that.data.id = options.id
  },
  showRule: function() {
    this.setData({
      isRuleTrue: true
    })
  },
  /**
   * 查看banner大图
   */
  bannerImage: function(e) {
    var that = this;
    var bannerArr = that.data.data.product_banner;
    var previewImage = [];
    bannerArr.forEach((value, index) => {
      previewImage.push(that.data.filepath + value.url);
    });
    wx.previewImage({
      urls: previewImage,
      current: that.data.filepath + previewImage[e.currentTarget.dataset.index]
    })
  },
  //关闭规则提示
  hideRule: function() {
    this.setData({
      isRuleTrue: false
    })
  },
  newBuy: function() {
    var that = this;
    common.Post('product/nowBuy', {
      id: that.data.product_id
    }, function(res) {
      var res = JSON.parse(res)
      console.log(res);
      wx.requestPayment({
        timeStamp: res.timeStamp,
        nonceStr: res.nonceStr,
        package: res.package,
        signType: res.signType,
        paySign: res.paySign,
        success: function(e) {
          wx.showToast({
            title: '购买成功！',
          })
        },
        complete: function(e) {
          console.log(e)
        }
      })
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
    common.Post('product/details', {
      id: 116
    }, function(res) {
      WxParse.wxParse('details', 'html', res.data.product_introduce, that, 5);
      that.setData({
        data: res.data
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
  record: function() {
    wx.navigateTo({
      url: "../BidRecord/BidRecord",
    })
  },
  /**0
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  bindMinus: function() {
    var num = this.data.num;
    // 如果大于1时，才可以减 
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态 
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回 
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 点击加号 */
  bindPlus: function() {
    var num = this.data.num;
    // 不作过多考虑自增1 
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态 
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回 
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 输入框事件 */
  bindManual: function(e) {
    var num = e.detail.value;
    // 将数值与状态写回 
    this.setData({
      num: num
    });
  }
})