const Menus = require("../model/menus");
const getLastDatabaseId = require("../utils/getLastDatabaseId");
const { sendValidationErr, CheckDuplicateExist } = require("../utils/utils");

const list_menus = async (req, res) => {
  try {
    const { status, page, limit } = req.query;
    if (status) {
      const menus = await Menus.find({ status: 1 })
        .select("_id menuname_key")
        .lean();
      return res.json({ data: menus, status: 1 });
    } else {
      const LIMIT = Math.min(Number(limit), 100);
      const PAGE = Math.max(Number(page), 1);
      const offset = (PAGE - 1) * LIMIT;

      const roles = await Menus.find({ status: 1 })
        .skip(offset)
        .limit(limit)
        .lean();
      const total = await Menus.countDocuments({ status: 1 });

      return res.json({ data: roles, total, status: 1 });
    }
  } catch ({ message }) {
    res.status(500).json({ message, status: 0 });
  }
};

const add_menu = async (req, res) => {
  try {
    const { menuname_key } = req.body;
    const dupExist = await CheckDuplicateExist(
      res,
      Menus,
      "menuname_key",
      menuname_key,
      "Menu Key",
    );
    if (dupExist) return;

    const nextId = await getLastDatabaseId(Menus);
    const role = new Menus({ _id: nextId, menuname_key });
    await role.save();
    return res.json({ message: "New Menu Created", status: 1 });
  } catch (err) {
    if (err.name === "ValidationError") {
      return sendValidationErr(err, res);
    }
  }
};

const delete_menu = async (req, res) => {
  try {
    const { _id } = req.body;
    await Menus.findByIdAndUpdate(_id, { status: 0 });
    return res.json({ message: "Deleted", status: 1 });
  } catch ({ message }) {
    res.status(500).json({ message, status: 0 });
  }
};

module.exports = { list_menus, add_menu, delete_menu };
