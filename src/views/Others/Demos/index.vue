<template>
  <div>
    <el-tabs v-model="activeName" type="border-card" style="height: calc(100vh - 62px)">
      <el-tab-pane label="按需导出Excel" name="first">
        <ExportExcel :totaltableList="totaltableList"></ExportExcel>
        <el-table :data="totaltableList" border>
          <el-table-column label="考核名称" prop="kpi_name"></el-table-column>
          <el-table-column label="归属用户" prop="user_name"></el-table-column>
          <el-table-column label="开始日期" prop="start_time"></el-table-column>
          <el-table-column label="操作" width="130px">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>&nbsp;
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="封装日期选择器" name="second">
        <MergeDatePicker :language="language" :isFilter="false" @postFilterCondition="getFilterCondition"></MergeDatePicker>
      </el-tab-pane>
      <el-tab-pane label="自定义select下拉框" name="third">
        <MultipleSelect :width="'50%'" :receiverNameOpt="multipleSelectDataList"></MultipleSelect>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import ExportExcel from "./ExportExcel";
import MergeDatePicker from "./MergeDatePicker";
import MultipleSelect from "./MultipleSelect";

export default {
  name: "Demos",
  components: {
    ExportExcel,
    MergeDatePicker,
    MultipleSelect,
  },
  data() {
    return {
      activeName: "first",
      totaltableList: [
        {
          id: 1,
          kpi_name: "2022年4月月度考核表",
          kpi_name_en: "2022-04-monthly-check-form",
          user_name: "张三",
          start_time: "2022-04-01",
          goal_list: [
            {
              goal: "出勤率",
              goal_en: "attendance rate",
              kpi_method: "出勤率达到100%，迟到一次扣10元。",
              kpi_method_en:
                "If the attendance rate reaches 100%, 10 yuan will be deducted once being late.",
              weight: 50,
              end_score: 99,
            },
            {
              goal: "工作态度",
              goal_en: "working attitude",
              kpi_method: "积极主动，态度端正。",
              kpi_method_en: "Initiative and good attitude.",
              weight: 50,
              end_score: 98,
            },
          ],
        },
        {
          id: 2,
          kpi_name: "2022年5月月度考核表",
          kpi_name_en: "2022-05-monthly-check-form",
          user_name: "李四",
          start_time: "2022-05-01",
          goal_list: [
            {
              goal: "出勤率",
              goal_en: "attendance rate",
              kpi_method: "出勤率达到100%，迟到一次扣10元。",
              kpi_method_en:
                "If the attendance rate reaches 100%, 10 yuan will be deducted once being late.",
              weight: 50,
              end_score: 100,
            },
            {
              goal: "工作态度",
              goal_en: "working attitude",
              kpi_method: "积极主动，态度端正。",
              kpi_method_en: "Initiative and good attitude.",
              weight: 50,
              end_score: 100,
            },
          ],
        },
      ],
      multipleSelectDataList: [
        {
          id: 1,
          name: "张三",
          name_en: "zhangsan",
          age: 20,
          sex: 1,
        },
        {
          id: 2,
          name: "李四",
          name_en: "lisi",
          age: 18,
          sex: 1,
        },
        {
          id: 3,
          name: "王五",
          name_en: "wangwu",
          age: 24,
          sex: 0,
        },
        {
          id: 4,
          name: "赵六",
          name_en: "zhaoliu",
          age: 30,
          sex: 0,
        },
        {
          id: 5,
          name: "张三1",
          name_en: "zhangsan",
          age: 20,
          sex: 1,
        },
        {
          id: 6,
          name: "李四1",
          name_en: "lisi",
          age: 18,
          sex: 1,
        },
        {
          id: 7,
          name: "王五1",
          name_en: "wangwu",
          age: 24,
          sex: 0,
        },
        {
          id: 8,
          name: "赵六1",
          name_en: "zhaoliu",
          age: 30,
          sex: 0,
        },
        {
          id: 9,
          name: "张三2",
          name_en: "zhangsan",
          age: 20,
          sex: 1,
        },
        {
          id: 10,
          name: "李四2",
          name_en: "lisi",
          age: 18,
          sex: 1,
        },
        {
          id: 11,
          name: "王五2",
          name_en: "wangwu",
          age: 24,
          sex: 0,
        },
        {
          id: 12,
          name: "赵六2",
          name_en: "zhaoliu",
          age: 30,
          sex: 0,
        },
        {
          id: 13,
          name: "张三3",
          name_en: "zhangsan",
          age: 20,
          sex: 1,
        },
        {
          id: 14,
          name: "李四3",
          name_en: "lisi",
          age: 18,
          sex: 1,
        },
        {
          id: 15,
          name: "王五3",
          name_en: "wangwu",
          age: 24,
          sex: 0,
        },
        {
          id: 16,
          name: "赵六3",
          name_en: "zhaoliu",
          age: 30,
          sex: 0,
        },
        {
          id: 17,
          name: "张三4",
          name_en: "zhangsan",
          age: 20,
          sex: 1,
        },
        {
          id: 18,
          name: "李四4",
          name_en: "lisi",
          age: 18,
          sex: 1,
        },
        {
          id: 19,
          name: "王五4",
          name_en: "wangwu",
          age: 24,
          sex: 0,
        },
        {
          id: 20,
          name: "赵六4",
          name_en: "zhaoliu",
          age: 30,
          sex: 0,
        },
        {
          id: 21,
          name: "张三5",
          name_en: "zhangsan",
          age: 20,
          sex: 1,
        },
        {
          id: 22,
          name: "李四5",
          name_en: "lisi",
          age: 18,
          sex: 1,
        },
        {
          id: 23,
          name: "王五5",
          name_en: "wangwu",
          age: 24,
          sex: 0,
        },
        {
          id: 24,
          name: "赵六5",
          name_en: "zhaoliu",
          age: 30,
          sex: 0,
        },
      ],
    };
  },
  computed: {
    language() {
      return "zh";
      // return this.$store.state.language
    },
  },
  methods: {
    getFilterCondition(filterDate, category, choicetype) {
      console.log(filterDate, category, choicetype);
      //得到筛选条件进行筛选
    },
  },
};
</script>
<style scoped>
::v-deep .el-table .cell {
  text-align: center;
}
</style>
