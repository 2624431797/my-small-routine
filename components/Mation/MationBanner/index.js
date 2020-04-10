import { requestPost } from "../../../services/index"

Component({
  properties: {

  },
  data: {
    bannerlist: []
  },
  methods: {
    handlerGetInit(){
      requestPost(
        `/api/z1/GetMationBanner`
        ).then(res => {
        this.setData({
          bannerlist: res.data.mationlist
        })
      })
    }
  },
  ready(){
    this.handlerGetInit()
  }
})
