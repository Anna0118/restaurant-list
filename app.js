// require packages used in the project
const express = require("express");
const exphbs = require("express-handlebars"); // 告訴express, 要使用handlebars, 來解析html
const bodyParser = require("body-parser"); // 引用 body-parser
const methodOverride = require("method-override"); //HTML表單中並沒有提供PUT方法，只有GET和POST

const routes = require("./routes");
require("./config/mongoose");

// //透過路徑檔, 將需要用到的資料require近來
// const restList = require("./restaurant.json");
const app = express();
const port = 3000;

// setting template engine
// app.enging(參數1:要用的樣版引擎, 參數2: 使用這個引擎的相關設定)
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars"); // 告訴 Express 說要設定的 view engine 是 handlebars
// setting static files
app.use(express.static("public")); // 告訴 Express 靜態檔案是放在名為 public 的資料夾中
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method")); //使用中間件method-override來解析這個隱藏的_method欄位，並將請求方法覆蓋為PUT

app.use(routes);

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`);
});
