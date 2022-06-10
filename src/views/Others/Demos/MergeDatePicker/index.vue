<template>
  <div>
    <el-tabs
      :style="'text-align:left;width:' + width"
      type="card"
      tab-position="left"
      v-model="category"
    >
      <el-tab-pane
        class="tabpanebox"
        v-for="item in periodModel"
        :key="item.name"
        :label="getPropertyByLg(item, 'name')"
        :name="item.name_en"
      >
        <el-radio-group v-model="choicetype" style="width: 300px">
          <el-radio
            v-for="item in choiceModel"
            :key="item.name"
            :label="item.model"
            >{{ getPropertyByLg(item, "name") }}</el-radio
          >
        </el-radio-group>
        <!-- 月度 -->
        <div v-show="choicetype === 'month' && category === 'monthly'">
          <el-date-picker
            v-model="filterDate.monthly.Single"
            type="month"
            popper-class="selectItemStyle"
            :placeholder="
              language === 'zh' ? '请选择月份' : 'Please select the month'
            "
            value-format="yyyy-MM"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </div>
        <div v-show="choicetype === 'months' && category === 'monthly'">
          <MultipleMonthQuarterYear
            :isHasfilter="isFilter"
            :canSelectList="myallList"
            :language="language"
            :category="'monthly'"
            @getMultiple="getMultipleMonth"
          ></MultipleMonthQuarterYear>
        </div>
        <div v-show="choicetype === 'monthrange' && category === 'monthly'">
          <el-date-picker
            :default-value="String(years - 1)"
            v-model="filterDate.monthly.Serial"
            type="monthrange"
            :picker-options="pickerOptions"
            align="center"
            value-format="yyyy-MM"
            range-separator="~"
            :start-placeholder="language === 'zh' ? '开始月份' : 'start month'"
            :end-placeholder="language === 'zh' ? '结束季度' : 'end month'"
          ></el-date-picker>
        </div>
        <!-- 季度 -->
        <div v-show="choicetype === 'month' && category === 'quarterly'">
          <SingleQuarter
            :isHasfilter="isFilter"
            :canSelectList="myallList"
            :language="language"
            :status="'single'"
            @getsinglequarter="getsinglequarter"
          ></SingleQuarter>
        </div>
        <div v-show="choicetype === 'months' && category === 'quarterly'">
          <MultipleMonthQuarterYear
            :isHasfilter="isFilter"
            :canSelectList="myallList"
            :language="language"
            :category="'quarterly'"
            @getMultiple="getMultiplequarter"
          ></MultipleMonthQuarterYear>
        </div>
        <div v-show="choicetype === 'monthrange' && category === 'quarterly'">
          <div class="flexbox" style="width: 50%">
            <SingleQuarter
              :isHasfilter="isFilter"
              :canSelectList="myallList"
              :language="language"
              :inputwidth="'160px'"
              :status="'start'"
              @getsinglequarter="getsinglequarter"
            ></SingleQuarter>
            <span style="margin-left: 5px; margin-right: 5px">~</span>
            <SingleQuarter
              :isHasfilter="isFilter"
              :canSelectList="myallList"
              :language="language"
              :inputwidth="'160px'"
              :status="'end'"
              @getsinglequarter="getsinglequarter"
            ></SingleQuarter>
          </div>
        </div>
        <!-- 年度 -->
        <div v-show="choicetype === 'month' && category === 'annual'">
          <el-date-picker
            v-model="filterDate.annual.Single"
            type="year"
            popper-class="selectItemStyle"
            :picker-options="pickerOptions"
            value-format="yyyy"
            :placeholder="
              language === 'zh' ? '请选择年份' : 'Please select the year'
            "
          ></el-date-picker>
        </div>
        <div v-show="choicetype === 'months' && category === 'annual'">
          <MultipleMonthQuarterYear
            :isHasfilter="isFilter"
            :canSelectList="myallList"
            :language="language"
            :category="'annual'"
            @getMultiple="getMultipleYear"
          ></MultipleMonthQuarterYear>
        </div>
        <div v-show="choicetype === 'monthrange' && category === 'annual'">
          <YearsRange
            :isHasfilter="isFilter"
            :canSelectList="myallList"
            :language="language"
            @getYearRange="getYearRange"
          ></YearsRange>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import MultipleMonthQuarterYear from "./MultipleMonthQuarterYear";
import SingleQuarter from "./SingleQuarter";
import YearsRange from "./YearsRange";

export default {
  name: "MergeDatePicker",
  components: {
    MultipleMonthQuarterYear,
    SingleQuarter,
    YearsRange,
  },
  props: {
    myallList: {
      type: Array,
      default: () => [],
    },
    isFilter: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: "100%",
    },
    language: {
      type: String,
      default: "zh",
    },
  },
  data() {
    return {
      periodModel: [
        { id: 1, name: "月度", name_en: "monthly" },
        { id: 2, name: "季度", name_en: "quarterly" },
        { id: 3, name: "年度", name_en: "annual" },
      ],
      choiceModel: [
        { id: 1, name: "单选", name_en: "Single", model: "month" },
        { id: 2, name: "多选", name_en: "Multiple", model: "months" },
        { id: 3, name: "连续选择", name_en: "Serial", model: "monthrange" },
      ],
      filterDate: {
        monthly: { Single: "", Multiple: [], Serial: [] },
        quarterly: { Single: "", Multiple: [], Serial: [] },
        annual: { Single: "", Multiple: [], Serial: [] },
      },
      choicetype: "month",
      category: "monthly",
      pickerOptions: {
        disabledDate: this.optionsDate,
      },
      years: new Date().getFullYear(),
      startmonth: ["01-03", "04-06", "07-09", "10-12"],
    };
  },
  watch: {
    choicetype: {
      handler() {
        this.postDate();
      },
    },
    category: {
      handler() {
        this.postDate();
      },
    },
    watchfiltetData: {
      handler(newVal, oldVal) {
        if (
          newVal.monthly.Single !== oldVal.monthly.Single ||
          JSON.stringify(newVal.monthly.Serial) !==
            JSON.stringify(oldVal.monthly.Serial) ||
          newVal.annual.Single !== oldVal.annual.Single
        ) {
          this.postDate();
        }
      },
      deep: true,
    },
  },
  computed: {
    watchfiltetData() {
      return JSON.parse(JSON.stringify(this.filterDate));
    },
    getPropertyByLg() {
      return function retVal(data, property) {
        return this.language === "zh" ? data[property] : data[property + "_en"];
      };
    },
  },
  methods: {
    //el-date-picker日期选择器过滤日期
    optionsDate(time) {
      if (this.isFilter) {
        //单选年度时过滤可选年份
        if (this.choicetype === "month" && this.category === "annual") {
          let date = time.getFullYear();
          let timeList = this.myallList.map((item) => {
            return item.start_time.slice(0, 4);
          });
          if (timeList.includes(JSON.stringify(date))) {
            return false;
          } else {
            return true;
          }
        } else {
          //单选月度时过滤可选月份
          let months = [
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "10",
            "11",
            "12",
          ];
          let date = time.getFullYear() + "-" + months[time.getMonth()];
          let timeList = this.myallList.map((item) => {
            return (
              item.start_time.slice(0, 4) + "-" + item.start_time.slice(5, 7)
            );
          });
          if (timeList.includes(date)) {
            return false;
          } else {
            return true;
          }
        }
      } else {
        //最新日期以上可选
        return time.getTime() >= Date.now() - 8.64e7;
      }
    },
    postDate() {
      var item = this.periodModel.find((p) => {
        return p.name_en === this.category;
      });
      var item1 = this.choiceModel.find((p) => {
        return p.model === this.choicetype;
      });
      this.$emit("postFilterCondition", this.filterDate, item, item1);
    },
    // 多选月份
    getMultipleMonth(resultList) {
      this.$set(this.filterDate.monthly, "Multiple", resultList);
      this.postDate();
    },
    //多选季度
    getMultiplequarter(resultList) {
      this.$set(this.filterDate.quarterly, "Multiple", []);
      //将2022-Q1转换成2022-01即第一季度起始月
      resultList.filter((showValue) => {
        let start = showValue.slice(0, 4);
        let startquarter = showValue.slice(6, 7);
        this.startmonth.filter((item, index) => {
          if (index + 1 == startquarter) {
            var multiplestart = start + "-" + item.slice(0, 2);
            this.filterDate.quarterly.Multiple.push(multiplestart);
          }
        });
      });
      this.postDate();
    },
    // 多选年份
    getMultipleYear(resultList) {
      this.$set(this.filterDate.annual, "Multiple", resultList);
      this.postDate();
    },
    // 单选季度+连续选择季度
    getsinglequarter(showValue, status) {
      let start = showValue.slice(0, 4);
      let startquarter = showValue.slice(6, 7);
      this.startmonth.filter((item, index) => {
        let value = start + "-" + item.slice(0, 2);
        if (index + 1 == startquarter) {
          if (status == "start") {
            this.filterDate.quarterly.Serial.splice(0, 1, value);
            if (this.filterDate.quarterly.Serial.length === 2)
              this.verifySelectQuarterRange();
          } else if (status == "end") {
            this.filterDate.quarterly.Serial.splice(1, 1, value);
            if (this.filterDate.quarterly.Serial.length === 2)
              this.verifySelectQuarterRange();
          } else if (status == "single") {
            this.filterDate.quarterly.Single = value;
            this.postDate();
          }
        }
      });
    },
    // 验证连续选择的季度并提交
    verifySelectQuarterRange() {
      let start = this.filterDate.quarterly.Serial[0].slice(0, 4);
      let startquarter = this.filterDate.quarterly.Serial[0].slice(5, 7);
      let end = this.filterDate.quarterly.Serial[1].slice(0, 4);
      let endquarter = this.filterDate.quarterly.Serial[1].slice(5, 7);
      // console.log(start,end,startquarter,endquarter);
      if (Number(start) < 1991 || Number(end) > this.years) {
        this.$message({
          type: "error",
          message:
            this.language === "zh"
              ? "超过选择范围，请重新选择！"
              : "Out of the selection range, please select again!",
        });
      } else if (
        Number(start) > Number(end) ||
        (Number(start) == Number(end) &&
          Number(startquarter) > Number(endquarter))
      ) {
        this.$message.error(
          this.language === "zh"
            ? "结束季度须大于等于开始季度，请重新选择！"
            : "The end quarter must be greater than or equal to the start quarter, please select again!"
        );
      } else {
        this.postDate();
      }
    },
    //连续选择年
    getYearRange(start, end) {
      this.filterDate.annual.Serial.splice(0, 1, JSON.stringify(start));
      this.filterDate.annual.Serial.splice(1, 1, JSON.stringify(end));
      this.postDate();
    },
  },
};
</script>

<style scoped>
::v-deep .el-tabs__item {
  height: 26px;
  line-height: 26px;
}
::v-deep .el-tabs__item.is-active {
  color: #5f9aff;
  background-color: #ebf1ff;
}
::v-deep .el-tabs--left .el-tabs__header.is-left {
  margin-right: 0px;
}
::v-deep .el-tabs--left.el-tabs--card .el-tabs__item.is-left.is-active {
  border-right-color: #5f9aff;
}
.tabpanebox {
  background-color: #ebf1ff70;
  padding: 0 18px;
  height: 80px;
  line-height: 30px;
  border-radius: 0 8px 8px 0;
}
.flexbox {
  display: flex;
  justify-content: left;
  align-items: center;
}
</style>
<style>
.selectItemStyle .el-month-table td .cell:hover,
.selectItemStyle .el-month-table td.current:not(.disabled) .cell,
.selectItemStyle .el-year-table td .cell:hover,
.selectItemStyle .el-year-table td.current:not(.disabled) .cell {
  background-color: #409eff;
  color: white;
  border-radius: 18px;
}
.selectItemStyle .el-year-table td .cell {
  border-radius: 18px;
}
</style>
