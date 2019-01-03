// pages/mine/choose/choose.js
var app = getApp();
var common = require('../../../utils/common.js');
var number = require('../../../utils/number.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    filepath: app.globalData.filepath,
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
      id: options.id ? options.id : 130,
    })
  },
  /**
   * 选择收获地址
   */
  chooseAnotherAddr: function() {
    wx.navigateTo({
      url: '/pages/address/ChooseAddress/ChooseAddress',
    });
  },
  /**
   * 新增地址
   */
  addAddr: function(e) {
    wx.navigateTo({
      url: '/pages/address/add/add',
    })
  },
  /**
   * 商品详情
   */
  details: function(e) {
    wx.navigateTo({
      url: '/pages/index/CllectionDetails/CllectionDetails?id=' + e.currentTarget.dataset.id,
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
    var that = this;
    var userinfo = common.getUserInfo();
    common.Post('user/addrList', {
      user_id: userinfo.user_id
    }, function(address) {
      if (address.length != 0) {
        that.setData({
          address: wx.getStorageSync('address') ? wx.getStorageSync('address') : address[0]
        })
      }
    });
    common.Post('product/cartInfo', {
      id: that.data.id,
      user_id: userinfo.user_id
    }, function(data) {
      var total_price = 0;
      data.data.forEach(e => {
        total_price = total_price + Number(e.product_money)
      });
      that.setData({
        data: data.data,
        total_price: total_price,
        countCoupon: data.countCoupon
      })
    });
    if (wx.getStorageSync('address')) {
      that.setData({
        address: wx.getStorageSync('address')
      })
    }
    var coupon_id = wx.getStorageSync('coupon_id');
    if (coupon_id) {
      common.Post('coupon/details', {
        id: coupon_id
      }, function(res) {
        var total_price = number.accSub(that.data.total_price, res.money)
        that.setData({
          couponInfo: res,
          total_price: total_price
        });
      });
    }
  },
  /**
   * 选择优惠券
   */
  chooseCoupon: function() {
    wx.navigateTo({
      url: '/pages/mine/card/card?nav_type=2',
    })
  },
  submit: function() {
    wx.showLoading();
    wx.showNavigationBarLoading();
    var that = this;
    var userinfo = common.getUserInfo();
    common.Post('product/nowBuy', {
      user_id: userinfo.user_id,
      id: that.data.id,
      coupon_id: that.data.couponInfo.coupon_id
    }, function(res) {
      var res = JSON.parse(res)
      console.log(res);
      wx.hideLoading();
      wx.hideNavigationBarLoading();
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
              }, 1500)
            }
          })
        },
        complete: function(e) {
          console.log(e)
        }
      })
    })
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

  },
  showRule: function() {
    this.setData({
      isRuleTrue: true
    })
  },
  hideRule: function() {
    this.setData({
      isRuleTrue: true
    })
  },
  clickTab: function(e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  }
})