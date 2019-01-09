// pages/mine/choose/choose.js
var app = getApp();
var common = require('../../../utils/common.js');
var number = require('../../../utils/number.js');
Page({
  data: {
    filepath: app.globalData.filepath,
  },
  onLoad: function(options) {
    wx.hideShareMenu();
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
        total_price = number.accAdd(total_price, e.product_money)
      });
      that.setData({
        total_price: total_price,
      });
      var setData = {
        data: data.data,
        countCoupon: data.countCoupon,
        defaultExpress: data.defaultExpress,
        defaultExpressLength: data.defaultExpress.length - 1,
      }
      var coupon_id = wx.getStorageSync('coupon_id');
      if (coupon_id) {
        common.Post('coupon/details', {
          id: coupon_id
        }, function(res) {
          var total_price = number.accSub(that.data.total_price, res.money);
          data.defaultExpress.forEach((event, key) => {
            if (event.current) {
              that.setData({
                total_price_express: number.accAdd(total_price, event.money),
                currentTab: key
              })
            }
          })
          that.setData({
            couponInfo: res,
            total_price: total_price
          });
        });
      } else {
        data.defaultExpress.forEach((event, key) => {
          if (event.current) {
            setData.total_price_express = number.accAdd(total_price, event.money)
            setData.currentTab = key
          }
        })
      }

      that.setData(setData)
    });
    if (wx.getStorageSync('address')) {
      that.setData({
        address: wx.getStorageSync('address')
      })
    }
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
   * 选择优惠券
   */
  chooseCoupon: function() {
    wx.navigateTo({
      url: '/pages/mine/card/card?nav_type=2&need_money=' + that.data.total_price,
    })
  },
  /**
   * 点击支付
   */
  submit: function() {
    var that = this;
    if (that.data.currentTab == undefined) {
      common.tips('请选择配送方式！')
      return null;
    }
    wx.showLoading();
    wx.showNavigationBarLoading();
    var userinfo = common.getUserInfo();
    var param = {
      user_id: userinfo.user_id,
      id: that.data.id,
      express_money: that.data.defaultExpress[that.data.currentTab].money,
      express_id: that.data.currentTab
    };
    if (that.data.couponInfo) {
      param.coupon_id = that.data.couponInfo.coupon_id
    }
    common.Post('product/nowBuy', param, function(res) {
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
    var currentTab = e.target.dataset.current
    if (this.data.currentTab === currentTab) {
      return false;
    } else {
      var total_price = that.data.total_price;
      var total_price_express = number.accAdd(total_price, that.data.defaultExpress[currentTab].money)
      that.setData({
        currentTab: currentTab,
        total_price_express: total_price_express
      })
    }
  },
  onUnload: function() {
    console.log('unload')
    wx.removeStorageSync('coupon_id')
  },
})