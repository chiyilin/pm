// pages/mine/recharge/recharge.js
var app = getApp();
var common = require('../../../utils/common.js');
var number = require('../../../utils/number.js');
Page({
  data: {

  },
  onLoad: function(options) {
    var that = this;
    var userinfo = common.getUserInfo()
    common.Post('recharge/index', {
      user_id: userinfo.user_id
    }, function(res) {
      that.setData({
        data: res.setting,
        userInfo: res.userInfo,
      });
    });
  },
  bindinput: function(e) {
    var that = this;
    var value = e.detail.value;
    var userinfo = that.data.userInfo;
    if (userinfo.user_level == 2) {
      var proportion = that.data.data.lines_bad_proportion;
    } else if (userinfo.user_level == 1) {
      var proportion = that.data.data.lines_default_proportion;
    }
    that.setData({
      resultLines: number.accMul(proportion, value)
    })
  },
  onShow: function() {

  },


  bindCancel: function() {
    wx.navigateBack({})
  },
  /**
   * 点击充值
   */
  bindSave: function(e) {
    var that = this;
    var amount = e.detail.value.amount;
    if (amount == "" || amount * 1 <= 0) {
      wx.showModal({
        title: '错误',
        content: '请填写正确的充值金额',
        showCancel: false
      });
      return null;
    }
    console.log(amount)
    common.Post('recharge/unifiedOrder', {
      user_id: that.data.userInfo.user_id,
      total_price: amount,
      lines: that.data.resultLines,
    }, function(res) {
      var res = JSON.parse(res);
      wx.requestPayment({
        timeStamp: res.timeStamp,
        nonceStr: res.nonceStr,
        package: res.package,
        signType: res.signType,
        paySign: res.paySign,
        success: function(e) {
          wx.showToast({
            title: '购买成功！',
            success: function() {
              wx.hideNavigationBarLoading();
              setTimeout(function() {
                  wx.navigateBack({
                    delta: -1
                  })
                },
                1500)
            }
          })
        },
        complete: function(e) {
          console.log(e)
        }
      })
    })
  },
  onShareAppMessage: function() {

  },
})