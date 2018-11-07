<!-- 搜索页面 -->
<!-- 搜索页面 -->
<!-- 搜索页面 -->
<template>
  <div>
    <scroll class="search">
      <div>
        <div class="container">
          <input type="text" placeholder="搜索歌曲、歌手" @click="show" v-model="content" />
          <i class="iconfont icon-search"></i>
        </div>
        <div class="hot-key" ref="one">
          <p class="hot_s">热门搜索</p>
          <ul>
            <li  v-for="(item,index) in hotkeyTen" @click="getContent(index)" :key="index">{{item.k}}</li>
          </ul>
        </div>
        <p ref="two" class="search_list" v-for="(_item,index) in lists" @click="addplay(_item,index)"   :key="index">{{_item.name}} - {{_item.singer[0].name}}</p>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
  import {getHotKey} from "@/api"
  import Scroll from "@/components/scroll"
  import {search} from "@/api"
  import {mapActions} from 'vuex'
  // import Loading from "@/components/loading";
  export default {
    data:function(){
      return{
        hotkey:[],
        hotkeyTen:[],
        lists:[],
        content:""
      }
    },
    created(){
      this.getSlide();
    },
    //页面渲染完成后执行的函数
    updated(){
      this.show()
    },
    components:{
      Scroll
      // Loading
    },
    methods:{
      getSlide:function(){
        getHotKey().then((res) => {
          this.hotkey = res.data.hotkey;
          this.hotkeyTen = this.hotkey.slice(0,10);
          // console.log(this.hotkeyTen);
        })
      },
      getContent:function(index){
        this.content = this.hotkeyTen[index].k;
      },
      show(){
        if(this.content != ""){
          this.$refs.one.style.display = "none";
        }else{
          this.$refs.one.style.display = "block";
        }
      },
      addplay(a,index){
        let songs=[]
        var item={
          //id
          id:a.id,
          //专辑id
          mid:a.mid,
          //歌曲名
          name:a.name,
          //专辑名
          album:a.album.name,
          //歌曲时长
          interval:a.interval,
          //专辑封面
          img:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${a.album.mid}.jpg?max_age=2592000`,
          //歌曲链接
          url:`http://dl.stream.qqmusic.qq.com/C400$
          {a.mid}/${a.id}.m4a?guid=983915916&fromtag=66`,
          //歌手
          singername:a.singer[0].name
        }
        songs.push(item)
        this.addPlayer({
          list:songs,
          index:index
        })
      },
      ...mapActions([
        'addPlayer'
     ])
    },
    watch:{
      content(){
        this.n = 40;//显示歌的个数
        this.p = 1;
        search(this.content,this.p,this.n).then(res => {
          console.log(res)
          this.lists = res.data.song.list;
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import url('~@/assets/less/variable.less');
  .search{
    margin-top: 4%;
    position: fixed;
    width:100%;
    top:0.88rem;
    bottom: 0;
    overflow:hidden;
    .container{
      width:90%;
      margin:0 auto;
      position: relative;
      input{
        padding:0 0 0 0.3rem;
        height:0.38rem;
        display: block;
        width:90%;
        border:0;
        outline: none;
        margin-top:0.1rem;
        border-radius:0.08rem;
        background:@color-highlight-background;
        font-size: @font-size-medium;
        color:@color-text-ll;
      }
      .icon-search{
        font-size: 0.26rem;
        color:@color-dialog-background;
        position: absolute;
        top: 0.07rem;
        margin-left:0.04rem;
      }
    }
    .singer_list{
      display: flex;
      padding: 0.1rem 0;
      margin: 0 0.3rem;
      img{
        width:0.5rem;
        height:0.5rem;
        border-radius:50%;
      }
      .name{
        color:@color-text-l;
        line-height: 0.5rem;
        margin-left:0.2rem;
        font-size: @font-size-medium;
      }
    }
    .hot-key{
      margin: 0 0 0.2rem 0.2rem;
      .hot_s{
        color:@color-text-l;
        font-size: @font-size-medium;
        margin-top: 0.2rem;
        margin-bottom: 0.2rem;
      }
      ul{
        font-size: @font-size-medium;
        list-style: none;
        li{
          padding: 0.05rem 0.1rem;
          margin: 0 0.2rem 0.2rem 0;
          border-radius:0.06rem;
          display: inline-block;
          color:@color-text-l;
          background:@color-highlight-background;
        }
      }
    }
    .search_list{
      font-size: @font-size-medium;
      height:0.38rem;
      line-height: 0.38rem;
      border:1px solid #333;
      border-radius: 15px;
      margin: 10px 20px 10px 20px;
      padding-left: 0.13rem;
    }
  }
</style>
