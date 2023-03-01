const mongoose = require("mongoose");
const Schema = mongoose.Schema; // 使用mongoose的Schema模組

const restaurantSchema = new Schema({
  // 建構一個新的Schema
  name: {
    type: String, // 資料型別是字串
    required: true, // 這是個必填欄位
  },
  name_en: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  location: { type: String, required: true },
  phone: { type: String, required: true },
  google_map: { type: String, required: true },
  rating: { type: Number, required: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
