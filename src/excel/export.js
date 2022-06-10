//导入 xlsx 模块
import XLSX from "xlsx";
//导入 xlsxPopulate 模块
import XlsxPopulate from "xlsx-populate";
// 用于统一设置报表的样式  “A" "B"  EXCEL 的列
const alphabetList = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",];

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
export function handleExport(tableZh,tableEn,titleZh,titleEn,dataInfo) {
  //表格数据——中英文版
  const finalDataZh = [...titleZh, ...tableZh];
  const finalDataEn = [...titleEn, ...tableEn];
  const wb = XLSX.utils.book_new();
  const sheetZh = XLSX.utils.json_to_sheet(finalDataZh, { skipHeader: true,});
  const sheetEn = XLSX.utils.json_to_sheet(finalDataEn, { skipHeader: true,});
  //第三个参数为生成excel sheet的名称
  XLSX.utils.book_append_sheet(wb, sheetZh, "Chinese");
  XLSX.utils.book_append_sheet(wb, sheetEn, "English");
  const workbookBlob = workbook2blob(wb);
  return addStyle(workbookBlob, dataInfo);
}
//添加样式的方法
function addStyle(workbookBlob, dataInfo) {
  return XlsxPopulate.fromDataAsync(workbookBlob).then((workbook) => {
    // 循环所有的表改变样式
    for (let index = 0; index < workbook._maxSheetId; index++) {
      // 设置行高 sheet(’sheet号’).row(行号).height('行高')
      workbook.sheet(index).row(1).height(25);
      // 取消垂直居中
      // workbook.sheet(index).printOptions("verticalCentered", undefined);
      //打印页边距预模板
      workbook.sheet(index).pageMarginsPreset("narrow");
      //可以给指定的格子添加内容并合并单元格
      // workbook.sheet(index).range("M43:P43").value('要写入的内容:').merged(true)
    }
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
        sheet.column(item).width(15);
      });
      // 合并单元格
      if(dataInfo.mergesRange){
        for(let i=0;i<dataInfo.mergesRange.length;i++){
          sheet.range(dataInfo.mergesRange[i]).merged(true).style({
          //水平居中
          horizontalAlignment: "center",
          //垂直居中
          verticalAlignment: "center",
          });
        }
      }
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
      sheet.range(dataInfo.tbodyRange).style({
        horizontalAlignment: "center",
        //内容放不下时候允许换行
        wrapText: true,
        fontSize: 10,
      });
      if(dataInfo.keystyle){
        for(let i=0;i<dataInfo.keystyle.length;i++){
          sheet.column(dataInfo.keystyle[i]).style({
            wrapText: true,
            horizontalAlignment: "left",
          });
          sheet.column(dataInfo.keystyle[i]).width(60)
        }
      }
      // 表头加粗及背景色
      sheet.range(dataInfo.theadRange).style({
        wrapText: true,
        fill: "C9C7C7",
        bold: true,
        horizontalAlignment: "center",
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
