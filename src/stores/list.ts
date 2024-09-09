import { defineStore } from "pinia";
import { ref } from "vue";
import type { BangumiItem } from "./interface";
import axios from "axios";
import token from "./token";
import { baseURL } from "./network";
import { message } from "ant-design-vue";
import { analyseEpisode } from "./cal";

export default defineStore("list", ()=>{
  let loading=ref(true);
  let dataSource=ref<BangumiItem[]>([]);
  const getList=async ()=>{
    const response=(await axios.get(`${baseURL}/api/list`, {
      headers: {
        "token": token().token,
      }
    })).data;
    if(response.ok){
      dataSource.value=response.msg.reverse();
    }else{
      message.error("获取列表失败: "+response.msg);
    }
    loading.value=false;
  }

  const minus_one=async (item: BangumiItem)=>{
    if(item.now==0){
      return;
    }
    const index=dataSource.value.findIndex((i)=>item.id==i.id);
    if(index==-1){
      return;
    }else{
      dataSource.value[index].now=dataSource.value[index].now-1;
      await changeItem(dataSource.value[index]);
    }
  }
  
  const add_one=async (item: BangumiItem)=>{
    
    if(item.now>=analyseEpisode(item)){
      return;
    }
    const index=dataSource.value.findIndex((i)=>item.id==i.id);  
    if(index==-1){
      return;
    }else{
      dataSource.value[index].now=dataSource.value[index].now+1;
      await changeItem(dataSource.value[index]);
    }
    
  }

  const changeItem=async (item: BangumiItem)=>{
    const response=(await axios.post(`${baseURL}/api/changeitem`, {
      data: item,
    }, {
      headers: {
        token: token().token
      }
    })).data;
    if(response.ok){
      getList();
    }else{
      message.error("修改参数失败: "+response.msg);
    }
  }

  let onsearch=ref(false);
  let searchKey=ref("");

  const shownList=()=>{
    if(onsearch.value){
      return dataSource.value.filter((item)=>{
        return item.title.includes(searchKey.value);
      })
    }else{
      return dataSource.value
    }
  }

  const searchChange=()=>{
    if(searchKey.value.length==0){
      onsearch.value=false;
    }else{
      onsearch.value=true;
      // search();
    }
  }
  
  // const search=()=>{
    // searchRlt.value=list().dataSource.filter((item)=>{
    //   return item.title.includes(searchKey.value);
    // })
  // }
  

  return {loading, dataSource, getList, minus_one, add_one, changeItem, shownList, onsearch, searchKey, searchChange};
})