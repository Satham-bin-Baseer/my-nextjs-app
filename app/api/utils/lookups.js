export const $EmployeesRoles = [
  {
    $lookup: {
      from: "roles",
      localField: "emp_role",
      foreignField: "_id",
      as: "role",
    },
  },
  { $unwind: "$role" },
];

export const $EmployeesRolesUnwind = [
  {
    $lookup: {
      from: "roles",
      localField: "employee.emp_role",
      foreignField: "_id",
      as: "role",
    },
  },
  { $unwind: "$role" },
];

export const $UsersEmployees = [
  {
    $lookup: {
      from: "employees",
      localField: "emp_id",
      foreignField: "_id",
      as: "employee",
    },
  },
  { $unwind: "$employee" },
];

export const $EmployeesPharmacy = [
  {
    $lookup: {
      from: "pharmacies",
      localField: "emp_pharmacy",
      foreignField: "_id",
      as: "pharmacy",
    },
  },
  { $unwind: { path: "$pharmacy", preserveNullAndEmptyArrays: true } },
];

export const $EmployeesPharmacyUnwind = [
  {
    $lookup: {
      from: "pharmacies",
      localField: "employee.emp_pharmacy",
      foreignField: "_id",
      as: "pharmacy",
    },
  },
  { $unwind: { path: "$pharmacy", preserveNullAndEmptyArrays: true } },
];

export const $OrdersPharmacy = [
  {
    $lookup: {
      from: "pharmacies",
      localField: "pharmacy_id",
      foreignField: "_id",
      as: "pharmacy",
    },
  },
  { $unwind: { path: "$pharmacy", preserveNullAndEmptyArrays: true } },
];

export const $OrdersEmployees = [
  {
    $lookup: {
      from: "employees",
      localField: "emp_id",
      foreignField: "_id",
      as: "employee",
    },
  },
  { $unwind: "$employee" },
];
