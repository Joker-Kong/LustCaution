const db = wx.cloud.database()
const photos = db.collection('photos')
const collection = db.collection('collection')
var app = getApp();
Page({

  data: {
  },

  onLoad: function() {
    this.loadImages();
  },

  /**
   * 加载首页图片
   */
  loadImages: function() {
    collection.where({
      openid: app.globalData.openId
    }).get().then(res1 => {
      photos.get().then(res2 => {

        for (var i = 0; i < res1.data.length; i++) {
          for (var j = 0; j < res2.data.length; j++) {
            if (res1.data[i].image == res2.data[j].image) {
              res2.data[j].like_color = 'red'
              res2.data[j].like_id = res1.data[i]._id
            }
          }
        }
        this.setData({
          images: res2.data
        })

      })
    })
  },
  /**
   * 收藏
   */
  onLike: function(event) {
    console.log(event.target.dataset.likeid)
    var str = "images[" + event.target.id + "].like_color"
    var likeId = "images[" + event.target.id + "].like_id"
    if (event.target.dataset.color == 'red') {
      collection.doc(event.target.dataset.likeid).remove().then(res2 => {
        this.setData({
          [str]: 'white'
        })
        wx.showToast({
          title: '取消收藏'
        })
      })
    } else {
      collection.add({
          data: {
            image: event.target.dataset.image
          }
        }).then(res => {
          this.setData({
            [likeId]:res._id,
            [str]: 'red'
          })
          wx.showToast({
            title: '收藏成功',
          })
        }).catch(console.error())
    }
  },
  onShareAppMessage: function(event) {
    if (event.from === 'button') {
      // 来自页面内转发按钮
      return {
        title: '性感美女',
        path: '/pages/index/index?image'+image
      }
    }
  },
  /**
   * 上来刷新
   */
  onReachBottom:function(){
    console.log(123)
    this.loadImages();
  }
})