// pages/mine/TransactionRecords/TransactionRecords.js
var app = getApp();
var common = require('../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: true,
    currentTab: 0,
    tempFilePaths: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
  swichNav: function(e) {
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      var showMode = e.target.dataset.current == 0;
      this.setData({
        currentTab: e.target.dataset.current,
        isShow: showMode
      })
    }
  },

  chooseImage: function() {
    var that = this
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var tempFilePaths = res.tempFilePaths
        var temp = that.data.tempFilePaths;
        that.setData({
          tempFilePaths: temp.concat(tempFilePaths)
        })
      }
    })
  },

  /**
   * 删除图片
   */
  closeimg: function(res) {
    var index = res.currentTarget.dataset.index;
    var tempFilePaths = this.data.tempFilePaths
    tempFilePaths.splice(index, 1);
    console.log(this.data.tempFilePaths)
    this.setData({
      tempFilePaths: tempFilePaths
    })
  },
  /**
   * 预览已经上传的图片
   */
  previewImage: function(res) {
    var that = this;
    wx.previewImage({
      urls: that.data.tempFilePaths,
      current: that.data.tempFilePaths[res.currentTarget.dataset.index]
    })
  },
  /**
   * 表单提交
   */
  submit: function(e) {
    wx.showNavigationBarLoading();
    wx.showLoading({
      title: '上传中……',
    })
    var that = this;
    var param = e.detail.value;
    //表单验证
    if (!that.checkForm(param)) {
      return null;
    }
    var userinfo = common.getUserInfo();
    var data = {
      user_id: userinfo.user_id,
      entrust_name: param.entrust_name,
      entrust_phone: param.entrust_phone,
      entrust_content: param.entrust_content,
      entrust_type: that.data.currentTab + 1,
    };

    common.Post('entrust/create', data, function(data) {

      var tempFilePaths = that.data.tempFilePaths;
      if (tempFilePaths.length != 0) {
        var isUploads = 0;
        //循环上传图片
        for (var i = 0; i < tempFilePaths.length; i++) {
          if (tempFilePaths[i]) {
            wx.uploadFile({
              url: app.globalData.apiurl + 'entrust/uploadImage',
              filePath: tempFilePaths[i],
              name: 'image',
              formData: {
                sort: i + 1,
                entrust_id: data.entrust_id
              },
              success(res) {
                isUploads++;
                if (isUploads == tempFilePaths.length) {
                  that.tips();
                }
              }
            })
          }
        }
      } else {
        that.tips();
      }
    });
  },
  tips: function(e) {
    wx.hideNavigationBarLoading();
    wx.hideLoading();
    wx.showToast({
      title: '申请成功~',
      success: function() {
        setTimeout(function() {
          wx.navigateBack({
            delta: -1
          })
        }, 1500)
      }
    })
  },
  checkForm: function(e) {
    if (!e.entrust_content) {
      var tips = '请填写内容~'
    }
    if (!e.entrust_phone) {
      var tips = "请填写电话~";
    }
    if (!e.entrust_name) {
      var tips = '请填写姓名~';
    }
    if (e.entrust_phone) {
      var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!myreg.test(e.entrust_phone)) {
        var tips = "请填写正确格式的电话号码~";
      }
    }
    if (tips) {
      common.tips(tips);
      return false;
    } else {
      return 1;
    }
  },
})