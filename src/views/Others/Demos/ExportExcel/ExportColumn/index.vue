<template>
    <div>
        <div class="dialog_body">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" style="float:left">全选</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="checkedColumn" @change="handleCheckedColumnChange" class="flexcolumn">
                <el-checkbox style="display:flex;white-space:normal;width:142px;margin-right:10px;word-break:break-word;height:30px;" v-for="itemKey in columnList" :label="itemKey" :key="itemKey.name">{{itemKey.name}}</el-checkbox>
            </el-checkbox-group>
        </div>
        <div class="right_sub_btn">
            <el-button type="primary" @click="exportExcel">确定导出</el-button>
            <el-button @click="resetexportColumn">重置</el-button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ExportColumn',
    props:{columnList:Array},
    data() {
        return {
            checkAll:false,
            checkedColumn:[],
            isIndeterminate:false
        }
    },
    mounted(){
        this.$bus.$on('refershcolumn',this.resetexportColumn)
        console.log(this.columnList);
    },
    methods:{
        handleCheckAllChange(val) {
            this.checkedColumn = val ? [...this.columnList] : [];
            this.isIndeterminate = false;
        },
        handleCheckedColumnChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.columnList.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.columnList.length;
        },
        exportExcel(){
            if(this.checkedColumn.length === 0){
                this.openmessage()
            }else{
                this.$emit('exportExcel',this.checkedColumn)
            }
        },
        openmessage(){
            this.$message({message: '请选择导出列',type: 'error',offset:200,duration:2000})
        },
        resetexportColumn(){
            this.checkedColumn.splice(0,this.checkedColumn.length)
            this.checkAll = false
            this.isIndeterminate = false
        },
    }
}
</script>
<style scoped>
.dialog_body{
    margin-bottom: 50px;
}
.right_sub_btn{
    position: absolute;
    right: 10px;
    bottom: 20px;
}
.flexcolumn{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: left;
}
</style>