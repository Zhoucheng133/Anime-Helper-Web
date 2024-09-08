import { message, Modal } from "ant-design-vue";
import { defineStore } from "pinia";
import { ref } from "vue";
interface bangumi {
  title: string,
  ass: string,
}
export default defineStore("dl", ()=>{
  let running=ref(false);
  let data=ref({
    "type": "mikan",
    "exclusions": [] as string[],
    "bangumi": [] as bangumi[],
    "freq": 15,
    "ariaLink": "",
    "ariaSecret": ""
  });

  const bangumiColumn=[
    {
      "name": "字幕组",
      "key": "ass",
      "dataIndex": "ass"
    },
    {
      "name": "标题",
      "key": "title",
      "dataIndex": "title"
    },
    {
      title: '操作',
      key: 'action',
      width: '70px',
    },
  ];

  const delBangumi=(ass: string, title: string)=>{
    Modal.confirm({
      title: '你确定要删除这个番剧吗',
      centered: true,
      onOk() {
        data.value.bangumi=data.value.bangumi.filter((item)=>{
          if(item.ass==ass && item.title==title){
            return false
          }
          return true;
        })
        message.success("删除成功")
      },
      onCancel() {},
    });
  }

  const addExclusion=()=>{
    showAddExclusionDialog.value=true;
  }

  const exclusionsColumn=[
    {
      "name": "值",
      "key": "value",
    },
    {
      title: '操作',
      key: 'action',
      width: '70px',
    }
  ];

  const delExclusions=(value: string)=>{
    Modal.confirm({
      title: '你确定要删除这个关键字吗',
      centered: true,
      onOk() {
        data.value.exclusions=data.value.exclusions.filter((item)=>{
          if(item==value){
            return false
          }
          return true;
        })
        message.success("删除成功")
      },
      onCancel() {},
    });
  }

  let showAddBangumiDialog=ref(false);

  const addBangumiOk=()=>{
    if(bangumiAddAss.value.length==0){
      message.error("字幕组不能为空");
      return;
    }else if(bangumiAddTitle.value.length==0){
      message.error("标题不能为空");
      return;
    }
    const exists = data.value.bangumi.some(item => 
      item.ass === bangumiAddAss.value && item.title === bangumiAddTitle.value
    );
  
    if(exists){
      message.error("番剧表已有该数据")
      return;
    }
    data.value.bangumi.push({
      "ass": bangumiAddAss.value,
      "title": bangumiAddTitle.value,
    })
    onDialogCancel();
    message.success("添加成功");
    showAddBangumiDialog.value=false;
  }

  const addBangumi=()=>{
    showAddBangumiDialog.value=true;
  }

  const onDialogCancel=()=>{
    bangumiAddAss.value="";
    bangumiAddTitle.value="";
    exclusionAddValue.value="";
  }

  let bangumiAddAss=ref("");
  let bangumiAddTitle=ref("");

  let showAddExclusionDialog=ref(false);

  const addExclusionOk=()=>{
    if(exclusionAddValue.value.length==0){
      message.error("关键字不能为空");
      return;
    }
    if(data.value.exclusions.includes(exclusionAddValue.value)){
      message.error("该关键字已存在");
      return;
    }
  
    data.value.exclusions.push(exclusionAddValue.value);
    onDialogCancel();
    message.success("添加成功");
    showAddExclusionDialog.value=false;
  }
  
  let exclusionAddValue=ref("");


  return {
    exclusionAddValue,
    addExclusionOk,
    showAddExclusionDialog, 
    bangumiAddTitle, 
    bangumiAddAss, 
    onDialogCancel, 
    addBangumiOk, 
    showAddBangumiDialog, 
    running, 
    data, 
    addBangumi, 
    bangumiColumn, 
    delBangumi, 
    addExclusion, 
    exclusionsColumn, 
    delExclusions 
  };
})