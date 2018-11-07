import {mapGetters} from "vuex"
export const myMixin = {
	computed:{
		...mapGetters(['playerList'])
	},
	mounted(){
      this.watchPlayerList(this.playerList)
	},
	activated(){
      this.watchPlayerList(this.playerList)
	},
	watch:{
		playerList(val){
			this.watchPlayerList(val)
		}
	},
	methods:{
		watchPlayerList(){
			console.log("请添加")
		}
	}
}