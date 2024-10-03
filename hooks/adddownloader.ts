import axios from "axios";
import { reqHost } from "./network";
import type { DownloaderItem } from "./dl";
const toast = useToast()

export const onAddDownloaderOk=async (item: DownloaderItem): Promise<boolean>=>{
  const token=useCookie('token');
  if(!token.value){
    toast.add({
      title: '添加失败',
      description: 'token获取失败'
    })
    return false;
  }
  if(item.ass.length==0){
    toast.add({
      title: '字幕组不能为空',
    })
    return false;
  }else if(item.title.length==0){
    toast.add({
      title: '标题不能为空',
    })
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
    toast.add({
      title: '添加成功',
    })
    return true;
  }else{
    toast.add({
      title: '添加失败',
      description: response.msg
    })
    return false;
  }
}