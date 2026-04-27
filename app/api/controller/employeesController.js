const Employees = require("../model/employees");
const Orders = require("../model/orders");
const Users = require("../model/users");
const bcrypt = require("bcryptjs");
const getLastDatabaseId = require("../utils/getLastDatabaseId");
const { $EmployeesRoles, $EmployeesPharmacy } = require("../utils/lookups");
const {
  isExistErrorMsg,
  sendValidationErr,
  CheckDuplicateExist,
} = require("../utils/utils");

const list_employees = async (req, res) => {
  try {
    const { status, page, limit, search_str, emp_role, emp_pharmacy } =
      req.query;

    const JoinedColumns = {
      emp_designation: "$role.role_name",
      emp_pharmacy_name: "$pharmacy.pharmacy_name",
      pharmacy_code: "$pharmacy.pharmacy_code",
    };

    if (status) {
      const employees = await Employees.aggregate([
        { $match: { status: 1 } },
        ...$EmployeesRoles,
        ...$EmployeesPharmacy,
        {
          $project: {
            _id: 1,
            emp_name: 1,
            emp_role: 1,
            ...JoinedColumns,
          },
        },
      ]);

      return res.json({ data: employees, status: 1 });
    } else {
      const LIMIT = Math.min(Number(limit), 100);
      const PAGE = Math.max(Number(page), 1);
      const offset = (PAGE - 1) * LIMIT;

      const matchFilter = { status: 1 };

      if (search_str) {
        matchFilter.$or = [
          { emp_name: { $regex: search_str, $options: "i" } },
          { emp_contact: { $regex: search_str, $options: "i" } },
        ];
      }

      if (emp_role) {
        matchFilter.emp_role = Number(emp_role);
      }

      if (emp_pharmacy) {
        matchFilter.emp_pharmacy = Number(emp_pharmacy);
      }

      const pipeline = [
        { $match: matchFilter },
        ...$EmployeesRoles,
        ...$EmployeesPharmacy,
        { $skip: offset },
        { $limit: LIMIT },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: ["$$ROOT", JoinedColumns],
            },
          },
        },
      ];

      const [employees, total] = await Promise.all([
        Employees.aggregate(pipeline),
        Employees.countDocuments(matchFilter),
      ]);

      return res.json({ data: employees, total, status: 1 });
    }
  } catch ({ message }) {
    res.status(500).json({ message, status: 0 });
  }
};

const add_employee = async (req, res) => {
  try {
    const dupExist = await CheckDuplicateExist(
      res,
      Employees,
      "emp_contact",
      req.body.emp_contact,
      "Contact Number",
    );
    if (dupExist) return;

    const nextId = await getLastDatabaseId(Employees);
    const emp_mobile_password = await bcrypt.hash(
      process.env.DEFAULT_MOBILE_PASSWORD,
      7,
    );
    const emp = new Employees({
      ...req.body,
      _id: nextId,
      emp_mobile_password,
    });
    await emp.save();
    return res.json({ message: "Added", status: 1 });
  } catch (err) {
    if (err.name === "ValidationError") {
      return sendValidationErr(err, res);
    }
  }
};

const delete_employee = async (req, res) => {
  try {
    const { _id } = req.body;
    const [isExist, isExist2] = await Promise.all([
      Orders.findOne({ emp_id: _id, status: 1 }).select("_id").lean(),
      Users.findOne({ emp_id: _id, status: 1 }).select("_id").lean(),
    ]);
    if (isExist || isExist2) {
      return res.json(isExistErrorMsg);
    }
    await Employees.findByIdAndUpdate(_id, { status: 0 });
    return res.json({ message: "Deleted", status: 1 });
  } catch ({ message }) {
    res.status(500).json({ message, status: 0 });
  }
};

const update_employee = async (req, res) => {
  try {
    const { _id } = req.body;
    const dupExist = await CheckDuplicateExist(
      res,
      Employees,
      "emp_contact",
      req.body.emp_contact,
      "Contact Number",
      _id,
    );
    if (dupExist) return;

    await Employees.findByIdAndUpdate(_id, { ...req.body });
    return res.json({ message: "Updated", status: 1 });
  } catch (err) {
    if (err.name === "ValidationError") {
      return sendValidationErr(err, res);
    }
  }
};

module.exports = {
  list_employees,
  add_employee,
  delete_employee,
  update_employee,
};
