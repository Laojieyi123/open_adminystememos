<template>
  <div id="app">
    <el-container style="height:100%">
        <el-aside width="auto">
          <CommonAside :isCollapse="isCollapse"></CommonAside>
        </el-aside>
        <el-container>
          <el-header>
            <CommonHeader @changeCollapse="changeCollapse"></CommonHeader>
          </el-header>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container> 
  </div>
</template>

<script>
import CommonAside from '@/components/public/CommonAside'
import CommonHeader from '@/components/public/CommonHeader'

export default {
  name: 'App',
  components:{
    CommonAside,
    CommonHeader,
  },
  data() {
    return {
      isCollapse:false,
    }
  },
  methods:{
    changeCollapse(status){
      this.isCollapse = status
    }
  }
}
</script>

<style>
html,body{
  margin: 0;
  padding: 0;
}
#app {
  text-align: center;
  height: 100vh;
}
.el-main{
  padding: 0!important;
}
.el-header{
  height: 60px;
  padding: 0 10px;
  border-bottom: 1px solid #e8ebf0;
  color: #2e4354;
  background-color: #ecf5ff;
}
</style>
