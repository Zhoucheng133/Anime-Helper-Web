import axios from "axios"
import { ssrHost } from "./network"

export interface BangumiItem{
  id: string,
  title: string,
  episode: number,
  now: number,
  time: number
}

// 判定是否实际上显示多少集
export function analyseEpisode(item: BangumiItem){
  if(item.time==0){
    return item.episode;
  }
  return calculateEpisodesReleased(item.time)>item.episode?item.episode:calculateEpisodesReleased(item.time);
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

// 获取列表
export async function getList(): Promise<BangumiItem[]>{
  const token=useCookie('token');
  if(!token){
    return [];
  }
  const {data: response}=await useAsyncData(async ()=>{
    const data = (await axios.get(`${ssrHost}/api/list`, {
      headers: {
        token: token.value,
      }
    })).data;
    if(data.ok){
      return data.msg.reverse();
    }
    return [];
  });
  return response.value;
}

export const listColumn: any=[
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
    fixed: 'left',
    width: 150,
  },
  {
    title: "状态",
    dataIndex: 'status',
    key: 'status',
    width: 70,
    filters: [
      {
        text: '更新中',
        value: 'onUpdate',
      },
      {
        text: '已完结',
        value: 'finished'
      }
    ],
    onFilter: (value: string, record: BangumiItem)=>{
      if(value=="onUpdate"){
        return calculateEpisodesReleased(record.time)<record.episode;
      }else{
        return calculateEpisodesReleased(record.time)>=record.episode
      }
    },
  },
  {
    title: "集数",
    dataIndex: 'episode',
    key: 'episode',
    width: 70,
  },
  {
    title: "看至",
    dataIndex: 'now',
    key: 'now',
    width: 70,
  },
  {
    title: "进度",
    dataIndex: 'progress',
    key: 'progress',
    width: 100,
    filters: [
      {
        text: '进行中',
        value: 'onProgress',
      },
      {
        text: '已看完',
        value: 'finished'
      }
    ],
    onFilter: (value: string, record: BangumiItem)=>{
      if(value=="onProgress"){
        return record.now/analyseEpisode(record)<1;
      }else{
        return  record.now/analyseEpisode(record)>=1
      }
    },
  },
  {
    title: "操作",
    dataIndex: 'op',
    key: 'op',
    width: 200
  },
]