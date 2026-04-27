async function getLastDatabaseId(Model) {
  const lastDoc = await Model.findOne().sort({ _id: -1 }).select("_id").lean();
  return lastDoc ? lastDoc._id + 1 : 1;
}

module.exports = getLastDatabaseId;
