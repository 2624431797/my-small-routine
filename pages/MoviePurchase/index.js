Page({
  data: {
    movielist: [],
    bannerlist: [],
    userdata: [],
    usergood: [],
    movieId: 0,
    movieTitle: "",
    swiperIndex: 0,
    coverImg: "",
    tabContainerId: "wrap1",
    nowDateMD: "",
    nextDateMD: "",
    afterateMD: "",
    initDatePara: "",
    nowCity: ""
  },
  //初始化
  onLoad: function (options) {
    this.handlerGetMovieTitle()
    this.handlerGetNowDate()
    this.handlerGetInit(options.id)
    this.handlerGetInitDate()
    this.handlerGetInitGood(options.id)
    //城市
    let nowCity = wx.getStorageSync("AppCity")
    this.setData({nowCity})
    setTimeout(() => {
      this.setData({
        movieId: options.id,
        coverImg: this.data.bannerlist[0].imgUrl
      })
    }, 500)
  },
  //获取数据
  handlerGetInit(id){
    this.requestPost(
      `/api/v1/GetMoviePurchase/${id}`
      ).then(res => {
      this.setData({
        movielist: res.data.userlist,
        bannerlist: res.data.userlist.bannerImg
      })
    })
  },
  //获取购买日期数据
  handlerGetInitDate(){
    let para = this.data.initDatePara
    this.requestPost(
      `/api/v1/GetMoviePurchaseDate`, para
      ).then(res => {
      this.setData({
        userdata: res.data.userlist
      })
    })
  },
  //获取商品数据 
  handlerGetInitGood(id){
    this.requestPost(
      `/api/v1/GetMoviePurchaseGood`, id
      ).then(res => {
      this.setData({
        usergood: res.data.userlist
      })
    })
  },
  //获取影片标题
  handlerGetMovieTitle(){
    let movieTitle = wx.getStorageSync('movieTitle')
    this.setData({
      movieTitle
    })
    wx.setNavigationBarTitle({
      title: this.data.movieTitle
    })
  },
  //swiper滑动事件
  handlerBannerChange(e){
    this.setData({
      swiperIndex: e.detail.current
    })
    let {swiperIndex} = this.data
    this.requestPost(
      `/api/v1/GetMoviePurchase/${this.data.movieId}`
      ).then(res => {
      this.setData({
        movielist: res.data.userlist,
        bannerlist: res.data.userlist.bannerImg,
        coverImg: this.data.bannerlist[swiperIndex].imgUrl
      })
    })
  },
  //改变购买内容
  handlerChangeTabContainer(e){
    this.setData({
      tabContainerId: e.target.id,
      initDatePara: e.target.dataset.getdate
    })
    this.handlerGetInitDate()
  },
  //获得时间
  handlerGetNowDate(){
    this.setData({
      initDatePara: this.handlerGetDateStr(0),
      nowDateMD: this.handlerGetDateStr(0),
      nextDateMD: this.handlerGetDateStr(1),
      afterateMD: this.handlerGetDateStr(2)
    })
  },
  //封装时间方法
  handlerGetDateStr(AddDayCount){
    var dd = new Date()
    dd.setDate(dd.getDate() + AddDayCount)                                              //获取AddDayCount天后的日期
    var y = dd.getFullYear() 
    var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth()+1) : (dd.getMonth() + 1)    //获取当前月份的日期，不足10补0
    var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate()                       //获取当前几号，不足10补0
    return m + "-" + d
  }
})