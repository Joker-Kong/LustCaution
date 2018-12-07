const db = wx.cloud.database()
const userInfo = db.collection('userInfo')
const collection = db.collection('collection')
var app = getApp();
Page({
  data: {
    avatarUrl: '/images/你瞅啥.png',
    nickName: '昵称',
    isRecord: false
  },

  onLoad: function() {
    // wx.showLoading({
    //   title: '数据加载中...'
    // })
    //显示用户信息
    this.showUserInfo();
    //显示用户收藏图片
    this.userLike();
  },
  
  showUserInfo:function(){
    //读取用户信息
    userInfo.where({
      _openid: app.globalData.openId
    }).get().then(res => {
      if (res.data.length > 0) {
        this.setData({
          isRecord: true,
          avatarUrl: res.data[0].userInfo.avatarUrl,
          nickName: res.data[0].userInfo.nickName,
          admin: app.globalData.openid
        })
      } else {
        this.setData({
          admin: app.globalData.userInfo.openId
        })
      }
    }).catch(console.log)
  },
  //获取用户授权信息
  onGotUserInfo: function(e) {
    var info = JSON.parse(e.detail.rawData)
    //添加用户信息到数据库
    userInfo.where({
        openId: app.globalData.openId
      }).count().then(res => {
        if (res.total <= 0) {
          userInfo.add({
            // data 字段表示需新增的 JSON 数据
            data: {
              userInfo: info
            }
          }).then(res => {
            this.setData({
              avatarUrl: info.avatarUrl,
              nickName:info.nickName,
              isRecord: true
            })
          })
            .catch(console.error)
        }
      }).catch(console.error)
  },
  //上传图片
  upLoad: function() {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        const tempFilePaths = res.tempFilePaths
        for (var i = 0; i < tempFilePaths.length; i++) {
          let randString = new Date().getTime() + '.png'
          wx.cloud.uploadFile({
            cloudPath: randString,
            filePath: tempFilePaths[i],
            success: res => {
              db.collection('photos').add({
                data: {
                  image: res.fileID,
                  like_color: '#ffffff'
                }
              }).then(res => {
                wx.showToast({
                  title: '上传成功',
                  icon: 'success'
                })
              })
            },
            fail: error => {
              wx.showToast({
                title: '上传失败',
                icon: 'fail'
              })
            }
          })
        }
      }
    })
  },
  
  userLike: function() {
    wx.showLoading({
      title: '数据加载中...'
    })
    collection.get().then(res =>{
      console.log(res)
      this.setData({
        images:res.data
      })
      wx.hideLoading({
        title: '数据加载成功'
      })
    })
  },
})