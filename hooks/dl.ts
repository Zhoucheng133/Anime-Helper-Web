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

export const toggle=async (running: boolean, form: DownloaderForm): Promise<boolean>=>{
  const token=useCookie('token');
  const toast = useToast()
  if(!token.value){
    toast.add({
      title: '添加失败',
      description: 'token获取失败'
    })
    return false;
  }
  if(running){
    if(form.ariaLink.length==0){
      toast.add({
        title: 'Aria 地址不能为空',
      })
      return false;
    }else if(form.bangumi.length==0){
      toast.add({
        title: '番剧表不能为空',
      })
      return false;
    }
    await saveForm(form, false);
    const response=(await axios.post(`${reqHost}/api/dl/run`, {}, {
      headers: {
        token: token.value
      }
    })).data;
    if(response.ok){
      toast.add({
        title: '启动服务成功',
      })
      return true;
    }else{
      toast.add({
        title: '启动服务失败',
        description: response.msg
      })
      return false;
    }
  }else{
    const response=(await axios.post(`${reqHost}/api/dl/stop`, {}, {
      headers: {
        token: token.value
      }
    })).data;
    if(response.ok){
      toast.add({
        title: '停止服务成功',
      })
      return true;
    }else{
      toast.add({
        title: '停止服务失败',
        description: response.msg
      })
      return false;
    }
  }
}

export const getLog=async (): Promise<Log[] | null>=>{
  const toast = useToast()
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
    toast.add({
      title: '获取日志失败',
      description: response.msg
    })
    return [];
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

export const saveForm=async (item: DownloaderForm, showMessage :boolean=true)=>{
  const toast = useToast()
  const token=useCookie('token');
  if(!token.value){
    toast.add({
      title: '添加失败',
      description: 'token获取失败'
    })
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
    if(showMessage){
      toast.add({
        title: '保存成功',
      })
    }
  }else if(!response.ok){
    if(showMessage){
      toast.add({
        title: '保存表单失败',
        description: response.msg
      })
    }
  }
}