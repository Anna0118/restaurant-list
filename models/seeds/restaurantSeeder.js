const Restaurant = require("../Restaurant"); // 載入 Restaurant model
const db = require("../../config/mongoose");
const User = require("../user");
const bcrypt = require("bcryptjs");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const restaurantList = require("../../restaurant.json").results;
const SEED_USER = require("./user.json");
console.log(SEED_USER);

db.on("error", () => {
  console.log("mongodb error!");
});

db.once("open", () => {
  const userPromises = SEED_USER.map((user, index) =>
    bcrypt
      .genSalt(10)
      .then((salt) => bcrypt.hash(user.password, salt))
      .then((hash) =>
        User.create({
          name: user.name,
          email: user.email,
          password: hash,
        })
      )
      .then((user) => {
        const userId = user._id;
        const userRestaurants = restaurantList.slice(
          index * 3,
          (index + 1) * 3
        ); //(0,3), (3,6)
        const restaurantPromises = userRestaurants.map((restaurant) => {
          restaurant.userId = userId;
          return Restaurant.create(restaurant);
        });
        return Promise.all(restaurantPromises);
      })
      .then(() => {
        console.log("done.");
        process.exit();
      })
  );
});
