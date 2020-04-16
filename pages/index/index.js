Page({
  data: {
    movielist: [],
    status: 0,
    page: 1,
    limit: 5,
    type: "nowing",
    isLoading: false,   //默认不加载数据
    hasMore: true,      //默认有更多数据
    scrollTop: 0
  },
  //切换类型
  handlerChangeType(e){
    let type = e.currentTarget.dataset.type
    if(type === this.data.type) return false
    this.setData({
      movielist: [],
      page: 1,
      type,
      hasMore: true    
    })
    this.handlerInitMovieList()
  },
  //获取数据
  handlerInitMovieList() {
    this.setData({isLoading: true})   //加载数据
    wx.showLoading({
      title: '加载中'
    })
    let para = { page: this.data.page, limit: this.data.limit}
    this.requestPost(
      `/api/v1/GetMovieList/${this.data.type}`, para
      ).then(res => {
      let {page, limit} = this.data
      this.setData({
        movielist: this.data.movielist.concat(res.data.userlist),
        page: ++page,
        isLoading: false,
        hasMore: !(page > res.data.total / limit)
      })
      wx.hideLoading()
    })
  },
  //scroll滚动
  handlerScrollView(e){
    this.setData({
      scrollTop: e.detail.scrollTop
    })  
  },
  //scroll触底
  handlerScrollBottom: function(){
    let {isLoading, hasMore} = this.data
    if(isLoading || !hasMore) return false
    this.handlerInitMovieList()
  },
  //初始化
  onLoad: function(){
    this.handlerInitMovieList()
  }
})