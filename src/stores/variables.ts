import { defineStore } from "pinia";
import { ref } from "vue";

export default defineStore("mobile", ()=>{
  let isMobile=ref(false);

  return {isMobile};
})