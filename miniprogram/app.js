//app.js
App({
  globalData:{
  },
  onLaunch: function () {
    wx.cloud.init({
      traceUser: true
    })
    wx.cloud.callFunction({
      name: 'login',
      success: res => {
        this.globalData.openid = res.result.userInfo.openId
      }
    })

  }
  
})
