var app = getApp();
var common = require('../../utils/common.js');
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function() {
    wx.hideShareMenu()
    var that = this;
  },
  bindGetUserInfo: function(e) {
    var that = this;
    //用户按了允许授权按钮
    if (e.detail.userInfo) {
      var weixinInfo = e.detail.userInfo;
      console.log(getApp().globalData.openid)
      common.Post('login/register', {
        openid: getApp().globalData.openid,
        face: weixinInfo.avatarUrl,
        nick_name: weixinInfo.nickName,
        sex: weixinInfo.gender
      }, function(info) {
        console.log(info)
        var userinfo = JSON.stringify(info);
        wx.setStorageSync('userinfo', userinfo);
        //授权成功后，跳转进入小程序首页
        wx.navigateBack({
          delta: -1
        })
      });

    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入！',
        showCancel: false,
        confirmText: '返回授权',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
  //获取用户信息接口
  queryUsreInfo: function() {
    wx.request({
      url: getApp().globalData.apiurl + 'user/userinfo',
      data: {
        openid: getApp().globalData.openid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        getApp().globalData.userInfo = res.data;
      }
    })
  },
})