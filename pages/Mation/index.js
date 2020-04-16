Page({
  data: {
    page: 1,
    limit: 6,
    isLoading: false,   //默认不加载数据
    hasMore: true,      //默认有更多数据
    mationlist: []
  },
  onLoad(options) {
    this.handlerGetInit()
  },
  onReachBottom(){
    let {isLoading, hasMore} = this.data
    if(isLoading || !hasMore) return false
    this.handlerGetInit()
  },
  handlerGetInit(){
    this.setData({isLoading: true})   //加载数据
    wx.showLoading({
      title: '加载中'
    })
    let para = { page: this.data.page, limit: this.data.limit}
    this.requestPost(
      `/api/z1/GetMationList`, para
      ).then(res => {
      let {page, limit} = this.data
      this.setData({
        mationlist: this.data.mationlist.concat(res.data.mationlist),
        page: ++page,
        isLoading: false,
        hasMore: !(page > res.data.total / limit)
      })
      wx.hideLoading()
    })
  },
})