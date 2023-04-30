// require packages used in the project
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const methodOverride = require("method-override"); //HTML表單中並沒有提供PUT方法，只有GET和POST
const helpers = require("handlebars-helpers")();
const session = require("express-session");
const flash = require("connect-flash");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const routes = require("./routes");
require("./config/mongoose");
const usePassport = require("./config/passport");

const PORT = process.env.PORT;

const app = express();

app.engine("hbs", exphbs({ defaultLayout: "main", extname: ".hbs", helpers }));
app.set("view engine", "hbs");

// setting static files
app.use(express.static("public")); //態檔案是放在名為 public的資料夾
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method")); //使用中間件method-override來解析這個隱藏的_method欄位，並將請求方法覆蓋為PUT

// express session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// 呼叫 Passport 函式並傳入 app，這條要寫在路由之前
usePassport(app);
app.use(flash()); 

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  res.locals.success_msg = req.flash("success_msg"); // 設定 success_msg 訊息
  res.locals.warning_msg = req.flash("warning_msg"); // 設定 warning_msg 訊息
  next();
});

app.use(routes);

// start and listen on the Express server
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});

