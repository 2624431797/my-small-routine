import { requestPost } from "../../services/index"

Page({
  data: {
    movielist: [],
    animate: "",
    animateFlag: true
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
      wx.setStorageSync('movieTitle', res.data.userlist.title)
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
  //动画
  handlerTogger(){
    let animation = wx.createAnimation({
      duration: 500,
      transformOrigin: '50% 50%',
      timingFunction: 'linear'
    })
    let {animateFlag} = this.data
    if(animateFlag){
      animation.translateY(-200).step()
      this.setData({animateFlag: false})
    }
    else{
      animation.translateY(0).step()
      this.setData({animateFlag: true})
    }
    this.setData({
      animate: animation.export()
    })
  },
  onLoad: function(options){
    this.handlerInitMovieList(options.id)
  }
})