<template>
  <div>
    <div class="year-picker-box">
      <el-date-picker :clearable="false" :picker-options="pickerOptions"
        v-model="annual.start"
        type="year"
        popper-class="selectItemStyle"
        size="medium"
        style="width: 120px"
        :placeholder="language==='zh'?'开始年份':'start year'">
      </el-date-picker>
      <span style="margin-left: 5px; margin-right: 5px">~</span>
      <el-date-picker :clearable="false" :picker-options="pickerOptions"
        v-model="annual.end"
        type="year"
        popper-class="selectItemStyle"
        size="medium"
        style="width: 120px; margin-right: 2px"
        :placeholder="language==='zh'?'结束年份':'end year'">
      </el-date-picker>
    </div>
  </div>
</template>

<script>
export default {
  name: 'YearsRange',
  props:{
    canSelectList:{ type: Array,default:()=>[]},//可选择的日期列表
    isHasfilter:{ type: Boolean,default:false},//默认为false，为true需要传canSelectList
    language:{ type: String,default:'zh'},
  },
  data() {
    return {
      years: [1991,new Date().getFullYear()],
      annual:{
        start: null,
        end: null,
      },
      pickerOptions: {
        disabledDate: this.optionsDate
      },
    }
  },
  watch:{
    annual:{
      deep:true,
      handler(val){
        if(val.start && val.end){
          let start = val.start.getFullYear()
          let end = val.end.getFullYear()
          if (start < this.years[0] || end > this.years[this.years.length - 1]) {
            this.$message({ type: 'error', message: this.language==='zh'?'超过年份范围选择，请重新选择。':'The year range is exceeded. Please select a new one.' })
          } else if (val.start > val.end) {
            this.$message.error(this.language==='zh'?'结束年份须大于起始年份，请重新选择。':'The end year must be greater than the start year. Please select a new one.')
          } else {
            this.$emit('getYearRange', start, end)
          }
        }
      }
    }
  },
  methods:{
    optionsDate(time){
      if(this.isHasfilter){
        let date = time.getFullYear()
        let timeList = this.canSelectList.map((item) =>{
          return item.start_time.slice(0,4)
        })
        if(timeList.includes(JSON.stringify(date))){
          return false
        }else{
          return true
        }
      }else{
        return time.getTime() >= Date.now() - 8.64e7
      }
    },
  }
}
</script>

<style scoped>
.year-picker-box {
  padding: 5px;
  width: 340px;
}
</style>
