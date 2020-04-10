import { requestPost } from "../../services/index"

Page({
  data: {
    mationlist: []
  },
  onLoad: function (options) {
    this.handlerGetInit(options.id)
  },
  handlerGetInit(id){
    requestPost(
      `/api/z1/GetMationDetail/${id}`
      ).then(res => {
      this.setData({
        mationlist: res.data.mationlist
      })
    })
  }
})