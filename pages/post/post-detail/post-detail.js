// pages/post/post-detail/post-detail.js
import {DBPost} from '../../../db/DBPost.js'
var app = getApp();
console.log(app);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlayingMusic:false
  },
  //阅读数+1
  addReadingTimes:function(){
    this.dbPost.addReadingTimes();
  },

  //点赞功能
  onUpTap(event){
      var newData = this.dbPost.up();

      this.setData({
        'post.upStatus':newData.upStatus,
        'post.upNum':newData.upNum
      }),
      this.animationUp.scale(2).step();
      this.setData({
        animationUp:this.animationUp.export()
      })
      setTimeout(function(){
        this.animationUp.scale(1).step();
        this.setData({
          animationUp:this.animationUp.export()
        })
      }.bind(this),500)
  },
  //评论功能
  onCommentTap:function(event){
    var id = event.currentTarget.dataset.postId;
    wx.navigateTo({
      url: '../post-comment/post-comment?id='+id
    })
  },
  //收藏功能
  onCollectionTap:function(event){
      //dbPost对象已在onLoad函数里保存到了thisb变量中,无须再次实例化
      var newData = this.dbPost.collect();

      //重新绑定数据.有选择的更新部分数据
      this.setData({
        'post.collectionStatus': newData.collectionStatus,
        'post.collectionNum': newData.collectionNum 
      })

      //交互反馈
      wx.showToast({
        title: newData.collectionStatus ? '收藏成功':'取消成功',
        duration:1000,
        icon:"success",
        mask:true//防止用户恶意点击s收藏图标
      })
  },

  onMusicTap:function(event){
    if(this.data.isPlayingMusic){
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: !this.data.isPlayingMusic
      })
      app.globalData.g_isPlayingMusic = false;
    }else{
      wx.pauseBackgroundAudio({
        dataUrl:this.postData.music.url,
        title:this.postData.music.title,
        coverImgUrl:this.postData.music.coverImg
      })
      this.setData({
        isPlayingMusic:true
      })

      app.globalData.g_isPlayingMusic = true;
    }
  },
  //设置音乐播放监听
  setMusicMonitor:function(){
    var that = this;
    wx.onBackgroundAudioStop(function(){
      that.setData({
        isPlayingMusic:false
      })
      app.globalData.g_isPlayingMusic = false;
    });
    wx.onBackgroundAudioPlay(function(){
      //只处理当前页面的音乐播放
      if(app.globalData.g_currentMusicPostId === that.postData.postId){
        that.setData({
          isPlayingMusic:true
        })
      }
      app.globalData.g_isPlayingMusic = true;
    });
    wx.onBackgroundAudioPause(function(){
      //只处理当前页面的音乐暂停
      if(app.globalData.g_currentMusicPostId === that.postData.postId){
        that.setData({
          isPlayingMusic:false
        })
      }
      app.globalData.g_isPlayingMusic = false;
    });
  },
  //初始化音乐播放图标状态
  initMusicStatus(){
    var currentPostId = this.postData.postId;
    if(app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === currentPostId){
      //如果全局播放的音乐是当前文章的音乐，就将图标状态设置成正在播放
      this.setData({
        isPlayingMusic: true
      })
    }else{
      this.setData({
        isPlayingMusic: false
      })
    }
  },
  //保存音乐id号
  onMusicTap:function(event){
    if(this.data.isPlayingMusic){
      //暂停音乐播放
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic:false
      })
      app.globalData.g_isPlayingMusic = false;
    }else{
      //播放音乐
      wx.playBackgroundAudio({
        dataUrl: this.postData.music.url,
        title:this.postData.music.title,
        coverImgUrl:this.postData.music.coverImg
      })
      this.setData({
        isPlayingMusic:true
      })
      app.globalData.g_isPlayingMusic = true;
      app.globalData.g_currentMusicPostId = this.postData.postId;
    }
  },
  //定义页面分享函数
  onShareAppMessage:function(){
    return {
      title:this.postData.title,
      desc:this.postData.content,
      path:'/pages/post/post-detail/post-detail'
    }
  },
  //实现点赞动画特效
  setAnimation:function(){
    //定义动画
    var animationUp = wx.createAnimation({
      timingFunction:'ease-in-out'
    })
    this.animationUp = animationUp
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var postId = options.id;
      this.dbPost = new DBPost(postId);
      this.postData = this.dbPost.getPostItemById().data;
      this.setData({
        post:this.postData
      })
    this.addReadingTimes();
    this.setMusicMonitor();
    this.initMusicStatus();
    this.setAnimation();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.postData.title,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.stopBackgroundAudio()
    this.setData({
      isPlayingMusic:false
    })
    //console.log('page is unload');
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})