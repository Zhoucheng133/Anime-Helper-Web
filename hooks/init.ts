import axios from "axios";
import { ssrHost } from "./network";

export default async function(): Promise<boolean>{
  const token=useCookie('token');

  if(token.value){
    const {data: response} = await useAsyncData(async ()=>{
      return (await axios.get(`${ssrHost}/api/auth`, {
        headers: {
          token: token.value,
        }
      })).data;
    })
    if(response.value.ok){
      return true;
    }else{
      return false;
    }
  }else{
    return false;
  }
}