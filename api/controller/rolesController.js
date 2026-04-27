const Roles = require("../model/roles");
const Employees = require("../model/employees");
const getLastDatabaseId = require("../utils/getLastDatabaseId");
const { isExistErrorMsg, sendValidationErr } = require("../utils/utils");

const list_roles = async (req, res) => {
  try {
    const { status, page, limit, search_str } = req.query;
    if (status) {
      const roles = await Roles.find({ status: 1 })
        .select("_id role_name")
        .lean();
      return res.json({ data: roles, status: 1 });
    } else {
      const LIMIT = Math.min(Number(limit), 100);
      const PAGE = Math.max(Number(page), 1);
      const offset = (PAGE - 1) * LIMIT;

      const matchFilter = { status: 1 };

      if (search_str) {
        matchFilter.role_name = { $regex: search_str, $options: "i" };
      }

      const pipeline = [
        { $match: matchFilter },
        { $skip: offset },
        { $limit: LIMIT },
      ];

      const [roles, total] = await Promise.all([
        Roles.aggregate(pipeline),
        Roles.countDocuments(matchFilter),
      ]);

      return res.json({ data: roles, total, status: 1 });
    }
  } catch ({ message }) {
    res.status(500).json({ message, status: 0 });
  }
};

const add_role = async (req, res) => {
  try {
    const { role_name } = req.body;
    const nextId = await getLastDatabaseId(Roles);
    const role = new Roles({ _id: nextId, role_name });
    await role.save();
    return res.json({ message: "New Role Created", status: 1 });
  } catch (err) {
    if (err.name === "ValidationError") {
      return sendValidationErr(err, res);
    }
  }
};

const delete_role = async (req, res) => {
  try {
    const { _id } = req.body;
    const isExist = await Employees.findOne({ emp_role: _id, status: 1 })
      .select("_id")
      .lean();
    if (isExist) {
      return res.json(isExistErrorMsg);
    }
    await Roles.findByIdAndUpdate(_id, { status: 0 });
    return res.json({ message: "Deleted", status: 1 });
  } catch ({ message }) {
    res.status(500).json({ message, status: 0 });
  }
};

const update_role = async (req, res) => {
  try {
    const { _id, role_name } = req.body;
    await Roles.findByIdAndUpdate(_id, { role_name });
    return res.json({ message: "Updated", status: 1 });
  } catch (err) {
    if (err.name === "ValidationError") {
      return sendValidationErr(err, res);
    }
  }
};

module.exports = { list_roles, add_role, delete_role, update_role };
