<template>
  <div>
    <el-tag style="float:right">{{drag?'拖拽中...':'拖拽停止'}}</el-tag>
    <h3>使用vuedraggable插件</h3>
    <h4>行拖动</h4>
    <draggable v-model="myArray" chosenClass="chosen" handle=".move" :move="checkMove" @start="onStart" @end="onEnd">
      <transition-group>
      <div class="draggableitem" v-for="item in myArray" :key="item.id">
        <i style="float:left" class="el-icon-thumb move"></i>
        <span>姓名：{{item.name}}</span>
        <span>日期：{{item.date}}</span>
        <span>地址：{{item.address}}</span>
      </div>
      </transition-group>
    </draggable>
    <h4>列拖动</h4>
    <div class="backDiv">
      <div class="col">
        <div class="title">男</div>
        <!-- <div style="min-height:40px"> -->
          <draggable v-model="category1" group="site" animation="300" dragClass="dragClass"  ghostClass="ghostClass" chosenClass="chosenClass" @end="onColumnEnd">
          <transition-group style="min-height:40px;display:block">
            <div class="draggableitem" v-for="item in category1" :key="item.id">{{item.name}}</div>
          </transition-group>
        </draggable> 
        <!-- </div> -->
      </div>
      <div class="col">
        <div class="title" >女</div>
        <draggable v-model="category2" group="site" animation="300" dragClass="dragClass"  ghostClass="ghostClass" chosenClass="chosenClass" @end="onColumnEnd">
          <transition-group>
            <div class="draggableitem" v-for="item in category2" :key="item.id">{{item.name}}</div>
          </transition-group>
        </draggable> 
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  name: "listDrag",
  components:{
    draggable
  },
  data() {
    return {
      drag:false,
      myArray: [
        {
          id: 1,
          date: "2022-05-02",
          name: "张三",
          address: "广州市",
        },
        {
          id: 2,
          date: "2022-05-04",
          name: "李四",
          address: "深圳市",
        },
        {
          id: 3,
          date: "2022-05-01",
          name: "王五",
          address: "中国香港",
        },
        {
          id: 4,
          date: "2022-05-03",
          name: "老六",
          address: "中国澳门",
        },
      ],
      category1:[{id:1,name:'张三'},{id:2,name:'李四'},{id:3,name:'王五'}],
      category2:[{id:4,name:'老六'},{id:5,name:'赵七'},{id:6,name:'孙八'}],
    };
  },
  mounted() {
  },
  methods: {
    checkMove() {
      return true;
    },
    //开始拖拽事件
    onStart(){
      this.drag=true;
    },
    //拖拽结束事件
    onEnd() {
      this.drag=false;
      console.log(this.myArray);
    },
    onColumnEnd(){
      console.log(this.category1,this.category2);
    }
  },
};
</script>
<style scoped>
.draggableitem{
  padding: 10px 5px;
  border: 1px solid #e4e4e4;
  width: 50%;
  margin: 4px auto;
}
.chosen {
  border: solid 1px #3089dc !important;
  background-color: #3089dc;
}
.ghostClass{
  background-color:  blue !important;
}
.chosenClass{
  background-color: red !important;
  opacity: 1!important;
}
.dragClass{
  background-color: blueviolet !important;
  opacity: 1 !important;
  box-shadow:none !important;
  outline:none !important;
  background-image:none !important;
}
.backDiv{
  background-color: #e4e4e4;
}
.title{
  padding: 6px 12px;
}
.col{
  width: 40%;
  flex: 1;
  padding: 10px;
  border: solid 1px #eee;
  border-radius:5px ;
  float: left;
}
.col+.col{
 margin-left: 10px;
}
</style>
