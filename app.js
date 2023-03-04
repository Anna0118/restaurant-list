// require packages used in the project
const express = require("express");
const exphbs = require("express-handlebars"); // 告訴express, 要使用handlebars, 來解析html
const mongoose = require("mongoose"); // 載入mongoose
const bodyParser = require("body-parser"); // 引用 body-parser
const Restaurant = require("./models/Restaurant");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); // 設定連線到 mongoDB

const db = mongoose.connection; // 用on註冊監聽器，監聽error事件有沒有發生,只要觸error就印出error訊息
db.on("error", () => {
  console.log("mongodb error");
});
// 針對連線成功的open其情況,連線成功只會發生一次，所以特地用once，一但成功後，在執行callback以後就會解除監聽器
db.once("open", () => {
  console.log("mongodb connected!");
});

// //透過路徑檔, 將需要用到的資料require近來
// const restList = require("./restaurant.json");
const app = express();
const port = 3000;

// setting template engine
// app.enging(參數1:要只用的樣版引擎, 參數2: 使用這個引擎的相關設定)
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars"); // 告訴 Express 說要設定的 view engine 是 handlebars
// setting static files
app.use(express.static("public")); // 告訴 Express 靜態檔案是放在名為 public 的資料夾中
app.use(bodyParser.urlencoded({ extended: true }));

// route setting
app.get("/", (req, res) => {
  Restaurant.find()
    .lean()
    .then((restaurants) => res.render("index", { restaurants }))
    .catch((error) => console.error(error));
});

// show detail page
app.get("/restaurants/:id", (req, res) => {
  const id = req.params.id;
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render("show", { restaurant }))
    .catch((error) => console.error(error));
});

// // route setting for show another page
// app.get("/restaurants/:restaurant_id", (req, res) => {
//   const restaurant = restList.results.find(
//     (restaurant) => restaurant.id.toString() === req.params.restaurant_id
//   );
//   res.render("show", { restaurant: restaurant });
// });

// // query string
// // 透過req.query 可得網頁?後的東西
// // 設定對應的路由器
// app.get("/search", (req, res) => {
//   // 如果沒有輸入關鍵字, 返回原始畫面
//   if (!req.query.keyword) {
//     return res.redirect("/");
//   }
//   //   const keywords = req.query.keywords;
//   const keyword = req.query.keyword.trim().toLowerCase();

//   const restaurants = restList.results.filter(
//     (data) =>
//       data.name.toLowerCase().includes(keyword) ||
//       data.category.includes(keyword)
//   );
//   res.render("index", { restaurants: restaurants, keyword: keyword });
// });

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`);
});
