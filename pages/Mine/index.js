Page({
  data: {
    isAuthorization: false,
    AppUserInfo: null
  },
  //初始化
  onLoad(options){
    this.handlerGetUserInfo()
  },
  handlerGetUserInfo(){
    this.setData({
      isAuthorization: wx.getStorageSync("isAuthorization"),
      AppUserInfo: wx.getStorageSync("AppUserInfo")
    })
  }
})