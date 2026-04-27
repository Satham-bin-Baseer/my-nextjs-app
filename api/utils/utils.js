export const isExistErrorMsg = {
  message: "Can't delete, this data linked with another data",
  status: 0,
};

export const sendValidationErr = (err, res) => {
  /* {
    name: "ValidationError",
    message: "Employees validation failed: emp_gender: Gender Missing",
    errors: {
      emp_gender: {
        message: "Gender Missing",
        path: "emp_gender",
        kind: "required"
      }
    }
  }*/
  const DataTypeErr = Object.values(err.errors)[0].name;
  if (DataTypeErr === "CastError") {
    return res.status(200).json({
      status: 0,
      message: "Data Type Mismatch",
    });
  }
  const MissingErrMsg = Object.values(err.errors)[0].message;
  return res.status(200).json({
    status: 0,
    message: MissingErrMsg,
  });
};

export const CheckDuplicateExist = async (
  res,
  Model,
  db_key,
  reqVal,
  missingMsg,
  excludeId = null,
) => {
  const query = { [db_key]: reqVal, status: 1 };
  if (excludeId) query._id = { $ne: excludeId };
  const isValExist = await Model.findOne(query).select("_id").lean();
  if (isValExist) {
    res.json({ message: `${missingMsg} Already Exist`, status: 0 });
    return true;
  }
  return false;
};
