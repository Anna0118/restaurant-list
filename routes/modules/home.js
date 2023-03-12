const express = require("express");
const router = express.Router();

const Restaurant = require("../../models/Restaurant");

// sort function
function mySort(sort) {
  if (sort === "類別") {
    return { category: "asc" };
  } else if (sort === "評分") {
    return { rating: "desc" };
  } else if (sort === "Ａ>Z") {
    return { name: "asc" };
  } else {
    return { name: "desc" };
  }
}

// route setting
router.get("/", (req, res) => {
  Restaurant.find()
    .lean()
    .then((restaurants) => res.render("index", { restaurants }))
    .catch((error) => console.error(error));
});

// query string
// req.query get ?'s text
router.get("/search", (req, res) => {
  // no keyword, back to '/'
  if (!req.query.keyword) {
    return res.redirect("/");
  }

  const keyword = req.query.keyword; // raw input
  const keywords = req.query.keyword.trim().toLowerCase();

  Restaurant.find()
    .lean()
    .then((restaurant) => {
      const filter = restaurant.filter(
        (data) =>
          data.name.toLowerCase().includes(keywords) ||
          data.category.includes(keywords)
      );
      res.render("index", { restaurants: filter, keyword, sort });
    });
});

// export route module
module.exports = router;
