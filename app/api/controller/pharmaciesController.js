const Pharmacies = require("../model/pharmacies");
const Employees = require("../model/employees");
const Orders = require("../model/orders");
const getLastDatabaseId = require("../utils/getLastDatabaseId");
const {
  isExistErrorMsg,
  sendValidationErr,
  CheckDuplicateExist,
} = require("../utils/utils");

const list_pharmacies = async (req, res) => {
  try {
    const { status, page, limit, search_str, is_active } = req.query;

    if (status) {
      const pharmacies = await Pharmacies.find({
        status: 1,
        is_active: true,
      }).lean();
      return res.json({ data: pharmacies, status: 1 });
    }

    const LIMIT = Math.min(Number(limit), 100);
    const PAGE = Math.max(Number(page), 1);
    const offset = (PAGE - 1) * LIMIT;

    const matchFilter = { status: 1 };

    if (search_str) {
      const orConditions = [
        { pharmacy_name: { $regex: search_str, $options: "i" } },
        { area: { $regex: search_str, $options: "i" } },
        { district: { $regex: search_str, $options: "i" } },
        { state: { $regex: search_str, $options: "i" } },
      ];

      if (!isNaN(search_str)) {
        orConditions.push({ pharmacy_code: Number(search_str) });
      }

      matchFilter.$or = orConditions;
    }

    if (is_active) {
      matchFilter.is_active = is_active == "1";
    }

    const dataPipeline = [
      { $match: matchFilter },
      { $skip: offset },
      { $limit: LIMIT },
    ];

    const [pharmacies, total] = await Promise.all([
      Pharmacies.aggregate(dataPipeline),
      Pharmacies.countDocuments(matchFilter),
    ]);

    return res.json({ data: pharmacies, total, status: 1 });
  } catch ({ message }) {
    res.status(500).json({ message, status: 0 });
  }
};

const add_pharmacy = async (req, res) => {
  try {
    const dupExist = await CheckDuplicateExist(
      res,
      Pharmacies,
      "pharmacy_code",
      req.body.pharmacy_code,
      "Store Code",
    );
    if (dupExist) return;

    const nextId = await getLastDatabaseId(Pharmacies);
    const d = new Pharmacies({ _id: nextId, ...req.body });
    await d.save();
    return res.json({ message: "Added", status: 1 });
  } catch (err) {
    if (err.name === "ValidationError") {
      return sendValidationErr(err, res);
    }
  }
};

const delete_pharmacy = async (req, res) => {
  try {
    const { _id } = req.body;
    const [isExist, isExist2] = await Promise.all([
      Employees.findOne({ emp_pharmacy: _id, status: 1 }).select("_id").lean(),
      Orders.findOne({ pharmacy_id: _id, status: 1 }).select("_id").lean(),
    ]);
    if (isExist || isExist2) {
      return res.json(isExistErrorMsg);
    }
    await Pharmacies.findByIdAndUpdate(_id, { status: 0 });
    return res.json({ message: "Deleted", status: 1 });
  } catch ({ message }) {
    res.status(500).json({ message, status: 0 });
  }
};

const update_pharmacy = async (req, res) => {
  try {
    const { _id } = req.body;
    await Pharmacies.findByIdAndUpdate(_id, { ...req.body });
    return res.json({ message: "Updated", status: 1 });
  } catch (err) {
    if (err.name === "ValidationError") {
      return sendValidationErr(err, res);
    }
  }
};

module.exports = {
  list_pharmacies,
  add_pharmacy,
  delete_pharmacy,
  update_pharmacy,
};
