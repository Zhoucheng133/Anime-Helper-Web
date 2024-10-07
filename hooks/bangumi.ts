import axios from "axios";
import { reqHost, ssrHost } from "./network";

export interface Calendar{
  id: number,
  title: string,
}

export interface CalendarItem{
  eps: number,
  updates: number,
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

export const getCalendarItem=async (id: number): Promise<CalendarItem>=>{
  const token=useCookie('token');
  if(!token.value){
    return {
      eps: 1,
      updates: 0
    };
  }
  const response=(await axios(`${reqHost}/api/calendar/item/${id}`, {
    headers: {
      token: token.value,
    }
  })).data;
  if(response.ok){
    return response.msg;
  }else{
    return {
      eps: 1,
      updates: 0
    }
  }
}