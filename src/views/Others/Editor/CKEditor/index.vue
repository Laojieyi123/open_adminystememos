<template>
  <div>
    <div id="toolbar-container"></div>
    <div ref="editor" id="editor">
      <p>This is the initial editor content.</p>
    </div>
    <el-button @click="saveDate">保存</el-button>
    <el-button @click="exportWord">导出</el-button>
  </div>
</template>
<script>
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import "@ckeditor/ckeditor5-build-decoupled-document/build/translations/zh-cn.js";
// import Table from '@ckeditor/ckeditor5-table/src/table';
// import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
// import TableProperties from '@ckeditor/ckeditor5-table/src/tableproperties';
// import TableCellProperties from '@ckeditor/ckeditor5-table/src/tablecellproperties';
import $ from "jquery";
require("@/assets/js/jquery.wordexport");

export default {
  name: "ckeditor",
  data() {
    return {
      editor: DecoupledEditor,
      editData:`<table style="border-collapse: collapse;" border="1" width="100%" cellspacing="0" cellpadding="0"><tbody><tr><td colspan="5" width="600"><p><strong>一、岗位基本情况</strong></p></td></tr><tr><td width="80"><p style="text-align: center;"><strong>岗位名称</strong></p></td><td colspan="2" width="241"><p style="text-align: center;"></p></td><td width="87"><p style="text-align: center;"><strong>岗位编号</strong></p></td><td width="234"><p style="text-align: center;">&nbsp;</p></td></tr><tr><td width="80"><p style="text-align: center;"><strong>所属部门</strong></p></td><td colspan="2" width="241"><p style="text-align: center;"></p></td><td width="87"><p style="text-align: center;"><strong>直接上级</strong></p></td><td width="234"><p style="text-align: center;">部门主管</p></td></tr><tr><td colspan="5" width="643"><p><strong>二、岗位目的</strong><span style="color: #969696;">（描述该职位的设立目的，突出对组织独一无二的贡献）</span></p></td></tr><tr><td colspan="5" width="643"><p></p></td></tr><tr><td colspan="5" width="643"><p><strong>三、岗位职责</strong><span style="color: #969696;">（该职位承担对公司的主要职责，按重要顺序列出每项主要工作职责）</span></p></td></tr><tr><td colspan="5" width="643"><p>1、</p></td></tr><tr><td colspan="5" width="643"><p><strong>四、任职资格</strong><span style="color: #969696;">（该岗位所需的最低资格要求，包括学历、专业、能力要求）</span></p></td></tr><tr><td colspan="2" width="95"><p>学历、专业</p></td><td colspan="3" width="548"><p><strong>全日制大专以上学历</strong></p></td></tr><tr><td colspan="2" width="95"><p>工作经验</p></td><td colspan="3" width="548"><p>２年以上工作经验，１年以上文员工作经验。</p></td></tr><tr><td colspan="2" width="95"><p>知识、技能</p></td><td colspan="3" width="548"><p>熟练操作word 和excel等办公软件</p></td></tr><tr><td colspan="5" width="643"><p><strong>五、工作环境</strong><span style="color: #969696;">（即该岗位从事工作所处的环境，包括：办公室、有无空调、有无粉尘、有害物质等）</span></p></td></tr><tr><td colspan="5" width="643"><p>办公室，有空调</p></td></tr></tbody></table>`,    };
  },
  mounted() {
    this.initCKEditor();
  },
  methods: {
    initCKEditor() {
      // 初始化编辑器
      DecoupledEditor.create(document.querySelector("#editor"), {
        language: "zh-cn", // 中文
        toolbar: {
          items: [
            "heading",
            "|",
            "fontfamily",
            "fontsize",
            "|",
            "alignment",
            "|",
            "fontColor",
            "fontBackgroundColor",
            "|",
            "bold",
            "italic",
            "strikethrough",
            "underline",
            "|",
            "link",
            "|",
            "outdent",
            "indent",
            "|",
            "bulletedList",
            "numberedList",
            "|",
            "insertTable",
            // "|",
            // "uploadImage",
            // "blockQuote",
            "|",
            "undo",
            "redo",
          ],
          shouldNotGroupWhenFull: true,
        },
        // plugins: [ Table, TableToolbar, TableProperties, TableCellProperties],
        table: {
          contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells', ]
        }
      })
        .then((editor) => {
          const toolbarContainer = document.querySelector("#toolbar-container");
          toolbarContainer.appendChild(editor.ui.view.toolbar.element);
          editor.setData(this.editData);
          editor.getData();
          this.editor = editor;
          console.log(this.editor); 
        })
        .catch((error) => {
          console.error(error);
        });
    },
    saveDate() {
      console.log(this.$refs.editor.innerHTML);
    },
    exportWord() {
      setTimeout(function () {
        $("#editor").wordExport("word文档");
      }, 300);
    },
  },
};
</script>
