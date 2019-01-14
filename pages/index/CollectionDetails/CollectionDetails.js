// pages/index/CllectionDetails/CllectionDetails.js
var app = getApp();
var common = require('../../../utils/common.js');
var WxParse = require('../../../wxParse/wxParse.js');
var number = require('../../../utils/number.js');
var request = function(that, isPullDown = false) {
  wx.showNavigationBarLoading();
  common.Post('product/details', {
    id: that.data.id ? that.data.id : 130,
    user_id: that.data.userinfo.user_id
  }, function(res) {
    WxParse.wxParse('details', 'html', res.data.product_introduce, that, 5);
    var rate = number.accDiv(res.setting.server_rate, 100)
    var money = number.accMul(res.data.product_money, rate).toFixed(2);
    that.setData({
      data: res.data,
      setting: res.setting,
      rate: rate,
      rateMoney: money,
      nowMoney: number.accAdd(money, res.data.product_money)
    });
    wx.hideNavigationBarLoading();
    if (isPullDown) {
      wx.stopPullDownRefresh();
    }
  });
}
Page({
  data: {
    filepath: app.globalData.filepath,
    userinfo: common.getUserInfo(),
    countDownDay: 0,
    countDownHour: 0,
    countDownMinute: 0,
    countDownSecond: 0,
  },
  onLoad: function(options) {
    var that = common.that = this;
    // common.style();
    common.globalData = app.globalData;
    if (!common.checkAuthLogin(true)) {
      common.login();
    }
    that.data.id = options.id
  },
  onReady: function() {
    var that = this;
    console.log(that.data.data)
    var totalSecond = that.data.data.product_end_time - Date.parse(new Date()) / 1000;
    var interval = setInterval(function() {
      // 秒数
      var second = totalSecond;
      // 天数位
      var day = Math.floor(second / 3600 / 24);
      var dayStr = day.toString();
      if (dayStr.length == 1) dayStr = '0' + dayStr;
      // 小时位
      var hr = Math.floor((second - day * 3600 * 24) / 3600);
      var hrStr = hr.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;
      // 分钟位
      var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;
      // 秒位
      var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;
      this.setData({
        countDownDay: dayStr,
        countDownHour: hrStr,
        countDownMinute: minStr,
        countDownSecond: secStr,
      });
      totalSecond--;
      if (totalSecond < 0) {
        clearInterval(interval);
        wx.showToast({
          title: '活动已结束',
        });
        this.setData({
          countDownDay: '00',
          countDownHour: '00',
          countDownMinute: '00',
          countDownSecond: '00',
        });
      }
    }.bind(this), 1000);
  },
  showRule: function() {
    var that = this;
    this.setData({
      isRuleTrue: true,
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
  settime: function() {
    var that = this;
    common.Post('Offerprice/createtime', {
      product_id: that.data.data.product_id,
      user_id: that.data.userinfo.user_id,
    }, function(e) {
      console.log(e)
    })
  },
  //定时出价
  showtime: function() {
    this.setData({
      isTimeTrue: true,
    })
  },
  //关闭规则提示
  hideRule: function() {
    this.setData({
      isTimeTrue: false,
      isRuleTrue: false
    })
  },
  //点击出价
  bidding: function() {
    var that = this;
    common.Post('offerprice/create', {
      user_id: that.data.userinfo.user_id,
      product_id: that.data.data.product_id,
      offer_money: that.data.data.product_money,
    }, function(res) {
      wx.showToast({
        title: '出价成功！',
        success: function() {

        }
      })
    })
  },
  /**
   * 代理出价
   */
  agent: function() {
    var that = this;
    common.Post('offerprice/createagent', {
      user_id: that.data.userinfo.user_id,
      product_id: that.data.data.product_id,
      offer_money: that.data.data.product_money,
    }, function(res) {
      wx.showToast({
        title: '代理出价成功！'
      })
    })
  },
  /**
   * 收藏/取消收藏
   */
  prodCollection: function(e) {
    wx.showLoading()
    var that = this;
    var param = {
      user_id: that.data.userinfo.user_id,
      product_id: that.data.data.product_id,
      isdel: e.currentTarget.dataset.isdel
    };
    common.Post('user/prodCollection', param, function(res) {
      if (res.msg == 'del') {
        var msg = '已取消！';
        var status = 0;
      } else {
        var msg = '关注成功！';
        var status = 1;
      }
      that.data.data.user_collection_count = status;
      that.setData({
        data: that.data.data
      });
      wx.showToast({
        title: msg
      });
      wx.hideLoading();
    });
  },
  /**
   * 一口价购买
   */
  nowBuy: function() {
    var that = this;
    console.log(that.data.data.product_id);
    wx.navigateTo({
      url: '/pages/mine/choose/choose?id=' + that.data.data.product_id,
    });
  },
  onShow: function() {
    var that = this;
    request(that);
  },

  /**
   * 出价记录
   */
  record: function() {
    wx.navigateTo({
      url: "/pages/index/BidRecord/BidRecord?id=" + this.data.data.product_id,
    })
  },
  /* 点击减号 */
  bindMinus: function() {
    var that = this;
    if (that.data.data.product_money > 1) {
      //价格-1
      var product_money = number.accSub(that.data.data.product_money, 1);
    } else {
      return null;
    }
    var minusStatus = product_money <= 1 ? 'disabled' : 'normal';
    that.data.data.product_money = product_money;
    //服务费
    var rateMoney = number.accMul(that.data.rate, product_money).toFixed(2);
    //总价
    var nowMoney = number.accAdd(product_money, rateMoney)
    that.setData({
      data: that.data.data,
      minusStatus: minusStatus,
      nowMoney: nowMoney,
      rateMoney: rateMoney
    });
  },
  /* 点击加号 */
  bindPlus: function() {
    var that = this;
    //价格+1
    var product_money = number.accAdd(that.data.data.product_money, 1);
    that.data.data.product_money = product_money;
    //服务费
    var rateMoney = number.accMul(that.data.rate, product_money).toFixed(2);
    //总价
    var nowMoney = number.accAdd(product_money, rateMoney)
    that.setData({
      data: that.data.data,
      nowMoney: nowMoney,
      rateMoney: rateMoney
    });
  },
  /* 输入框事件 */
  bindManual: function(e) {
    var that = this;
    that.data.data.product_money = e.detail.value;
    //服务费
    var rateMoney = number.accMul(that.data.rate, that.data.data.product_money).toFixed(2);
    //总价
    var nowMoney = number.accAdd(that.data.data.product_money, rateMoney)
    that.setData({
      data: that.data.data,
      nowMoney: nowMoney,
      rateMoney: rateMoney
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this;
    request(that, true);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
})