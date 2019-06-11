//app.js
var dataObj = require("data/data.js")
App({
  onLaunch: function () {
    var storageData = wx.getStorageSync('postList');
    if(storageData){
      //如果postList缓存不存在
      var dataObj = require("data/data.js")
      wx.clearStorageSync();
      wx.setStorageSync('postList', dataObj.postList);
    }
  },
  //获取用户基本信息
  _getUserInfo:function(){
    var userInfoStorage = wx.getStorageSync('user');
    if(!userInfoStorage){
      //如果缓存中没有用户信息，那么获取用户信息
      var that = this;
      wx.login({
        success:function(){
          wx.getUserInfo({
            success:function(res){
              that.globalData.g_userInfo = res.userInfo
              //将用户的基本信息保存到缓存中
              wx.setStorageSync('user', res.userInfo)
            },
            fail:function(err){
              console.log(err);
            }
          })
        }
      })
    }else{
      //如果缓存中已经存在用户信息，那么将信息保存到全局变量中
      this.globalData.g_userInfo = userInfoStorage;
    }
  },
  //用于记录和管理音乐播放状态
  globalData:{
    g_isPlayingMusic:false,
    g_currentMusicPostId:null,//新增全局变量保存正播放音乐的id号
    doubanBase:'https://douban.uieee.com',//豆瓣url
    g_userInfo:null,//用户信息
  }
})