import axios from "axios";
import { reqHost, ssrHost } from "./network";

export interface DownloaderItem{
  title: string,
  ass: string
}

export interface Log{
  ok: boolean,
  msg: string,
  time: number,
};

export const getLog=async (): Promise<Log[] | null>=>{
  const token=useCookie('token');
  if(!token.value){
    return null;
  }
  const response=(await axios.get(`${reqHost}/api/dl/log`, {
    headers: {
      token: token.value
    }
  })).data;
  if(response.ok){
    return response.msg.reverse()
  }else{
    return [];
    message.error("获取日志失败: "+response.msg);
  }
}

export interface DownloaderForm{
  ariaLink: string,
  ariaSecret: string,
  bangumi: DownloaderItem[],
  exclusions: string[],
  freq: number,
  type: string,
}

export const exclusionColumn: any=[
  {
    label: "值",
    key: "value",
  },
  {
    label: '操作',
    key: 'op',
    rowClass: 'op_style'
  },
]

export const bangumiColumn: any=[
  {
    label: "字幕组",
    key: "ass",
  },
  {
    label: "标题",
    key: "title",
  },
  {
    label: '操作',
    key: 'op',
    rowClass: 'op_style'
  },
];

export const initFormData=async (): Promise<DownloaderForm | null>=>{
  const token=useCookie('token');
  if(!token.value){
    return null;
  }
  const {data: response}=await useAsyncData(async ()=>{
    const data = (await axios.get(`${ssrHost}/api/dl`, {
      headers: {
        token: token.value,
      }
    })).data;
    if(data.ok){
      return data.msg;
    }
    return null;
  });
  return response.value;
}

export const initStatus=async (): Promise<boolean>=>{
  const token=useCookie('token');
  if(!token.value){
    return false;
  }
  const {data: response}=await useAsyncData(async ()=>{
    const data = (await axios.get(`${ssrHost}/api/dl/status`, {
      headers: {
        token: token.value,
      }
    })).data;
    if(data.ok){
      return data.msg;
    }
    return false;
  });
  return response.value;
}

export const saveForm=async (item: DownloaderForm)=>{
  const token=useCookie('token');
  if(!token.value){
    message.error("获取token失败")
    return;
  }
  const response=(await axios.post(`${reqHost}/api/dl/load`, {
    data: item,
  }, {
    headers: {
      token: token.value,
    }
  })).data
  if(response.ok){
    message.success("保存成功");
  }else if(!response.ok){
    message.error("保存表单失败: "+response.msg);
  }
}