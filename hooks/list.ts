import axios from "axios"
import { ssrHost } from "./network"

export interface bangumiItem{
  id: string,
  title: string,
  episode: number,
  now: number,
  time: number
}

export async function getList(): Promise<bangumiItem[]>{
  const token=useCookie('token');
  if(!token){
    return [];
  }
  const {data: response}=await useAsyncData(async ()=>{
    return (await axios.get(`${ssrHost}/api/list`, {
      headers: {
        token: token.value,
      }
    })).data;
  });
  if(response.value.ok){
    return response.value.msg;
  }
  return [];
}