// require packages used in the project
const express = require("express");
const app = express();
const port = 3000;

// 告訴express, 要使用handlebars, 來解析html
const exphbs = require("express-handlebars");

//透過路徑檔, 將需要用到的資料require近來
const restList = require("./restaurant.json");

// setting template engine
// app.enging(參數1:要只用的樣版引擎, 參數2: 使用這個引擎的相關設定)
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
// 告訴 Express 說要設定的 view engine 是 handlebars
app.set("view engine", "handlebars");

// setting static files
// 告訴 Express 靜態檔案是放在名為 public 的資料夾中
app.use(express.static("public"));

// routes setting
app.get("/", (req, res) => {
  // past the movie data into 'index' partial template
  res.render("index", { restaurants: restList.results });
});

// route setting for show another page
app.get("/restaurants/:restaurant_id", (req, res) => {
  const restaurant = restList.results.find(
    (restaurant) => restaurant.id.toString() === req.params.restaurant_id
  );
  res.render("show", { restaurant: restaurant });
});

// query string
// 透過req.query 可得網頁?後的東西
// 設定對應的路由器
app.get("/search", (req, res) => {
  // 如果沒有輸入關鍵字, 返回原始畫面
  if (!req.query.keyword) {
    return res.redirect("/");
  }
  //   const keywords = req.query.keywords;
  const keyword = req.query.keyword.trim().toLowerCase();

  const restaurants = restList.results.filter(
    (data) =>
      data.name.toLowerCase().includes(keyword) ||
      data.category.includes(keyword)
  );
  res.render("index", { restaurants: restaurants, keyword: keyword });
});

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`);
});
