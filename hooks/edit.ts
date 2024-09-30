import { getTimestampOfFirstEpisode } from "./cals";
import { changeItem } from "./list";

export interface EditItem{
  title: string,
  onUpdate: boolean,
  episodes: number,
  now: number,
  updateTo: number,
  weekday: number,
  id: string
}

export const editOk=async (item: EditItem): Promise<boolean>=>{
  const todayTimestamp = Date.now();
  return await changeItem({
    id: item.id,
    title: item.title,
    episode: item.episodes,
    now: item.now,
    time: item.onUpdate ? getTimestampOfFirstEpisode(todayTimestamp, item.weekday, item.updateTo) : 0
  });
}
