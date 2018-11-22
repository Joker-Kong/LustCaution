const db = wx.cloud.database()
const photos = db.collection('photos')
const collection = db.collection('collection')
var app = getApp();
Page({
  data: {
    images: [],
  },
  onLoad: function() {

    photos.get().then(res => {
      console.log('公库')
      console.log(res.data)
      collection.where({
        openId: app.globalData.openId
      }).get().then(res1 => {
        console.log('含有收藏')
        console.log(res1.data)
        var photos = []
        if (res1.data.length == 0) {
          this.setData({
            images: res.data
          })
         
        } else {
          for (var i = 0; i < res1.data.length; i++) {
            for (var j = 0; j < res.data.length; j++) {
              console.log('公库的每张照片')
              console.log(res.data)
              if (res.data[j].image != res1.data[i].image) {
                photos.push(res.data[j])
              }
            }
            console.log('筛选出合格的照片')
            console.log(photos)
            this.setData({
              images: photos
            })
          }
        }

        // photos = []
      })
      // this.setData({
      //   images: res.data
      // })
    })
  },
  onLike: function(event) {
    var str = "images[" + event.target.id + "].like_color"

    //判断是否收藏
    collection.where({
      image: event.target.dataset.image,
      openId: app.globalData.openId
    }).count().then(res => {
      if (res.total > 0) {
        //删除收藏
        collection.where({
          image: event.target.dataset.image,
          openId: app.globalData.openId
        }).field({
          _id: true
        }).get().then(res1 => {
          for (var i = 0; i < res1.data.length; i++) {
            collection.doc(res1.data[i]._id).remove()
              .then(res2 => {
                this.setData({
                  [str]: 'white'
                })
                wx.showToast({
                  title: '取消收藏'
                })
              })
          }
        }).catch(console.error())
      } else {
        //添加收藏
        collection.add({
          data: {
            image: event.target.dataset.image,
            openId: app.globalData.openId
          }
        }).then(res => {
          this.setData({
            [str]: 'red'
          })
          wx.showToast({
            title: '收藏成功',
          })
        }).catch(console.error())
      }
    })

  },
  onShareAppMessage: function(event) {
    if (event.from === 'button') {
      // 来自页面内转发按钮
      var image = event.target.dataset.image
      console.log(image)
      return {
        title: '性感美女',
        path: '/pages/index/index?' + image
      }
    }

  }
})