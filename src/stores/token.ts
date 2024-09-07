import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";

export default defineStore("token", ()=>{
  let token=ref("");
  const getToken=()=>{
    // token.value=localStorage.getItem("token")==undefined ? ;
    const local=localStorage.getItem("token");
    const router=useRouter();
    if(!local){
      router.replace("/login")
    }else{
      token.value=local;
    }
  }

  return {token, getToken};
})