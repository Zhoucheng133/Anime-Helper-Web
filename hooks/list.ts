import axios from "axios"
import { reqHost, ssrHost } from "./network"

export interface BangumiItem{
  id: string,
  title: string,
  episode: number,
  now: number,
  time: number
}

// 获取列表
export const getList=async (): Promise<BangumiItem[]>=>{
  const token=useCookie('token');
  if(!token.value){
    return [];
  }
  const data = (await axios.get(`${ssrHost}/api/list`, {
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
    message.error("修改参数失败: "+response.msg);
    return false;
  }
}

// 表头
export const listColumn: any=[
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
    fixed: 'left',
    width: 150,
  },
  {
    title: "状态",
    dataIndex: 'status',
    key: 'status',
    width: 70,
  },
  {
    title: "集数",
    dataIndex: 'episode',
    key: 'episode',
    width: 70,
  },
  {
    title: "看至",
    dataIndex: 'now',
    key: 'now',
    width: 70,
  },
  {
    title: "进度",
    dataIndex: 'progress',
    key: 'progress',
    width: 100,
  },
  {
    title: "操作",
    dataIndex: 'op',
    key: 'op',
    width: 200
  },
]