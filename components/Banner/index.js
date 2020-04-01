import { requestPost } from "../../services/index"

Component({
  data: {
    banners: [],
    currentSwiper: ''
  },
  methods: {
    handlerInitBanner(){
      requestPost(
        "/api/v1/GetBannerList", 949995
      ).then(res => {
        this.setData({
          banner: res.data.bannerlist
        })
      })
    },
    handlerBindchange: function(e){
      this.setData({
        currentSwiper: e.detail.current
      })
    }
  },
  ready(){
    this.handlerInitBanner()
  }
})
