<template>
    <div>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-menu-item index="1">表格中拖拽行</el-menu-item>
            <el-menu-item index="2">列表中拖拽行</el-menu-item>
        </el-menu>
        <section>
            <tableDrag v-if="activeIndex === '1'"></tableDrag>
            <listDrag v-if="activeIndex === '2'"></listDrag>
        </section>
    </div>
</template>
<script>
import listDrag from '@/views/Others/DragSort/listDrag'
import tableDrag from '@/views/Others/DragSort/tableDrag'
export default {
    name:'DragSort',
    components:{
        listDrag,
        tableDrag,
    },
    data() {
        return {
            activeIndex:'1',
        }
    },
    methods:{
        handleSelect(key){
          this.activeIndex = key
        },
        handleImgUpload(blobInfo, success, failure){
            console.log(blobInfo, success, failure);
        }
    }
}
</script>