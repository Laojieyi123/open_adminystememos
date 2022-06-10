<template>
  <div>
    <div style="margin: 10px">
      <el-button style="width: 49%" @click="saveModify">保存修改</el-button>
      <el-button style="width: 49%" @click="exportWord">导出word</el-button>
    </div>
    <!-- 富文本编辑器 -->
    <Editor
      id="tinymce"
      v-model="articleContent"
      :init="editorInit"
      :key="tinymceFlag"
    ></Editor>
  </div>
</template>
<script>
//引入jQuery和导出Word的JS文件
import $ from "jquery";
require("@/assets/js/jquery.wordexport.js");
// 引入组件
import tinymce from "tinymce/tinymce";
import Editor from "@tinymce/tinymce-vue";
//引入工具栏图标和主题
import "tinymce/icons/default/icons";
import "tinymce/themes/silver";
// 引入富文本编辑器主题的js和css
import "tinymce/themes/silver/theme.min";
import "tinymce/skins/ui/oxide/skin.min.css";
// 扩展插件 - 根据需要引入
import "tinymce/plugins/image";
import "tinymce/plugins/link";
import "tinymce/plugins/code";
import "tinymce/plugins/table";
import "tinymce/plugins/lists";
import "tinymce/plugins/wordcount"; // 字数统计插件
import "tinymce/plugins/media"; // 插入视频插件
import "tinymce/plugins/template"; // 模板插件
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/paste";
import "tinymce/plugins/preview";
export default {
  name: "TinymceEditor",
  components: { Editor },
  props: {
    height: {
      type: Number,
      default: 500,
    },
    //从后台获取的字符串HTML数据，
    value: {
      type: String,
      // 这里我设定个默认值，实际开发中可至为空 - default:"",根据需求修改。
      default: `<table style="border-collapse: collapse;" border="1" width="100%" cellspacing="0" cellpadding="0"><tbody><tr><td colspan="5" width="600"><p><strong>一、岗位基本情况</strong></p></td></tr><tr><td width="80"><p style="text-align: center;"><strong>岗位名称</strong></p></td><td colspan="2" width="241"><p style="text-align: center;"></p></td><td width="87"><p style="text-align: center;"><strong>岗位编号</strong></p></td><td width="234"><p style="text-align: center;">&nbsp;</p></td></tr><tr><td width="80"><p style="text-align: center;"><strong>所属部门</strong></p></td><td colspan="2" width="241"><p style="text-align: center;"></p></td><td width="87"><p style="text-align: center;"><strong>直接上级</strong></p></td><td width="234"><p style="text-align: center;">部门主管</p></td></tr><tr><td colspan="5" width="643"><p><strong>二、岗位目的</strong><span style="color: #969696;">（描述该职位的设立目的，突出对组织独一无二的贡献）</span></p></td></tr><tr><td colspan="5" width="643"><p></p></td></tr><tr><td colspan="5" width="643"><p><strong>三、岗位职责</strong><span style="color: #969696;">（该职位承担对公司的主要职责，按重要顺序列出每项主要工作职责）</span></p></td></tr><tr><td colspan="5" width="643"><p>1、</p></td></tr><tr><td colspan="5" width="643"><p><strong>四、任职资格</strong><span style="color: #969696;">（该岗位所需的最低资格要求，包括学历、专业、能力要求）</span></p></td></tr><tr><td colspan="2" width="95"><p>学历、专业</p></td><td colspan="3" width="548"><p><strong>全日制大专以上学历</strong></p></td></tr><tr><td colspan="2" width="95"><p>工作经验</p></td><td colspan="3" width="548"><p>２年以上工作经验，１年以上文员工作经验。</p></td></tr><tr><td colspan="2" width="95"><p>知识、技能</p></td><td colspan="3" width="548"><p>熟练操作word 和excel等办公软件</p></td></tr><tr><td colspan="5" width="643"><p><strong>五、工作环境</strong><span style="color: #969696;">（即该岗位从事工作所处的环境，包括：办公室、有无空调、有无粉尘、有害物质等）</span></p></td></tr><tr><td colspan="5" width="643"><p>办公室，有空调</p></td></tr></tbody></table>`,
    },
    // 基本路径，默认为空根目录，如果你的项目发布后的地址为目录形式，
    // 即abc.com/tinymce，baseUrl需要配置成tinymce，不然发布后资源会找不到
    baseUrl: {
      type: String,
      default: "",
    },
    plugins: {
      //使用的插件 - 根据需求进行删减
      type: [String, Array],
      default:
        "link lists image code table wordcount media fullscreen paste preview",
    },
    toolbar: {
      //工具栏 - 根据需求进行删减
      type: [String, Array],
      default:
        "fontselect | bold italic underline strikethrough | link unlink image | undo redo | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | code | removeformat",
    },
  },
  data() {
    return {
      articleContent: this.value,
      tinymceFlag: "",
      editorInit: {
        language_url: "tinymce/langs/zh_CN.js", //引用public下的文件
        language: "zh_CN",
        skin_url: "tinymce/skins/ui/oxide",
        content_css: "tinymce/skins/content/default/content.css",
        height: this.height,
        content_style:
          "* { padding:0; margin:0; } img {max-width:100% !important }",
        plugin_preview_width: 375, // 预览宽度
        plugin_preview_height: 668,
        lineheight_val:
          "1 1.1 1.2 1.3 1.35 1.4 1.5 1.55 1.6 1.75 1.8 1.9 1.95 2 2.1 2.2 2.3 2.4 2.5 2.6 2.7 2.8 3 3.1 3.2 3.3 3.4 4 5",
        fontsize_formats:
          "8pt 10pt 11pt 12pt 13pt 14pt 15pt 16pt 17pt 18pt 24pt 36pt",
        font_formats:
          "微软雅黑='微软雅黑';宋体='宋体';黑体='黑体';仿宋='仿宋';楷体='楷体';隶书='隶书';幼圆='幼圆';Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings",
        plugins: this.plugins,
        powerpaste_word_import: "merge",
        toolbar: this.toolbar,
        paste_data_images: true,
        statusbar: true, // 底部的状态栏
        menubar: true, // 最上方的菜单
        branding: false, // 水印“Powered by TinyMCE”
        //上传图片配置
        images_upload_handler: (blobInfo, success) => {
          const img = "data:image/jpeg;base64," + blobInfo.base64();
          success(img);
        },
      },
    };
  },
  mounted() {
    tinymce.init({});
  },
  methods: {
    // 导出word
    exportWord() {
      setTimeout(function () {
        // 找到编辑框里面的dom对象
        var dom = $("#tinymce_ifr")[0].contentDocument.documentElement;
        $(dom).wordExport("岗位职责表");
      }, 300);
    },
    saveModify() {
      //获取编辑器的内容，获取的是html，也就是包括标签和样式的内容。
      var content = tinymce.get("tinymce").getContent();
      console.log(content);
      //发送请求
    },
  },
};
</script>
