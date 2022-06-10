<template>
   <div>
       <el-popover placement="bottom" width="320" trigger="click" v-model="showBox">
       <!-- el-input输入框：readonly和clearable属性不能同时使用 -->
        <el-input slot="reference" @focus="focusselect" class="inputStyle" v-model="inputValue" type="text" readonly :placeholder="language==='zh'?'请选择月份':'Please select the month'" v-if="category === 'monthly'">
            <i slot="prefix" class="el-input__icon el-icon-date"></i>
            <!-- 清空图标：有内容的时候渲染出来，鼠标hover到input框的时候再显示出来（即：输入框有内容并且鼠标悬浮时显示该图标） -->
            <i slot="suffix" class="el-input__icon el-icon-circle-close clearIconStyle" v-if="showClear" @click="resetMonth"></i>
        </el-input>
        <el-input slot="reference" @focus="focusselect" class="inputStyle" v-model="inputValue" type="text" readonly :placeholder="language==='zh'?'请选择季度':'Please select the quarter'" v-else-if="category === 'quarterly'">
            <i slot="prefix" class="el-input__icon el-icon-date"></i>
            <i slot="suffix" class="el-input__icon el-icon-circle-close clearIconStyle" v-if="showClear" @click="resetMonth"></i>
        </el-input>
        <el-input slot="reference" @focus="focusselect" class="inputStyle" v-model="inputValue" type="text" readonly :placeholder="language==='zh'?'请选择年份':'Please select the year'" v-else-if="category === 'annual'">
            <i slot="prefix" class="el-input__icon el-icon-date"></i>
            <i slot="suffix" class="el-input__icon el-icon-circle-close clearIconStyle" v-if="showClear" @click="resetMonth"></i>
        </el-input>
        <!-- 年份月份选择弹框 -->
        <div>
           <div class="contentArea">
               <!-- header年份 -->
                <div v-if="category !== 'annual'" style="display:flex;padding:0 0 10px 0;;border-bottom: 1px solid #e5e5e5;text-align:center">
                    <div v-if="curIndex == DateList.length - 1" style="width: 15%;"><i class="el-icon-d-arrow-left"  style="opacity:0.3;"></i></div>
                    <div v-else @click="reduceYear" style="width: 15%;"><i class="el-icon-d-arrow-left"></i></div>
                    <div style="width: 70%;">{{OneY}}</div>
                    <div v-if="curIndex == 0" style="width: 15%;"><i class="el-icon-d-arrow-right" style="opacity:0.3;"></i></div>
                    <div v-else @click="addYear" style="width: 15%;"><i class="el-icon-d-arrow-right"></i></div>
                </div>
                <div v-else style="display:flex;padding: 15px 0;border-bottom: 1px solid #e5e5e5;text-align:center">
                    <div v-if="isReduce" style="width: 15%;"><i class="el-icon-d-arrow-left" style="opacity:0.3;"></i></div>
                    <div v-else @click="reduceYear" style="width: 15%;"><i class="el-icon-d-arrow-left"></i></div>
                    <div style="width: 70%;">{{yearStart}}--{{yearEnd}}</div>
                    <div v-if="isAdd" style="width: 15%;"><i class="el-icon-d-arrow-right" style="opacity:0.3;"></i></div>
                    <div v-else @click="addYear" style="width: 15%;"><i class="el-icon-d-arrow-right"></i></div>
                </div>
                <!-- 月份 -->
                <div class="conterList" v-if="category === 'monthly'">
                    <el-checkbox-group v-model="optTime[curIndex].queryTime" @change="onChange" v-if="language === 'zh'">
                        <el-checkbox :disabled="isDisabled[index]" class="onSelect onMonthlySelect" v-for="(item,index) in DateList[curIndex].queryTime" :key="index" :label="`${DateList[curIndex].TimeYear}-${(item<=9)?`0${item}`:item}`">
                        {{monthMap[item]}}
                        </el-checkbox>
                    </el-checkbox-group>
                    <el-checkbox-group v-model="optTime[curIndex].queryTime" @change="onChange" v-else-if="language === 'en'">
                        <el-checkbox :disabled="isDisabled[index]" class="onSelect onMonthlySelect" v-for="(item,index) in DateList[curIndex].queryTime" :key="index" :label="`${DateList[curIndex].TimeYear}-${(item<=9)?`0${item}`:item}`">
                        {{monthMapEn[item]}}
                        </el-checkbox>
                    </el-checkbox-group>
                </div>
                <!-- 季度 -->
                <div class="conterList" v-else-if="category === 'quarterly'">
                    <el-checkbox-group ref="checkList" v-model="optTime[curIndex].queryTime" @change="onChange" v-if="language === 'zh'">
                        <el-checkbox :disabled="isDisabled[index]" class="onSelect onQuarterlySelect" v-for="(item,index) in DateList[curIndex].queryTime" :key="index" :label="`${DateList[curIndex].TimeYear}-Q${item}`">
                        {{quarterMap[item]}}
                        </el-checkbox>
                    </el-checkbox-group>
                    <el-checkbox-group v-model="optTime[curIndex].queryTime" @change="onChange" v-else-if="language === 'en'">
                        <el-checkbox :disabled="isDisabled[index]" class="onSelect onQuarterlySelect" v-for="(item,index) in DateList[curIndex].queryTime" :key="index" :label="`${DateList[curIndex].TimeYear}-Q${item}`">
                        {{quarterMapEn[item]}}
                        </el-checkbox>
                    </el-checkbox-group>
                </div>
                <!-- 年度 -->
                <div class="conterList" v-else-if="category === 'annual'">
                    <el-checkbox-group v-model="optTime" @change="onChange">
                        <el-checkbox :disabled="isDisabled[index]" class="onSelect onAnnualSelect" v-for="(item,index) in DateList" :key="index" :label="`${item}`">
                        {{item}}
                        </el-checkbox>
                    </el-checkbox-group>
                </div>
            </div>
            <!-- 按钮 -->
            <div class="buttonBox">
                <el-button size="mini" type="primary" plain @click.stop="handleSubmit">{{language==='zh'?'确定':'OK'}}</el-button>
                <el-button size="mini" plain @click.stop="resetMonth">{{language==='zh'?'重置':'Reset'}}</el-button>
            </div>
       </div>
       </el-popover>
   </div>
</template>
<script>
export default {
    name:"MultipleMonthQuarterYear",
    props:{
        category:{ type: String,default:'monthly'},
        canSelectList: { type: Array,default:()=>[]},//可选择的日期列表
        isHasfilter:{ type: Boolean,default:false},//为true需要传canSelectList
        language:{ type: String,default:'zh'},
    },
    data(){
        return{
            DateList: [], // 年份月份数组
            optTime: [], // 当前选中的结果数组
            OneY: '', // 当前年份
            curIndex: 0, // 当前年份下标值
            yearStart: 2002, // 当前开始年份
            yearEnd: 2021, // 当前结束年份
            optTimes: [], // 点击月份时的所有选中结果
            resultTimes: [], // 点击“确定”按钮后的选择结果
            showBox: false, // 是否显示月份选择弹框
            inputValue: '', // 输入框的绑定值
            showClear: false, // 是否显示输入框右边的“清空”小图标
            monthMap: {'1': '一月', '2': '二月', '3': '三月', '4': '四月', '5': '五月', '6': '六月', '7': '七月', '8': '八月', '9': '九月', '10': '十月', '11': '十一月', '12': '十二月'},
            monthMapEn: {'1': 'Jan', '2': 'Feb', '3': 'Mar', '4': 'Apr', '5': 'May', '6': 'Jun', '7': 'Jul', '8': 'Aug', '9': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'},
            quarterMap: {'1': '第1季度', '2': '第2季度', '3': '第3季度', '4': '第4季度'},
            quarterMapEn: {'1': 'Q1th', '2': 'Q2nd', '3': 'Q3rd', '4': 'Q4th'},
            selectList:[],//可选择的日期数据
            months:["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
            quarters:["01", "04", "07", "10"],
            isDisabled:Array.from({length:12}).map(()=>{return false}),
        }
    },
    created(){
        this.init();
    },
    watch: {
      canSelectList:{
        handler(newVal){
            this.selectList = JSON.parse(JSON.stringify(newVal))
            this.selectList.map((item) =>{
                return item.start_time.slice(0,4)+'-'+item.start_time.slice(5,7)
            })
        },
        deep: true,
      },
    },
    computed:{
        isAdd(){
            let Dates = new Date();
            return this.yearEnd === Dates.getFullYear()
        },
        isReduce(){
            let Dates = new Date();
            return this.yearEnd === Dates.getFullYear()-11
        }
    },
    methods:{
         //聚焦input时设定可选择项
        focusselect(){
            this.$nextTick(()=>{
                var lis 
                switch (this.category) {
                    case 'monthly':
                        lis = document.getElementsByClassName("onMonthlySelect");
                        break;
                    case 'quarterly':
                        lis = document.getElementsByClassName("onQuarterlySelect");
                        break;
                    case 'annual':
                        lis = document.getElementsByClassName("onAnnualSelect");
                        break;
                }
                const lists = Array.from(lis)
                this.isDisabled = Array.from({length:lists.length}).map(()=>{return true})
                if(this.isHasfilter){
                    for(var j = 0; j < this.selectList.length; j++){
                        for(var i = 0; i < lists.length; i++){
                            if(this.category === 'monthly'){
                                let text = this.changeMonthFomat(lists[i].innerText)
                                if(Number(this.selectList[j].start_time.slice(0,4)) == this.OneY && text === this.selectList[j].start_time.slice(5,7)){
                                    this.isDisabled.splice(i,1,false)
                                }
                            }else if(this.category === 'quarterly'){
                                let text = this.changeQuarterFomat(lists[i].innerText)
                                if(Number(this.selectList[j].start_time.slice(0,4)) == this.OneY && text === this.selectList[j].start_time.slice(5,7)){
                                    this.isDisabled.splice(i,1,false)
                                }
                            }else if(this.category === 'annual'){
                                let text = lists[i].innerText
                                if(Number(this.selectList[j].start_time.slice(0,4)) == text){
                                    this.isDisabled.splice(i,1,false)
                                }
                            }
                        }
                    }
                }else{
                    this.isDisabled = Array.from({length:lists.length}).map(()=>{return false})
                }
            })
        },
        //将'一月/Jan'格式化为'01'格式
        changeMonthFomat(text){
            let ret = Object.values(this.language=== 'zh'?this.monthMap:this.monthMapEn)
            var index = 0
            for(var i = 0; i < ret.length; i++){
                if(text.trim() == ret[i]){
                    index = i
                }
            }
            return this.months[index]
        },
        //将'第1季度'格式化为'01'格式、'第2季度'格式化为'04'格式
        changeQuarterFomat(text){
            let ret = Object.values(this.language=== 'zh'?this.quarterMap:this.quarterMapEn)
            var index = 0
            for(var i = 0; i < ret.length; i++){
                if(text.trim() == ret[i]){
                    index = i
                }
            }
            return this.quarters[index]
        },
        // 初始化数据，获取前20年，然后循环 每一年里面都有12个月的 得到数组 opTime 和 DateList
        init(){
            if(this.category !== 'annual'){
                let _opt = [];
                let _optTime = []
                let arr = []
                if(this.category === 'quarterly'){
                    arr = new Array(4);
                }else if(this.category === 'monthly'){
                    arr = new Array(12);
                }
                let optDate = this.getDateList();
                optDate.map((item,index)=>{
                    // 月份选择时el-checkbox-group绑定的值
                    _optTime[index] = {
                        TimeYear: item,
                        queryTime: []
                    }
                    // 给每一年份设置12个月份，el-checkbox初始化显示时使用
                    _opt[index] = {
                        TimeYear: item, 
                        queryTime: []
                    }
                    for(let i = 1; i<= arr.length; i++){
                        _opt[index].queryTime.push(i)
                    }
                })
                this.optTime = _optTime
                this.DateList = _opt;
            }else{
                let Dates = new Date();
                this.yearEnd = Dates.getFullYear();
                this.yearStart = this.yearEnd-11;
                let optDate = [];
                for( let i = this.yearEnd - 11; i <= this.yearEnd; i++ ){
                    optDate.push(i)
                }
                this.DateList = optDate
            }
        },
        // 获取近20年年份列表，倒序排列，最新一年在最前面
        getDateList(){
            let Dates = new Date();
            let year = Dates.getFullYear();
            this.OneY = year;
            let  optDate = [];
            for( let i = year - 20; i <= year; i++ ){
                optDate.push(i)
            }
            return optDate.reverse()
        },
        // 确定
        handleSubmit(){
            // 更新输入框的值
            this.inputValue = this.optTimes.join(',')
            // 根据输入框是否有值来判断清空图标是否渲染
            this.showClear = this.inputValue == '' ? false : true
            // 将点击“确定”按钮的选择结果保存起来（该值将在哪里使用：在点击弹框以外区域关闭弹框时使用，mounted中）
            this.resultTimes = this.optTimes
            // 关闭弹框
            this.showBox = false
            this.$emit('getMultiple',this.resultTimes,this.category)
        },
        // 重置
        resetMonth() {
            // 将年份重置到当前年份
            let Dates = new Date();
            let year = Dates.getFullYear();
            if(this.category === 'annual'){
                this.yearStart = year-11;
                this.yearEnd = year;
                // 将已选择的月份清空
                this.optTime =[]
            }else{
                this.OneY = year;
                // 将已选择的月份清空
                for( let i in this.optTime){
                    this.optTime[i].queryTime =[]
                }
            }
            // 将已选择的月份清空
            this.optTimes = [];
            // 将输入框清空
            this.inputValue = ''
            // 根据输入框是否有值来判断清空图标是否渲染，此处必然不渲染
            this.showClear = false
            // 将点击“确定”按钮的选择结果清空
            this.resultTimes = []
            // 关闭月份选择弹框
            this.showBox = false
            this.$emit('getMultiple',[])
            if(this.category !== 'annual') this.curIndex = 0
        },
        // 左上角年份减少
        reduceYear() {
            if(this.category !== 'annual'){
                // 如果已经是最后一年了，则年份不能再减少了
                if(this.curIndex == this.DateList.length - 1) return;
                // 当前下标值+1，根据下标值获取年份值
                this.curIndex = this.curIndex + 1
                this.OneY = this.DateList[this.curIndex].TimeYear
                //自定义禁用的checkBox
                this.focusselect()
            }else{
                let Dates = new Date();
                if(this.yearEnd === Dates.getFullYear()-11) return;
                this.yearStart -= 11
                this.yearEnd -= 11
                let  optDate = [];
                for( let i = this.yearEnd - 11; i <= this.yearEnd; i++ ){
                    optDate.push(i)
                }
                this.DateList = optDate
            }
        },
        // 左上角年份增加
        addYear() {
            if(this.category !== 'annual'){
                // 如果已经是当前年份了，则年份不能再增加了
                if(this.curIndex == 0) return;
                // 当前下标值-1，根据下标值获取年份值
                this.curIndex = this.curIndex - 1
                this.OneY = this.DateList[this.curIndex].TimeYear
                this.focusselect()
            }else{
                let Dates = new Date();
                if(this.yearEnd === Dates.getFullYear()) return;
                this.yearStart += 11
                this.yearEnd += 11
                let  optDate = [];
                for( let i = this.yearEnd - 11; i <= this.yearEnd; i++ ){
                    optDate.push(i)
                }
                this.DateList = optDate
            }
        },
        // 选择日期
        onChange(){
            const _this = this;
            // 遍历optTime中已选择的日期，将已选结果塞到optTimes数组中
            let _opt = _this.optTime;
            let arr = [];
            if(this.category !== 'annual'){
              for(let item in _opt ){
                if(_opt[item].queryTime.length > 0){
                    _opt[item].queryTime = _opt[item].queryTime.map( p => {
                        if(this.category === 'quarterly'){
                            p = p.slice(0,4)+'-Q'+p.slice(6,7)
                        }
                        arr.push(p)
                        return p
                    })
                }
              }
            }else{
                if(_opt.length > 0){
                  _opt = _opt.map( p => {
                    p = p.slice(0,4)
                    arr.push(p)
                    return p
                  })
              }
            }
            this.optTimes = arr
            // 更新输入框的值
            this.inputValue = this.optTimes.join(',')
            // 根据输入框是否有值来判断清空图标是否渲染
            this.showClear = this.inputValue == '' ? false : true
        }
    }
}
</script>
<style scoped>
.inputStyle {
    width: 300px;
}
.clearIconStyle {
    display: none;
}
.inputStyle:hover .clearIconStyle{
    display: block;
}
.buttonBox {
    border-top: 1px solid #e5e5e5;
    padding: 7px;
    text-align: center;
}
.contentArea {
    width: 320px;
}
.conterList .onSelect{
    width: 60px!important;
    height: 36px;
    line-height: 36px;
    margin: 10px;
    text-align: center;
    border-radius: 20px;
}
.conterList .onSelect:hover{
    color: #FFF;
    background-color: #409EFF;
}
::v-deep .el-checkbox__input.is-checked+.el-checkbox__label{
    color: #FFF;
    background-color: #409EFF;
    width: 60px!important;
    height: 36px;
    line-height: 36px;
    text-align: center;
    border-radius: 20px;
    padding: 0;
}
::v-deep .el-checkbox__label{
    padding: 0;
}
::v-deep .el-checkbox__inner{
    display: none;
}
</style>