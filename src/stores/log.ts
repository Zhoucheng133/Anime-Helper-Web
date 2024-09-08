import { defineStore } from "pinia";
import { ref } from "vue";

interface log{
  ok: boolean,
  msg: string,
  time: number,
};

export default defineStore("log", ()=>{
  let showLogDialog=ref(false);

  let logContent=ref<log[]>([]);

  const showLog=()=>{
    showLogDialog.value=true;
  }

  return {
    showLog,
    logContent,
    showLogDialog
  }
})