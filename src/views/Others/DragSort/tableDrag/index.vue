<template>
  <div class="hello">
    <h3>使用sortablejs插件拖拽'el-table'表格</h3>
    <el-table :data="tableData" border row-key="id">
      <el-table-column class-name="allowDrag" label="移动" width="100">
        <i class="el-icon-thumb"></i>
      </el-table-column>
      <el-table-column v-for="item in col" :key="item.prop" :prop="item.prop" :label="item.label">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Sortable from "sortablejs";
export default {
  name: "DragSort",
  data() {
    return {
      col: [
        { label: "日期", prop: "date" },
        { label: "姓名", prop: "name" },
        { label: "地址", prop: "address" },
      ],
      tableData: [
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
    };
  },
  mounted() {
    this.rowDrop();
  },
  methods: {
    // 行拖拽
    rowDrop() {
      // 此时找到的元素是要拖拽元素的父容器
      const tbody = document.querySelector(".el-table__body-wrapper tbody");
      Sortable.create(tbody, {
        handle: ".allowDrag",
        // 指定父元素下可被拖拽的子元素
        draggable: ".el-table__row",
        onEnd: ({ newIndex, oldIndex }) => {
          const currRow = this.tableData.splice(oldIndex, 1)[0];
          this.tableData.splice(newIndex, 0, currRow);
        },
      });
    },
  },
};
</script>
<style scoped>
  ::v-deep .el-table .cell {
    text-align: center;
  }
  ::v-deep .sortable-chosen > td {
    /* 拖动的样式 */
    background-color: #eff2f6 !important;
    color: #409eff;
  }
  ::v-deep .el-table--enable-row-hover .el-table__body tr:hover > td {
     /* 修复拖拽的时候hover的不消失的问题 */
    background-color: #fff;
  }
</style>
