import { nanoid } from "nanoid";
import type { EditItem } from "./edit";
import type { BangumiItem } from "./list";
import { getTimestampOfFirstEpisode } from "./cals";
import axios from "axios";
import { reqHost } from "./network";

const toast = useToast()

export const addOk=async (item: EditItem): Promise<boolean>=>{
  const token=useCookie('token');
  if(!token.value){
    toast.add({
      title: '添加失败',
      description: 'token获取失败'
    })
    return false;
  }
  if(item.title.length==0){
    toast.add({
      title: '标题不能为空',
    })
    return false;
  }
  const todayTimestamp = Date.now();
  const jsonItem:BangumiItem={
    id: nanoid(),
    title: item.title,
    episode: item.episodes,
    now: item.now,
    time: item.onUpdate ? getTimestampOfFirstEpisode(todayTimestamp, item.weekday, item.updateTo) : 0
  }
  const response=(await axios.post(`${reqHost}/api/addlist`, {
    data: jsonItem,
  }, {
    headers: {
      "token": token.value
    }
  })).data;
  if(!response.ok){
    toast.add({
      title: '添加失败',
      description: response.msg
    })
    return false;
  }else{
    toast.add({
      title: '添加成功',
    })
    return true;
  }
}