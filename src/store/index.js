import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state:{
		//记录播放列表
		playerList:[],
		//记录播放器是否全屏,默认全屏
		fullScreen:false,
		//播放状态
		playing:false,
		//当前播放歌曲的列表索引
		currentIndex:-1,
		//播放模式（顺序0，随机1，单曲2）
		mode:0
	},
	//直接改变getters里面的，不改变state
	getters:{
       playerList:state => state.playerList,
       fullScreen:state => state.fullScreen,
       playing:state => state.playing,
       currentIndex:state => state.currentIndex,
       //当前播放歌曲的信息
       currentSong:(state) => {
       	 return state.playerList[state.currentIndex] || {}
       },
       mode:state => state.mode 
	},
	//mutations里面写的是方法
	mutations:{
		//第一个state是定值
		changePlayList(state,playerList){
			state.playerList = playerList
		},
		changeFullScreen(state,fullScreen){
			state.fullScreen = fullScreen
		},
		changePlaying(state,playing){
			state.playing = playing
		},
		changeCurrentIndex(state,currentIndex){
			state.currentIndex = currentIndex
		},
		changeMode(state,mode){
			state.mode = mode
		}
	},
	actions:{
		//commit是mutations里的所有东西，list是传过来的播放列表，index是列表里面歌曲的索引
		addPlayer({commit},{list,index}){
			commit('changePlayList',list)
			commit('changeFullScreen',true)
			commit('changePlaying',true)
			commit('changeCurrentIndex',index)
		},
		//删除一首歌
		delone({commit,state},item){
            let index = 0;
            let plist = state.playerList;
            let currentIndex = state.currentIndex
            for(let j = 0;j<plist.length;j++){
            	if(plist[j].id == item.id){
            		index = j
            	}
            }
            
            plist.splice(index,1);
            //提交
            if(currentIndex == plist.length){
            	currentIndex--
            }
            commit('changePlayList',plist)
            commit('changePlaying',true)
            commit('changeCurrentIndex',currentIndex)
		},
		//清空播放列表
		clear({commit}){
		  commit('changePlayList',[])
          commit('changePlaying',false)
          commit('changeCurrentIndex',-1)
		}
	}
})