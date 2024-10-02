import axios from "axios";
import { reqHost } from "./network";
import type { DownloaderItem } from "./dl";

export const onAddDownloaderOk=async (item: DownloaderItem): Promise<boolean>=>{
  const token=useCookie('token');
  if(!token.value){
    message.error("token解析失败");
    return false;
  }
  if(item.ass.length==0){
    message.error("字幕组不能为空");
    return false;
  }else if(item.title.length==0){
    message.error("标题不能为空");
    return false;
  }
  const response=(await axios.post(`${reqHost}/api/dl/add`, {
    data: {
      title: item.title,
      ass: item.ass,
    }
  }, {
    headers: {
      token: token.value,
    }
  })).data
  if(response.ok){
    message.success("添加成功");
    return true;
  }else{
    message.error("添加失败: "+response.msg);
    return false;
  }
}