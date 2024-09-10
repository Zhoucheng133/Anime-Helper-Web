import { defineStore } from "pinia";
import { ref } from "vue";
import { baseURL } from "./network";
import axios from "axios";
import token from "./token";
import { message } from "ant-design-vue";

interface log{
  ok: boolean,
  msg: string,
  time: number,
};

export default defineStore("log", ()=>{
  let showLogDialog=ref(false);

  let logContent=ref<log[]>([]);

  const showLog=async ()=>{
    const response=(await axios.get(`${baseURL}/api/dl/log`, {
      headers: {
        token: token().token
      }
    })).data;
    if(response.ok){
      logContent.value=response.msg.reverse();
    }else{
      message.error("获取日志失败: "+response.msg);
    }
    showLogDialog.value=true;
  }

  return {
    showLog,
    logContent,
    showLogDialog
  }
})