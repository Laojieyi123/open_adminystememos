<template>
    <div>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-menu-item index="1">Tinymce编辑器</el-menu-item>
            <el-menu-item index="2">CKEditor编辑器</el-menu-item>
        </el-menu>
        <section>
            <Tinymce v-if="activeIndex === '1'"></Tinymce>
            <CKEditor v-if="activeIndex === '2'"></CKEditor>
        </section>
    </div>
</template>
<script>
import Tinymce from '@/views/Others/Editor/TinymceEditor'
import CKEditor from '@/views/Others/Editor/CKEditor'
export default {
    name:'Editor',
    components:{
        Tinymce,
        CKEditor,
    },
    data() {
        return {
            activeIndex:'1',
        }
    },
    methods:{
        handleSelect(key, keyPath){
          console.log(key, keyPath);
          this.activeIndex = key
        },
        handleImgUpload(blobInfo, success, failure){
            console.log(blobInfo, success, failure);
        }
    }
}
</script>