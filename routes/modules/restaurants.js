const express = require("express");
const router = express.Router();

const Restaurant = require("../../models/Restaurant");

// create page
router.get("/new", (req, res) => {
  res.render("new");
});

// show detail page
router.get("/:id", (req, res) => 
{
  const userId = req.user._id;
  const id = req.params.id;
  return Restaurant.findById(id, userId)
    .lean()
    .then((restaurant) => res.render("show", { restaurant }))
    .catch((error) => console.error(error));
});

// show edit page
router.get("/:id/edit", (req, res) => {
  const userId = req.user._id;
  const id = req.params.id;
  Restaurant.findById(id, userId)
    .lean()
    .then((restaurants) => res.render("edit", { restaurants }))
    .catch((error) => console.error(error));
});

// save the edit page
router.put("/:id", (req, res) => {
  const userId = req.user._id;
  const id = req.params.id;
  Restaurant.findByIdAndUpdate(id, userId,req.body)
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch((error) => console.log(error));
});

// create a restaurant
router.post("/", (req, res) => {
  const userId = req.user._id;
  Restaurant.create(userId,req.body)
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err));
});

// delete the restaurant
router.delete("/:id", (req, res) => {
  const userId = req.user._id;
  const id = req.params.id;
  Restaurant.findById(userId,id)
    .then((restaurant) => restaurant.remove())
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});

// export route module
module.exports = router;
