import type { BangumiItem } from "./interface";

function resetToMidnight(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// 获取某一周的指定星期几的时间戳
export function getTimestampOfFirstEpisode(todayTimestamp: number, releaseDay: number, episodesReleased: number): number {
  const today = resetToMidnight(new Date(todayTimestamp));
  const daysPassed = (episodesReleased - 1) * 7;
  const currentDay = today.getDay();
  const offset = (currentDay - releaseDay + 7) % 7;
  const daysSinceFirstEpisode = daysPassed + offset;
  const firstEpisodeDate = new Date(today.getTime() - daysSinceFirstEpisode * 24 * 60 * 60 * 1000);
  return firstEpisodeDate.getTime();
}

// 计算截至到今天的已更新集数
export function calculateEpisodesReleased(firstEpisodeTimestamp: number): number {
  const tmp = new Date();
  const currentDate = new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate());
  const difference = currentDate.getTime() - firstEpisodeTimestamp;
  const daysPassed=Math.floor(difference / (1000 * 60 * 60 * 24));
  const weeksPassed = Math.floor(daysPassed / 7);
  return Math.max(weeksPassed, 0) + 1;
}

export const analyseEpisode=(item: BangumiItem)=>{
  if(item.time==0){
    return item.episode;
  }
  return calculateEpisodesReleased(item.time)>item.episode?item.episode:calculateEpisodesReleased(item.time);
}