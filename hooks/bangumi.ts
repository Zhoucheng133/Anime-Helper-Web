import axios from "axios";
import { ssrHost } from "./network";

export interface Calendar{
  id: number,
  title: string,
}

export const initUpdates=async (): Promise<Calendar[][]>=>{
  const token=useCookie('token');
  if(!token.value){
    return [];
  }
  const {data: response}=await useAsyncData(async ()=>{
    const data = (await axios.get(`${ssrHost}/api/calendar`, {
      headers: {
        token: token.value,
      }
    })).data;
    if(data.ok){
      return data.msg;
    }
    return [];
  });
  return response.value;
}