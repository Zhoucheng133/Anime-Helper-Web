import { message } from "ant-design-vue";
import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";
import { baseURL } from "./network";
import token from "./token";

export default defineStore("addto", ()=>{
  const addDownloader=(title: string)=>{
    bangumiAddTitle.value=title;
    showAddBangumiDialog.value=true;
  }

  let showAddBangumiDialog=ref(false);
  let bangumiAddAss=ref("");
  let bangumiAddTitle=ref("");

  const addBangumiOk=async ()=>{
    if(bangumiAddAss.value.length==0){
      message.error("字幕组不能为空");
      return;
    }else if(bangumiAddTitle.value.length==0){
      message.error("标题不能为空");
      return;
    }
    const response=(await axios.post(`${baseURL}/api/dl/add`, {
      data: {
        title: bangumiAddTitle.value,
        ass: bangumiAddAss.value,
      }
    }, {
      headers: {
        token: token().token,
      }
    })).data
    if(response.ok){
      message.success("添加成功");
      showAddBangumiDialog.value=false;
    }else{
      message.error("添加失败: "+response.msg);
    }
  }

  const onDialogCancel=()=>{
    showAddBangumiDialog.value=false;
    bangumiAddAss.value="";
    bangumiAddTitle.value="";
  }

  return {
    onDialogCancel,
    addBangumiOk,
    bangumiAddTitle,
    bangumiAddAss,
    addDownloader,
    showAddBangumiDialog
  }
})