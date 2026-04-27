const Users = require("../model/users");
const bcrypt = require("bcryptjs");
const { sendValidationErr } = require("../utils/utils");
const { $EmployeesRolesUnwind, $UsersEmployees } = require("../utils/lookups");

const list_users = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const LIMIT = Math.min(Number(limit), 100);
    const PAGE = Math.max(Number(page), 1);
    const offset = (PAGE - 1) * LIMIT;

    const basePipeline = [
      { $match: { status: 1 } },
      ...$UsersEmployees,
      ...$EmployeesRolesUnwind,
    ];

    if (search) {
      basePipeline.push({
        $match: {
          $or: [
            { username: { $regex: search, $options: "i" } },
            { "employee.emp_name": { $regex: search, $options: "i" } },
            { "role.role_name": { $regex: search, $options: "i" } },
          ],
        },
      });
    }

    const dataPipeline = [
      ...basePipeline,
      { $skip: offset },
      { $limit: LIMIT },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              "$$ROOT",
              { emp_name: "$employee.emp_name" },
              { emp_gender: "$employee.emp_gender" },
              { emp_designation: "$role.role_name" },
            ],
          },
        },
      },
    ];

    const countPipeline = [...basePipeline, { $count: "total" }];

    const [users, countResult] = await Promise.all([
      Users.aggregate(dataPipeline),
      Users.aggregate(countPipeline),
    ]);

    const total = countResult[0]?.total ?? 0;

    return res.json({ data: users, total, status: 1 });
  } catch ({ message }) {
    res.status(500).json({ message, status: 0 });
  }
};

const add_user = async (req, res) => {
  try {
    const { username, password, emp_id } = req.body;

    const isEmpExist = await Users.findOne({ emp_id, status: 1 })
      .select("username")
      .lean();
    if (isEmpExist) {
      let message = `Login already exist for this staff, username: ${isEmpExist.username}`;
      return res.json({ message, status: 0 });
    }

    const isUsernameExist = await Users.findOne({ username, status: 1 })
      .select("_id")
      .lean();
    if (isUsernameExist) {
      let message = `This username already exist`;
      return res.json({ message, status: 0 });
    }

    const EncryptedPassword = await bcrypt.hash(password, 7);
    const user = new Users({ username, password: EncryptedPassword, emp_id });
    await user.save();

    return res.json({ message: "User Created", status: 1 });
  } catch (err) {
    if (err.name === "ValidationError") {
      return sendValidationErr(err, res);
    }
  }
};

const delete_user = async (req, res) => {
  try {
    const { _id } = req.body;
    await Users.findByIdAndUpdate(_id, { status: 0 });
    return res.json({ message: "Deleted", status: 1 });
  } catch ({ message }) {
    res.status(500).json({ message, status: 0 });
  }
};

const update_user = async (req, res) => {
  try {
    const { _id, username, is_active } = req.body;
    const isUsernameExist = await Users.findOne({
      username,
      status: 1,
      _id: { $ne: _id },
    })
      .select("_id")
      .lean();
    if (isUsernameExist) {
      let message = `This username already exist`;
      return res.json({ message, status: 0 });
    }
    await Users.findByIdAndUpdate(_id, { username, is_active });
    return res.json({ message: "Updated", status: 1 });
  } catch (err) {
    if (err.name === "ValidationError") {
      return sendValidationErr(err, res);
    }
  }
};

module.exports = { list_users, add_user, delete_user, update_user };
