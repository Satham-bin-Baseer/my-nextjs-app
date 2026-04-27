const UserMenuPermission = require("../model/userMenuPermission");
const Users = require("../model/users");
const Employees = require("../model/employees");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const generateToken = require("../utils/generateToken");
const {
  $UsersEmployees,
  $EmployeesRoles,
  $EmployeesPharmacy,
  $EmployeesRolesUnwind,
  $EmployeesPharmacyUnwind,
} = require("../utils/lookups");

const perform_user_login = async (req, res) => {
  try {
    const { username, password, username: emp_contact } = req.body;

    if (username == process.env.DEV_UN && password == process.env.DEV_PW) {
      const data = generateToken({ role_name: "Developer" }, req);
      return res.json({ data, status: 1 });
    }

    const userByUsername = await Users.findOne({ username, status: 1 }).lean();
    const userByMob = await Employees.findOne({
      emp_contact,
      status: 1,
    }).lean();

    const userExist = userByUsername || userByMob;

    if (!userExist) {
      return res.json({ message: "User not exist", status: 0 });
    }

    const passwordField = userByUsername ? "password" : "emp_mobile_password";
    const ComparePassword = await bcrypt.compare(
      password,
      userExist[passwordField],
    );
    if (!ComparePassword) {
      return res.json({ message: "Password wrong", status: 0 });
    }

    var checkActiveStatus;
    if (userByUsername) {
      checkActiveStatus = await Users.findOne({
        username,
        is_active: false,
        status: 1,
      })
        .select("_id")
        .lean();
    } else if (userByMob) {
      checkActiveStatus = await Employees.findOne({
        emp_contact,
        is_active: false,
        status: 1,
      })
        .select("_id")
        .lean();
    }
    if (checkActiveStatus) {
      return res.json({ message: "Login Disabled", status: 0 });
    }

    const excess = {
      role_name: "$role.role_name",
      pharmacy_id: "$pharmacy._id",
      pharmacy_code: "$pharmacy.pharmacy_code",
      pharmacy_name: "$pharmacy.pharmacy_name",
    };

    if (userByUsername) {
      excess.emp_role = "$employee.emp_role";
      excess.emp_name = "$employee.emp_name";
    } else {
      excess.emp_id = "_id";
    }

    const excessColumns = {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: ["$$ROOT", { ...excess }],
        },
      },
    };

    var aggregate;
    const Model = userByUsername ? Users : Employees;

    if (userByUsername) {
      aggregate = [
        { $match: { username, status: 1 } },
        ...$UsersEmployees,
        ...$EmployeesRolesUnwind,
        ...$EmployeesPharmacyUnwind,
        { ...excessColumns },
      ];
    } else if (userByMob) {
      aggregate = [
        { $match: { emp_contact, status: 1 } },
        ...$EmployeesRoles,
        ...$EmployeesPharmacy,
        { ...excessColumns },
      ];
    }

    const user_data = await Model.aggregate(aggregate);

    var jwtData;

    if (user_data.length > 0) {
      jwtData = generateToken(user_data[0], req);
    }
    if (jwtData) {
      return res.json({ data: jwtData, status: 1 });
    } else {
      return res.json({ message: "Error!", status: 0 });
    }
  } catch ({ message }) {
    res.status(500).json({ message, status: 0 });
  }
};

const list_user_permissions = async (req, res) => {
  try {
    const { role_id } = req.query;
    const query = { status: 1 };
    if (role_id) query.role_id = role_id;
    const data = await UserMenuPermission.find(query).lean();
    res.json({ data, status: 1 });
  } catch ({ message }) {
    res.status(500).json({ message, status: 0 });
  }
};

const update_user_permissions = async (req, res) => {
  try {
    const { changes } = req.body;
    const bulkOps = changes.map((item) => {
      const { status, role_id, menu_key, action_id } = item;
      const dt = { role_id, menu_key, action_id, status: 1 };
      if (status === 1) {
        return { insertOne: { document: { ...dt } } };
      } else {
        return { deleteOne: { filter: { ...dt } } };
      }
    });
    await UserMenuPermission.collection.bulkWrite(bulkOps); // Runs all inserts/deletes in one round trip to MongoDB
    res.json({ message: "Updated", status: 1 });
  } catch ({ message }) {
    res.status(500).json({ message, status: 0 });
  }
};

const perform_google_login = async (req, res) => {
  try {
    const { access_token } = req.body;
    const headers = { Authorization: `Bearer ${access_token}` };
    const { data } = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo`,
      { headers },
    );
    res.json({ data, status: 1 });
  } catch ({ message }) {
    res.status(500).json({ message, status: 0 });
  }
};

module.exports = {
  list_user_permissions,
  perform_user_login,
  update_user_permissions,
  perform_google_login,
};
