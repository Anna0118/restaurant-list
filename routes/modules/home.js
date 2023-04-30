const express = require("express");
const router = express.Router();

const Restaurant = require("../../models/Restaurant");

// sort function
function mySort(sort) {
  if (sort === "category") {
    return { category: "asc" };
  } else if (sort === "rating") {
    return { rating: "desc" };
  } else if (sort === "name-asc") {
    return { name: "asc" };
  } else if (sort === "name-desc") {
    return { name: "desc" };
  } else {
    return {};
  }
}

// route setting
router.get("/", (req, res) => {
  const userId = req.user._id; 
  Restaurant.find({userId})
    .lean()
    // .sort(mySort(sort))
    .then((restaurants) => {
      res.render("index", { restaurants });
    })
    .catch((error) => console.error(error));
});

// query string
// req.query get ?'s text
// router.get("/search", (req, res) => {
//   // no keyword, back to '/'
//   // if (!req.query.keyword) {
//   //   return res.redirect("/");
//   // }

//   const keyword = req.query.keyword; // raw input
//   const keywords = req.query.keyword.trim().toLowerCase();

//   const sort = req.query.sort; // get user's value

//   console.log(sort);

//   Restaurant.find()
//     .lean()
//     .sort(mySort(sort))
//     .then((restaurant) => {
//       const filter = restaurant.filter(
//         (data) =>
//           data.name.toLowerCase().includes(keywords) ||
//           data.category.includes(keywords)
//       );
//       res.render("index", { restaurants: filter, keyword, sort });
//     })
//     .catch((error) => console.error(error));
// });

//優化
router.get("/search", (req, res) => {
  // when there is no keyword or sort choice
  if (!req.query.keyword && !req.query.sort) {
    return res.redirect("/");
  }

  const keyword = req.query.keyword.trim().toLowerCase();
  const sort = req.query.sort || "none"; // 有value, 就指定給sort變數

  // user mongoose find(), MongoDB query language
  Restaurant.find({
    // $or 使用以陣列方式定義一個或多個子運算式
    // 使用$regex操作符表示使用正則表達式進行模糊查詢 , $options: "i" 來忽略大小寫
    // 找出name或category中包含關鍵字(keyword)的所有餐廳資料
    $or: [
      { name: { $regex: keyword, $options: "i" } },
      { category: { $regex: keyword, $options: "i" } },
    ],
  })
    .lean()
    .sort(mySort(sort))
    .then((restaurants) => {
      res.render("index", { restaurants, keyword, sort });
    })
    .catch((error) => console.log(error));
});

// export route module
module.exports = router;
