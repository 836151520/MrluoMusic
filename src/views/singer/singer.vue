<template>
  <div class="singer">
  	<singer-list :list="list"></singer-list>
  </div>
</template>

<script>
import {getSingerList} from "@/api"
import SingerList from "@/components/singer-list"
export default {
  data:function(){
    return {
      list:[]
    }
  },
  components:{
    SingerList
  },
  created(){
    this.getSingerList();
  },
  methods:{
    getSingerList(){
      getSingerList().then(res => {
        this.list = this.newSinger(res.data.list)
        console.log(this.newSinger(res.data.list))
      })
    },
    newSinger(list){
      //新建一个对象
      let nList = {
        hot:{
          title:"热门",
          items:[]
        }
      }
      list.forEach((item,index) => {
        //取前十条为热门数据
        if (index<10) {
           nList.hot.items.push({
             id:item.Fsinger_mid,
             name:item.Fsinger_name,
             img:`https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
           })
        }
        //通过姓名首字母定义数据x
        if(!nList[item.Findex]){
          nList[item.Findex] = {
            title:item.Findex,
            items:[]
          }
        }
        nList[item.Findex].items.push({
          id:item.Fsinger_mid,
          name:item.Fsinger_name,
          img:`https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
        })
      })
      //把对象转成有序数组
      let hot =[];
      let other =[];
      for(let k in nList){
        if(nList[k].title == "热门"){
          hot.push(nList[k])
        }else if(nList[k].title.match(/[a-zA-Z]/)){
          other.push(nList[k])
        }
      }
      //排序
      other.sort((a,b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      //拼接hot和other数组
      return hot.concat(other)
    }
  },
}

</script>

<style lang="less" scoped>
  
</style>