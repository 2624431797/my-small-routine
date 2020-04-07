import { requestPost } from "../../services/index"

Page({
  data: {
    movielist: [],
    bannerlist: [],
    movieId: 0,
    movieTitle: "",
    swiperHeight: "",
    swiperIndex: 0,
    coverImg: ""
  },
  //获取数据
  handlerGetInit(id){
    requestPost(
      `/api/v1/GetMoviePurchase/${id}`
      ).then(res => {
      this.setData({
        movielist: res.data.userlist,
        bannerlist: res.data.userlist.bannerImg
      })
      wx.setNavigationBarTitle({
        title: this.data.movieTitle
      })
    })
  },
  //获取影片标题
  handlerGetMovieTitle(){
    let movieTitle = wx.getStorageSync('movieTitle')
    this.setData({
      movieTitle
    })
  },
  //swiper滑动事件
  handlerBannerChange(e){
    this.setData({
      swiperIndex: e.detail.current
    })
    let {swiperIndex} = this.data
    requestPost(
      `/api/v1/GetMoviePurchase/${this.data.movieId}`
      ).then(res => {
      this.setData({
        movielist: res.data.userlist,
        bannerlist: res.data.userlist.bannerImg,
        coverImg: this.data.bannerlist[swiperIndex].imgUrl
      })
    })
  },
  //初始化
  onLoad: function (options) {
    this.handlerGetMovieTitle()
    this.handlerGetInit(options.id)
    setTimeout(() => {
      this.setData({
        movieId: options.id,
        coverImg: this.data.bannerlist[0].imgUrl
      })
    }, 500)
  }
})