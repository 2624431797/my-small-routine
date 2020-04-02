import { requestPost } from "../../services/index"

Page({
  data: {
    movielist: [],
  },
  //获取数据
  handlerInitMovieList(id){
    wx.showNavigationBarLoading()
    requestPost(
      `/api/v1/GetMovieDetail/${id}`
      ).then(res => {
      this.setData({
        movielist: res.data.userlist
      })
      wx.hideNavigationBarLoading()
      wx.setNavigationBarTitle({
        title: res.data.userlist.title
      })
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#ff5269',
        animation: {
          duration: 500,
          timingFunc: 'easeInOut'
        }
      })
    })
  },
  handlerRealm(){
    const approval = window.location.hash
    const billCode = approval.split("/")
    this.realm = billCode[2]
  },
  onLoad: function(options){
    this.handlerInitMovieList(options.id)
  }
})