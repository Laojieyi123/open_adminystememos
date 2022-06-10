// 导入js文件
import $ from 'jquery'
import saveAs from 'file-saver'

if (typeof $ !== "undefined" && typeof saveAs !== "undefined") {
  (function ($) {
    $.fn.wordExport = function (fileName) {
      fileName = typeof fileName !== 'undefined' ? fileName : "jQuery-Word-Export";
      var statics = {
        mhtml: {
          top: "Mime-Version: 1.0\nContent-Base: " + location.href + "\nContent-Type: Multipart/related; boundary=\"NEXT.ITEM-BOUNDARY\";type=\"text/html\"\n\n--NEXT.ITEM-BOUNDARY\nContent-Type: text/html; charset=\"utf-8\"\nContent-Location: " + location.href + "\n\n<!DOCTYPE html>\n<html>\n_html_</html>",
          // head: "<head>\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\n<style>\n_styles_\n</style>\n</head>\n",
          head: `<head>\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\n<style>
                @page
                  {mso-page-border-surround-header:no;
                  mso-page-border-surround-footer:no;
                  mso-footnote-separator:url("/header.html") fs;
                  mso-footnote-continuation-separator:url("/header.html") fcs;
                  mso-endnote-separator:url("/header.html") es;
                  mso-endnote-continuation-separator:url("/header.html") ecs;}
                @page WordSection1
                  {size:595.3pt 841.9pt;
                  margin:1.0cm 2.0cm 1.0cm 2.0cm;
                  mso-header-margin:42.55pt;
                  mso-footer-margin:49.6pt;
                  mso-header:url("/header.html") h1;
                  mso-paper-source:0;
                  layout-grid:15.6pt;}
                div.WordSection1
                  {page:WordSection1;}
                </style>\n_styles_\n</head>\n`,
          body: "<body><div class=WordSection1>_body_</div></body>"
        }
      };
      var options = {
        maxWidth: 624
      };
      // Clone selected element before manipulating it
      var markup = $(this).clone();

      // Remove hidden elements from the output
      markup.each(function () {
        var self = $(this);
        if (self.is(':hidden'))
          self.remove();
      });

      // Embed all images using Data URLs
      var images = Array();
      var img = markup.find('img');
      for (var i = 0; i < img.length; i++) {
        // 计算输出图片的大小
        var w = Math.min(img[i].width, options.maxWidth);
        var h = img[i].height * (w / img[i].width);
        // Create canvas for converting image to data URL
        var canvas = document.createElement("CANVAS");
        canvas.width = w;
        canvas.height = h;
        // Draw image to canvas
        var context = canvas.getContext('2d');
        context.drawImage(img[i], 0, 0, w, h);
        // Get data URL encoding of image
        var uri = canvas.toDataURL("image/png/jpg");
        $(img[i]).attr("src", img[i].src);
        img[i].width = w;
        img[i].height = h;
        // Save encoded image to array
        images[i] = {
          type: uri.substring(uri.indexOf(":") + 1, uri.indexOf(";")),
          encoding: uri.substring(uri.indexOf(";") + 1, uri.indexOf(",")),
          location: $(img[i]).attr("src"),
          data: uri.substring(uri.indexOf(",") + 1)
        };
      }

      // Prepare bottom of mhtml file with image data
      var mhtmlBottom = "\n";
      for (var j = 0; j < images.length; j++) {
        mhtmlBottom += "--NEXT.ITEM-BOUNDARY\n";
        mhtmlBottom += "Content-Location: " + images[j].location + "\n";
        mhtmlBottom += "Content-Type: " + images[j].type + "\n";
        mhtmlBottom += "Content-Transfer-Encoding: " + images[j].encoding + "\n\n";
        mhtmlBottom += images[j].data + "\n\n";
      }
      mhtmlBottom += "--NEXT.ITEM-BOUNDARY--";

      //TODO: load css from included stylesheet
      var str = ''
      str += "<style>table tr td{padding-left:5px;padding-right:5px}.tdTitle{background:#c2c1c1}.spaceRow{margin-top:10px;}table{width:100%;}</style>";
      str += "<style>table{border-collapse: collapse;table-layout: fixed}</style>"
      str += "<style>table td,th{ height:30px;font-size:14px;border-width:1px;border-style: solid;border-color: #000;word-break: keep-all;}</style>"

      // Aggregate parts of the file together
      var fileContent = statics.mhtml.top.replace("_html_", statics.mhtml.head.replace("_styles_", str) + statics.mhtml.body.replace("_body_", markup.html())) + mhtmlBottom;
      // Create a Blob with the file contents
      var blob = new Blob([fileContent], {
        type: "application/msword;charset=utf-8"
      });
      saveAs(blob, fileName + ".doc");
    };
  })($);
} else {
  if (typeof $ === "undefined") {
    console.error("jQuery Word Export: missing dependency (jQuery)");
  }
  if (typeof saveAs === "undefined") {
    console.error("jQuery Word Export: missing dependency (FileSaver.js)");
  }
}
