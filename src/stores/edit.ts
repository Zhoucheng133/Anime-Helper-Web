import { defineStore } from "pinia";
import { ref } from "vue";
import list from "./list";
import { analyseEpisode, calculateEpisodesReleased, getTimestampOfFirstEpisode } from "./cal";
import type { BangumiItem } from "./interface";

export default defineStore("edit", ()=>{
  let showEdit=ref(false);

  let edit_title=ref("");
  let edit_onUpdate=ref(false);
  let edit_episodes=ref(1);
  let edit_now=ref(1);
  let edit_updateTo=ref(1);
  let edit_weekday=ref(0);
  let edit_id=ref("");

  const judgeEdit=()=>{
    if(edit_onUpdate.value){
      return edit_episodes.value>edit_updateTo.value?edit_updateTo.value:edit_episodes.value;
    }else{
      return edit_episodes.value;
    }
  }

  const openEdit=(record: BangumiItem)=>{
    edit_title.value=record.title;
    edit_episodes.value=record.episode;
    edit_onUpdate.value=calculateEpisodesReleased(record.time)<record.episode;
    edit_updateTo.value=analyseEpisode(record);
    edit_now.value=record.now;
    edit_weekday.value=new Date(record.time).getDay()
    edit_id.value=record.id;
    showEdit.value=true;
  }
  
  const EditOk=async ()=>{
    const todayTimestamp = Date.now();
    await list().changeItem({
      id: edit_id.value,
      title: edit_title.value,
      episode: edit_episodes.value,
      now: edit_now.value,
      time: edit_onUpdate.value ? getTimestampOfFirstEpisode(todayTimestamp, edit_weekday.value, edit_updateTo.value) : 0
    });
    showEdit.value=false;
  }

  const changeUpdate=()=>{
    edit_now.value=1;
  }

  return {showEdit, edit_title, edit_onUpdate, edit_episodes, edit_now, edit_updateTo, edit_weekday, edit_id, judgeEdit, openEdit, EditOk, changeUpdate}
})