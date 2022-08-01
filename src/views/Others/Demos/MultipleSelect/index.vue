<template>
  <el-select
    multiple 
    v-model="selectNameArr"  
    placeholder="请选择" 
    clearable
    :style="{'width':width}"
    @focus="autoFocusInput('search_input1')"
    @change="changeSelectBrand" 
    @remove-tag="removeTag"
    popper-class="select-multiple">
    <template slot="empty">
      <el-row style="padding:6px 10px 0" v-if="!inputVisible">
        <el-col :span="18">
          <span>选择收件人：</span>
          <el-input class="search_input" size="mini" style="width:calc(100% - 100px)" v-model="searchValue" placeholder="请输入关键字搜索" clearable @input="searchUser"></el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" size="mini" @click.native="selectAll()">全选</el-button>
          <el-button type="warning" size="mini" @click.native="clearAll()">清空</el-button>
        </el-col>
      </el-row>
      <el-divider class="row_divider"></el-divider>
      <div class="el-select-dropdown__empty">无匹配数据</div>
    </template>
    <div class="select-box">
      <el-row type="flex" justify="center" style="padding:0 10px" v-if="inputVisible">
        <el-col :span="18">
          <span>选择收件人：</span>
          <el-input class="search_input1" size="mini" style="width:calc(100% - 100px)" v-model="searchValue" placeholder="请输入关键字搜索" clearable @input="searchUser"></el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" size="mini" @click.native="selectAll()">全选</el-button>
          <el-button type="warning" size="mini" @click.native="clearAll()">清空</el-button>
        </el-col>
      </el-row>
      <el-divider class="row_divider"></el-divider>
      <div class="select-content" v-if="!loading">
        <span v-for="item in receiverNameOptModel" :key="item.id">
          <el-tooltip effect="dark" :open-delay="500" :content="item.name+' '+item.name_en" placement="top">
            <el-option :label="item.name+' '+item.name_en" :value="item.name+' '+item.name_en"></el-option>
          </el-tooltip>
        </span>
      </div>
    </div>
  </el-select>
</template>
<script>
export default {
    name: 'MultipleSelect',
    props:{
      receiverNameOpt: {
          type: Array,
          default: ()=>[]
      },
      width:{
          type: String,
          default:'100%',
      }
    },
    data(){
      return{
        searchValue: '',
        selectNameArr: [],
        receiverNameOptModel: [],
        loading: false,
        inputVisible: false,
      }
    },
    mounted(){
      this.$bus.$on('clearReciever',this.clearAll)
    },
    watch:{
      receiverNameOpt:{
        immediate:true,
        handler(val){
          if(val.length === 0){
            this.loading = true
          }else{
            this.loading = false
          }
          this.receiverNameOptModel = JSON.parse(JSON.stringify(this.receiverNameOpt))
        }
      },
      receiverNameOptModel:{
        immediate:true,
        handler(val){
          if(val.length === 0){
            this.inputVisible = false
            this.autoFocusInput("search_input")
          }else{
            this.inputVisible = true
            this.autoFocusInput("search_input1")
          }
        }
      },
    },
    methods:{
      // 全选全部品类
      selectAll() {
        this.selectNameArr = this.receiverNameOpt.map(p=>p.name+' '+p.name_en)
        let ret =[]
        ret = this.receiverNameOptModel.filter(p=>{ return this.selectNameArr.includes(p.name+p.name_en) })
        this.$emit('getmultipleReceiver',ret)
      },
      // input自动聚焦
      autoFocusInput(classname) {
        this.$nextTick(() => {
          let dom = document.getElementsByClassName(classname)[0];
          if(dom) setTimeout(()=>{ dom.children[0].focus() },200)
        });
      },
      // 选择收件人
      changeSelectBrand(val) {
        let ret =[]
        ret = this.receiverNameOptModel.filter(p=>{return val.includes(p.name+p.name_en)})
        this.$emit('getmultipleReceiver',ret)
      },
      removeTag(val) {
        for(let i=0;i<this.selectNameArr.length;i++){
          if(this.selectNameArr[i] === val) this.selectNameArr.splice(index,1)
        }
      },
      // 清空已选择的收件人
      clearAll() {
        this.selectNameArr.splice(0,this.selectNameArr.length)
        this.searchValue = ''
        this.receiverNameOptModel = JSON.parse(JSON.stringify(this.receiverNameOpt))
      },
      // 搜索用户收件人
      searchUser(query) {
        if (query !== '') {
          this.receiverNameOptModel = this.receiverNameOpt.filter((p)=>{
            return p.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()) || p.name_en.toLocaleLowerCase().includes(query.toLocaleLowerCase())
          })
        } else {
          this.receiverNameOptModel = JSON.parse(JSON.stringify(this.receiverNameOpt))
        }
      },
    }
}
</script>
<style>
.select-multiple.is-multiple{
  width: 50%;
}
</style>
<style scoped>
.select-multiple .select-content {
  height: max-content;
  height: -webkit-max-content;
  height: -moz-max-content;
  max-height: 200px;
  overflow: hidden;
  overflow-y: auto;
}
.select-multiple .select-content::-webkit-scrollbar{
  width: 2px!important;
}
.select-multiple .el-select-dropdown__item {
  width: 33%;
  height: 26px;
  line-height: 26px;
  margin-right: 1px;
  padding: 0 10px;
  display: inline-block;
  border-bottom: 1px solid #cccccc40;
  border-right: 1px solid #cccccc40;
  box-shadow: 1px 1px 4px #e4e4e4;
}
.select-multiple .el-select-dropdown__item.selected:hover,
.select-multiple .el-select-dropdown__item:hover{
  color: #fff;
  background-color: #409EFF;
}
::v-deep .el-select__tags-text {
  display: inline-block;
  max-width: 80px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.is-multiple .select-content ::v-deep .el-select-dropdown__item.selected::after{
  right: 2px!important;
}
::v-deep .el-select__tags {
  flex-wrap: nowrap;
  overflow-x: auto;
  margin-left: 3px;
}
::v-deep .el-select__tags::-webkit-scrollbar{
  height: 2px;
  border-radius: 1px;
  background-color: #e4e4e4;
}
.row_divider{
  margin: 6px 0;
}
</style>