const Items = require("../model/items");
const StockRequest = require("../model/stockRequest");
const getLastDatabaseId = require("../utils/getLastDatabaseId");
const { isExistErrorMsg, sendValidationErr } = require("../utils/utils");

const list_items = async (req, res) => {
  try {
    const { status, page, limit, item_name, item_type, is_active } = req.query;
    if (status) {
      const items = await Items.find({ status: 1, is_active: true })
        .select("_id item_name item_type")
        .lean();
      return res.json({ data: items, status: 1 });
    } else {
      const LIMIT = Math.min(Number(limit), 100);
      const PAGE = Math.max(Number(page), 1);
      const offset = (PAGE - 1) * LIMIT;

      const matchFilter = { status: 1 };

      if (item_name) {
        matchFilter.item_name = { $regex: item_name, $options: "i" };
      }

      if (item_type) {
        matchFilter.item_type = item_type;
      }

      if (is_active) {
        matchFilter.is_active = is_active == "1";
      }

      const pipeline = [
        { $match: matchFilter },
        { $skip: offset },
        { $limit: LIMIT },
      ];

      const [items, total] = await Promise.all([
        Items.aggregate(pipeline),
        Items.countDocuments(matchFilter),
      ]);

      return res.json({ data: items, total, status: 1 });
    }
  } catch ({ message }) {
    res.status(500).json({ message, status: 0 });
  }
};

const add_item = async (req, res) => {
  try {
    const nextId = await getLastDatabaseId(Items);
    const d = new Items({ _id: nextId, ...req.body });
    await d.save();
    return res.json({ message: "Added", status: 1 });
  } catch (err) {
    if (err.name === "ValidationError") {
      return sendValidationErr(err, res);
    }
  }
};

const delete_item = async (req, res) => {
  try {
    const { _id } = req.body;
    const isExist = await StockRequest.findOne({
      item_id: _id,
      status: 1,
    })
      .select("_id")
      .lean();
    if (isExist) {
      return res.json(isExistErrorMsg);
    }
    await Items.findByIdAndUpdate(_id, { status: 0 });
    return res.json({ message: "Deleted", status: 1 });
  } catch ({ message }) {
    res.status(500).json({ message, status: 0 });
  }
};

const update_item = async (req, res) => {
  try {
    const { _id } = req.body;
    await Items.findByIdAndUpdate(_id, { ...req.body });
    return res.json({ message: "Updated", status: 1 });
  } catch (err) {
    if (err.name === "ValidationError") {
      return sendValidationErr(err, res);
    }
  }
};

module.exports = {
  list_items,
  add_item,
  delete_item,
  update_item,
};
