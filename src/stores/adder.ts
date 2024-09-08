import { message } from "ant-design-vue";
import { defineStore } from "pinia";
import { ref } from "vue";
import type { BangumiItem } from "./interface";
import { nanoid } from "nanoid";
import { getTimestampOfFirstEpisode } from "./cal";
import axios from "axios";
import { baseURL } from "./network";
import token from "./token";
import list from "./list";

export default defineStore("adder", ()=>{

  let showAdd=ref(false);

  let add_title=ref("");
  let add_onUpdate=ref(false);
  let add_now=ref(0);
  let add_episodes=ref(1);
  let add_weekday=ref(0);
  let add_updateTo=ref(1);

  const reset=()=>{
    add_title.value="";
    add_onUpdate.value=false;
    add_now.value=0;
    add_episodes.value=1;
    add_weekday.value=0;
    add_updateTo.value=1;
  }

  const changeUpdate=()=>{
    add_now.value=0;
  }

  const judge=()=>{
    if(add_onUpdate.value){
      return add_episodes.value>add_updateTo.value?add_updateTo.value:add_episodes.value;
    }else{
      return add_episodes.value;
    }
  }
  
  const handleOk=async ()=>{
    if(add_title.value.length==0){
      message.error("标题不能为空");
      return;
    }
    const todayTimestamp = Date.now();
    const jsonItem:BangumiItem={
      id: nanoid(),
      title: add_title.value,
      episode: add_episodes.value,
      now: add_now.value,
      time: add_onUpdate.value ? getTimestampOfFirstEpisode(todayTimestamp, add_weekday.value, add_updateTo.value) : 0
    }
    const response=(await axios.post(`${baseURL}/api/addlist`, {
      data: jsonItem,
    }, {
      headers: {
        "token": token().token
      }
    })).data;
    if(!response.ok){
      message.error("添加失败: "+response.msg);
    }else{
      showAdd.value=false;
      message.success("添加成功");
      list().getList();
      reset();
    }
  }

  const addHandler=()=>{
    showAdd.value=true;
  }

  return {add_title, add_onUpdate, add_now, add_episodes, add_weekday, add_updateTo, changeUpdate, judge, handleOk, addHandler, showAdd, reset}
})