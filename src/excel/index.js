//导入 xlsx 模块
import XLSX from "xlsx";
//导入 xlsxPopulate 模块
import XlsxPopulate from "xlsx-populate";
// 用于统一设置报表的样式  “A" "B"  EXCEL 的列
const alphabetList = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

function workbook2blob(workbook) {
  // 生成excel的配置项
  const wopts = {
    // 要生成的文件类型
    bookType: "xlsx",
    // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
    bookSST: false,
    type: "binary",
  };
  const wbout = XLSX.write(workbook, wopts);
  // 将字符串转ArrayBuffer
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }
  const blob = new Blob([s2ab(wbout)], {
    type: "application/octet-stream",
  });
  return blob;
}
//导出 handleExport
export function handleExport(data, title, table) {
  //数据对于的列
  data.forEach((item) => {
    table.push({
      A: item.idx,
      B: item.color,
      c: item.size,
    });
  });
  const finalData = [...title, ...table];
  console.log(finalData, XLSX);
  const wb = XLSX.utils.book_new();
  console.log(wb);
  const sheet = XLSX.utils.json_to_sheet(finalData, {
    skipHeader: true,
  });
  //第三个参数为生成excel sheet的名称
  XLSX.utils.book_append_sheet(wb, sheet, "表1");
  console.log(wb);
  const workbookBlob = workbook2blob(wb);
  //指定要样式的内容
  const dataInfo = {
    titleCell: "A1",
    titleRange: "A1:D1",
    theadRange: "A2:D2",
    tbodyRange: `A3:D${data.length + 3}`,
    tableRange: `A2:D${data.length + 3}`,
  };
  return addStyle(workbookBlob, dataInfo);
}
//添加样式的方法
function addStyle(workbookBlob, dataInfo) {
  return XlsxPopulate.fromDataAsync(workbookBlob).then((workbook) => {
    // 循环所有的表
    // 设置行高 sheet(’sheet号’).row(行号).height('行高')
    workbook.sheet(0).row(1).height(50);
    // 取消垂直居中
    workbook.sheet(0).printOptions("verticalCentered", undefined);
    //打印页边距预模板
    workbook.sheet(0).pageMarginsPreset("narrow");
    //可以给指定的格子添加内容并合并单元格  指定的单元格range("M43:P43").value('要写入的内容').merged(true)合并单元格
    //  workbook.sheet(0).range("M43:P43").value('辅岗监装:').merged(true)
    workbook.sheets().forEach((sheet) => {
      // 所有cell垂直居中,修改字体
      sheet.usedRange().style({
        fontFamily: "Arial",
        verticalAlignment: "center",
      });
      // 去除所有边框 (网格线)
      // sheet.gridLinesVisible(false);

      // 设置单元格宽度
      alphabetList.forEach((item) => {
        sheet.column(item).width(60);
      });

      // .style 是添加样式
      // title加粗合并及居中
      sheet.range(dataInfo.titleRange).merged(true).style({
        //加粗
        bold: true,
        //水平居中
        horizontalAlignment: "center",
        //垂直居中
        verticalAlignment: "center",
        //字号
        fontSize: 14,
      });
      // 表头加粗及背景色
      sheet.range(dataInfo.theadRange).style({
        wrapText: true,
        fill: "C9C7C7",
        bold: true,
        horizontalAlignment: "center",
        fontSize: 10,
      });
      sheet.range(dataInfo.tbodyRange).style({
        horizontalAlignment: "center",
        //内容放不下时候允许换行
        wrapText: true,
        fontSize: 10,
      });
      // 表格黑色细边框
      sheet.range(dataInfo.tableRange).style({
        border: {
          style: "thin",
          color: "000000",
          direction: "both",
        },
      });
    });
    return workbook.outputAsync().then(
      (workbookBlob) => URL.createObjectURL(workbookBlob) // 创建blob地址
    );
  });
}
