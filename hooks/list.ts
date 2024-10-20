import axios from "axios"
import { reqHost, ssrHost } from "./network"

export interface BangumiItem{
  id: string,
  title: string,
  episode: number,
  now: number,
  time: number
}

// 刷新列表
export const getList=async (): Promise<BangumiItem[]>=>{
  const token=useCookie('token');
  if(!token.value){
    return [];
  }
  const data = (await axios.get(`${reqHost}/api/list`, {
    headers: {
      token: token.value,
    }
  })).data;
  if(data.ok){
    return data.msg.reverse();
  }
  return [];
}

// 获取列表
export async function initList(): Promise<BangumiItem[]>{
  const token=useCookie('token');
  if(!token.value){
    return [];
  }
  const {data: response}=await useAsyncData(async ()=>{
    const data = (await axios.get(`${ssrHost}/api/list`, {
      headers: {
        token: token.value,
      }
    })).data;
    if(data.ok){
      return data.msg.reverse();
    }
    return [];
  });
  return response.value;
}

// 修改项目
export const changeItem=async (item: BangumiItem): Promise<boolean>=>{
  const toast = useToast()
  const token=useCookie('token');
  if(!token.value){
    return false;
  }
  const response=(await axios.post(`${reqHost}/api/changeitem`, {
    data: item,
  }, {
    headers: {
      token: token.value
    }
  })).data;
  if(response.ok){
    return true;
  }else{
    toast.add({
      title: '修改参数失败',
      description: response.msg
    })
    return false;
  }
}

// 表头
export const listColumn: any=[
  {
    label: '标题',
    key: 'title',
  },
  {
    label: "状态",
    key: 'status',
  },
  {
    label: '更新周',
    key: 'weekday',
  },
  {
    label: "进度",
    key: 'progress',
  },
  {
    label: "操作",
    key: 'op',
  },
]