

// Helpers
function parseId(param) {
  const id = Number(param);
  if (Number.isNaN(id)) {
    const err = new Error("Invalid id");
    err.status = 400;
    throw err;
  }
  return id;
}

module.exports = { parseId };
