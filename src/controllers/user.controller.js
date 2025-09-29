const service = require("../services/user.service");

const { parseId } = require("../middlewares/utils");

/* Helpers
function parseId(param) {
  const id = Number(param);
  if (Number.isNaN(id)) {
    const err = new Error("Invalid id");
    err.status = 400;
    throw err;
  }
  return id;
}*/

async function health(req, res, next) {
  try {
    const result = await service.checkHealth();
    res.json(result);
  } catch (e) {
    next(e);
  }
}

async function createUser(req, res, next) {
  try {
    const { email, name } = req.body;
    const user = await service.createUser({ email, name });
    res.status(201).json(user);
  } catch (e) {
    next(e);
  }
}

async function listUsers(_req, res, next) {
  try {
    const users = await service.listUsers();
    res.json(users);
  } catch (e) {
    next(e);
  }
}

async function getUser(req, res, next) {
  try {
    const id = parseId(req.params.id);
    const user = await service.getUser(id);
    res.json(user);
  } catch (e) {
    next(e);
  }
}

async function updateUser(req, res, next) {
  try {
    const id = parseId(req.params.id);
    const { email, name } = req.body;
    const user = await service.updateUser(id, { email, name });
    res.json(user);
  } catch (e) {
    next(e);
  }
}

async function deleteUser(req, res, next) {
  try {
    const id = parseId(req.params.id);
    await service.deleteUser(id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
}

module.exports = {
  health,
  createUser,
  listUsers,
  getUser,
  updateUser,
  deleteUser,
};