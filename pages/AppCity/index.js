Page({
  data: {
    searchValue: "",
    scrollTop: ""
  },
  onLoad(options){

  },
  //监听用户滑动页面事件
  onPageScroll(e) {
    this.setData({
      scrollTop: e.scrollTop
    })
  },
  //监听搜索键盘
  handlerSearchKey(e){
    console.log(e.detail)
    this.setData({
      searchValue: e.detail
    })
  }
})