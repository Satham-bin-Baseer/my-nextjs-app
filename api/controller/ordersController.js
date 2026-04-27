const Orders = require("../model/orders");
const StockRequest = require("../model/stockRequest");
const getLastDatabaseId = require("../utils/getLastDatabaseId");
const { sendValidationErr } = require("../utils/utils");
const {
  $EmployeesRolesUnwind,
  $OrdersEmployees,
  $OrdersPharmacy,
} = require("../utils/lookups");

const list_orders = async (req, res) => {
  try {
    const {
      page,
      limit,
      search_str,
      emp_designation,
      emp_id,
      from_date,
      to_date,
    } = req.query;
    const { pharmacy_id } = req.body;
    const LIMIT = Math.min(Number(limit), 100);
    const PAGE = Math.max(Number(page), 1);
    const offset = (PAGE - 1) * LIMIT;
    const matchCondition = { status: 1 };
    if (pharmacy_id) matchCondition.pharmacy_id = pharmacy_id;

    if (search_str) {
      matchCondition.item_name = Number(search_str);
    }

    if (from_date && to_date) {
      const nextDay = new Date(to_date);
      nextDay.setDate(nextDay.getDate() + 1);
      matchCondition.formatted_date = {
        $gte: from_date,
        $lt: nextDay.toISOString().slice(0, 10),
      };
    }

    if (emp_designation) {
      matchCondition["employee.emp_role"] = Number(emp_designation);
    }

    if (emp_id) {
      matchCondition.emp_id = Number(emp_id);
    }

    const basePipeline = [
      {
        $addFields: {
          formatted_date: { $substr: ["$ordered_date", 0, 10] },
        },
      },
      ...$OrdersPharmacy,
      ...$OrdersEmployees,
      ...$EmployeesRolesUnwind,
      { $match: matchCondition },
    ];

    const dataPipeline = [
      ...basePipeline,
      { $sort: { ordered_date: -1 } },
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
              { pharmacy_code: "$pharmacy.pharmacy_code" },
              { pharmacy_name: "$pharmacy.pharmacy_name" },
            ],
          },
        },
      },
    ];

    const countPipeline = [...basePipeline, { $count: "total" }];

    const [orders, countResult] = await Promise.all([
      Orders.aggregate(dataPipeline),
      Orders.aggregate(countPipeline),
    ]);

    const total = countResult[0]?.total ?? 0;

    return res.json({ data: orders, total, status: 1 });
  } catch ({ message }) {
    res.status(500).json({ message, status: 0 });
  }
};

const create_order = async (req, res) => {
  try {
    const nextId = await getLastDatabaseId(Orders);
    const { data, pharmacy_id, pharmacy_code, ordered_date, emp_id } = req.body;
    const order_data = new Orders({
      _id: nextId,
      pharmacy_id,
      pharmacy_code,
      ordered_date,
      emp_id,
    });
    const { _id: ORDER_ID } = await order_data.save();
    if (ORDER_ID) {
      data.forEach(async ({ item_id, quantity }, index) => {
        const asked_stoks = new StockRequest({
          item_id,
          quantity,
          order_id: ORDER_ID,
        });
        await asked_stoks.save();
      });
      return res.json({ message: "Order Created", status: 1 });
    }
  } catch (err) {
    if (err.name === "ValidationError") {
      return sendValidationErr(err, res);
    }
  }
};

const delete_order = async (req, res) => {
  try {
    const { _id } = req.body;
    const del = await StockRequest.deleteMany({ order_id: _id });
    if (del) {
      await Orders.findByIdAndUpdate(_id, { status: 0 });
      return res.json({ message: "Deleted", status: 1 });
    }
  } catch ({ message }) {
    res.status(500).json({ message, status: 0 });
  }
};

const list_orders_by_order_id = async (req, res) => {
  try {
    const { order_id } = req.query;
    const data = await StockRequest.find({ order_id, status: 1 }).lean();
    res.json({ data, status: 1 });
  } catch ({ message }) {
    res.status(500).json({ message, status: 0 });
  }
};

const delete_order_by_order_id = async (req, res) => {
  try {
    const _id = req.query;
    await StockRequest.findByIdAndDelete(_id);
    return res.json({ message: "Deleted", status: 1 });
  } catch ({ message }) {
    res.status(500).json({ message, status: 0 });
  }
};

const update_orders_by_order_ids = async (req, res) => {
  try {
    const { data } = req.body;
    data.forEach(async ({ _id, item_id, quantity, order_id }) => {
      await StockRequest.updateOne(
        { _id },
        { $set: { item_id, quantity, order_id } },
        { upsert: true },
      );
    });
    return res.json({ message: "Updated", status: 1 });
  } catch (err) {
    if (err.name === "ValidationError") {
      return sendValidationErr(err, res);
    }
  }
};

module.exports = {
  list_orders,
  create_order,
  delete_order,
  list_orders_by_order_id,
  delete_order_by_order_id,
  update_orders_by_order_ids,
};
