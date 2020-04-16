Page({
  data: {
    mationlist: []
  },
  onLoad: function (options) {
    this.handlerGetInit(options.id)
  },
  handlerGetInit(id){
    this.requestPost(
      `/api/z1/GetMationDetail/${id}`
      ).then(res => {
      this.setData({
        mationlist: res.data.mationlist
      })
    })
  }
})