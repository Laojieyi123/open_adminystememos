<template>
    <div>
        <span class="l-content">
            <el-button plain icon="el-icon-menu" size="mini" @click="changeCollapse"></el-button>
        </span>
        <span class="r-content">
            <img class="headerImg" :src="userImg" alt=""/>
        </span>
    </div>
</template>
<script>
export default {
    name:'CommonHeader',
    data() {
        return {
            userImg:require('../../../assets/images/user.png'),
            isCollapse:false,
        }
    },
    methods:{
        changeCollapse(){
            this.isCollapse = !this.isCollapse
            this.$emit('changeCollapse',this.isCollapse)
        }
    }
}
</script>
<style scoped>
.l-content{
    float: left;
    height: 60px;
    line-height: 60px;
}
.r-content{
    float: right;
    height: 60px;
    line-height: 60px;
    padding: 10px 0;
}
.headerImg{
    width: 40px;
    height: 40px;
    border-radius: 20px;
}
</style>