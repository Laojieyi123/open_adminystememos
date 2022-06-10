<template>
    <div>
        <div><el-button class="exportBtn" size="small" @click="selectcloumnDrawer = true">导出Excel</el-button></div>
        <!-- 按需导出列 -->
        <el-dialog :visible.sync="selectcloumnDrawer" title="选择列" @close="closeDialog()">
         <ExportColumn :columnList="columnListModel" @exportExcel="exportExcel"></ExportColumn>
        </el-dialog>
    </div>
</template>

<script>
// 引入选择按列导出弹窗组件
import ExportColumn from './ExportColumn'
import {handleExport} from '../../../../excel/export.js'

export default {
  components: {
    ExportColumn,
  },
  props:{
      totaltableList:{
          type:Array,
          default:()=>[]
      }
  },
  data(){
    return {
      selectcloumnDrawer:false,//控制导出列弹窗显示
      columnList:[],//选中的列
      columnListModel:[//全部列
        { name:"考核名称",
          name_en:"Check Name",
          field_code:"kpi_name", },
        { name:"归属用户",
          name_en:"belong user",
          field_code:"user_name", },
        { name:"开始日期",
          name_en:"start time",
          field_code:"start_time", },
        {  name:"目标详情",
          name_en:"goal detail",
          field_code:"goal_list", },
      ],
    }
  },
  methods:{
    //导出excel
    exportExcel(checkedColumn) {
      this.columnList = checkedColumn
      this.exportExcelfn()
    },
    exportExcelfn(){
      const alphabetList = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
      //主表格数据
      const tHeaderZh = this.columnList.map((p)=>{return p.name})//选择导出列的中文表头
      const tHeaderEn = this.columnList.map((p)=>{return p.name_en})//选择导出列的英文表头
      const filterVal = this.columnList.map((p)=>{return p.field_code})//选择导出列的字段key
      //获取导出表格的原始数据
      var list = JSON.parse(JSON.stringify(this.totaltableList))//totaltableList是表格json数据
      const isHasChildExcel = filterVal.includes('goal_list')//判断是否导出目标详情子表格
      //根据goal_list长度新增行，导出Excel包含子表格时执行
      if(isHasChildExcel){
        //子表格数据
        const cHeaderZh = ["考核项目","考核办法","比重(%)","最后得分"]
        const cHeaderEn = ["Check Item","Check Target","weight(%)","Check Method","score"]
        const cfilterVal = ["goal","kpi_method","weight","end_score"]
        const endData = { goalValue:cHeaderZh, goalEnValue:cHeaderEn, keyValue:cfilterVal, }
        var cHeaderLen = cHeaderZh.length
        //根据goal_list长度新增行
        list.forEach((p,index) => {
          var ret = []
          if(p.goal_list.length === 0){
            ret.push(p)
          }else{
            p.goal_list.unshift(endData)
            for(var i = 0;i < p.goal_list.length;i++){
              ret.push(p)
            }
          }
          list.splice(index,1,ret)
        })
        list = [].concat(...list)
        //包含嵌套表格数据时导出的表头数据
        for(var i = 1;i < cHeaderZh.length;i++){
          tHeaderZh.push('目标详情')
          tHeaderEn.push('goal detail')
        }
        filterVal.splice(-1,1,...cfilterVal)
      }
      //将数组转为二维数组
      const dataZh = this.formatJson(filterVal, list);
      const dataEn = this.formatJson(filterVal, list,"language");
      //将数组中的对象转为{A:'',B:''}格式
      const tableZh = this.changecolmuntokey(tHeaderZh,dataZh,alphabetList)
      const tableEn = this.changecolmuntokey(tHeaderEn,dataEn,alphabetList)
      //设置合并单元格行
      if(isHasChildExcel){
        var rowSpanList = []
        let rowSpan = {}
        const goallength = this.totaltableList.map(p=>p.goal_list.length)
        const columnlen = isHasChildExcel?tHeaderZh.length-cHeaderLen:tHeaderZh.length
        for(let j=0;j<columnlen;j++){
          let index = 0
          let i = 0
          for(; i < goallength.length;){
            for(; index < dataZh.length;){
              rowSpan = [[j, index+3],[j,index+3+goallength[i]]] //+3:从第三行开始才需要行合并
              rowSpanList.push(rowSpan)
              index = index+goallength[i]+1
              i++
            }
          }
        }
        //单元格行合并
        var mergesRange = rowSpanList.map((p)=>{
          var mergeslist = []
          for(let index=0;index<columnlen;index++){
            var data = p.map((q)=>{
              const ret = alphabetList[index].toString()+q[1].toString()
              return ret
            })
            data = data.join(':')
            mergeslist.push(data)
          }
          return mergeslist
        })
        //单元格列合并
        mergesRange.unshift(`${alphabetList[columnlen]}2:${alphabetList[tHeaderZh.length-1]}2`)
      }
      //指定Excel样式和合并范围等属性
      const dataInfo = {
        titleCell: "A1",
        titleRange: `A1:${alphabetList[tHeaderZh.length-1]}1`,
        theadRange: `A2:${alphabetList[tHeaderZh.length-1]}2`,
        tbodyRange: `A3:${alphabetList[tHeaderZh.length-1]}${dataZh.length + 2}`,
        tableRange: `A2:${alphabetList[tHeaderZh.length-1]}${dataZh.length + 2}`,
      };
      //有子表格时才有合并单元格
      if(isHasChildExcel) this.$set(dataInfo,'mergesRange',mergesRange.flat())
      //表格第一行标题
      const titleZh = [{ A: "员工考核表" }];
      const titleEn = [{ A: "Employee Evaluation Table" }];
      //传入得到的数据，导出引用handleExport方法导出
      handleExport(tableZh,tableEn,titleZh,titleEn,dataInfo).then(url => {
        const downloadAnchorNode = document.createElement("a");
        downloadAnchorNode.setAttribute("href", url);
        downloadAnchorNode.setAttribute(
          "download",
          "ExportList-Kpis.xlsx" //自定义导出文件的名称
        );
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      });
      setTimeout(()=>{this.closeDialog('exportexcel')})
    },
    //将数组中的对象转为{A:'',B:''}格式
    changecolmuntokey(tHeaderZh,dataZh,alphabetList){
      const table = []
      const list1 = []
      //表头转为{A:'',B:''}格式
      tHeaderZh.map((p,i)=>{
        this.$set(list1,alphabetList[i],p)
      })
      table.push(list1)
      //表身转为{A:'',B:''}格式
      dataZh.map((p) => {
        const list = {}
        for(let i=0;i<p.length;i++){
          this.$set(list,alphabetList[i],p[i])
        }
        table.push(list)
      })
      return table
    },
    //自定义二维数组数据格式
    formatJson(filterVal, jsonData,language) {
      var result1 = jsonData.map((v,vIndex) => {
        var result = filterVal.map(j => {
          if(j === "kpi_name"){
            if(language){
              return v[j+'_en']
            }else{
              return v[j]
            }
          }else if(j === "goal" || j === "kpi_method" || j === "weight" || j === "end_score"){ //有子表格数据时根据索引显示
            var goalIndex = 0
            if(vIndex !== 0){
              for(var i=1;i<=v.goal_list.length;i++){
                if(vIndex >= i){
                  if(jsonData[vIndex].id === jsonData[vIndex-i].id){
                    goalIndex = i
                  }
                }
              }
            }
            if(v.goal_list[goalIndex]){
              if('keyValue' in v.goal_list[goalIndex]){
                for(var i in v.goal_list[goalIndex].keyValue){
                  if(v.goal_list[goalIndex].keyValue[i] === j){
                    if(language){
                      return v.goal_list[goalIndex].goalEnValue[i]
                    }else{
                      return v.goal_list[goalIndex].goalValue[i]
                    }
                  }
                }
              }
              if(language && (j === "goal" || j === "kpi_method" || j === "goal_str")){
                return v.goal_list[goalIndex][j]?v.goal_list[goalIndex][j+'_en']:''
              }else{
                return v.goal_list[goalIndex][j]?v.goal_list[goalIndex][j]:''
              }
            }else{
              return ''
            }
          }else{
            return v[j]
          }
        })
        return result
      })
      return result1
    },
    closeDialog(){
      this.selectcloumnDrawer = false
      this.$bus.$emit('refershcolumn')
    },
  }
}
</script>
<style scoped>
.exportBtn{
    float: right;
    margin: 4px auto;
}
::v-deep .el-dialog__header {
    background-color: #ecf1f6;
    margin-bottom: 4px;
}
::v-deep .el-dialog__body {
    padding: 2px 20px 20px;
}
</style>