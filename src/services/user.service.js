const userRepo = require("../models/user.model");

async function listUsers() {
  return userRepo.findMany();
}

async function getUser(id) {
  const user = await userRepo.findById(id);
  if (!user) {
    const err = new Error("Not found");
    err.status = 404;
    throw err;
  }
  return user;
}

async function CreateUserByOAuth({ email, name, googleId }) {
  // Try to find by email (or skip if no email)
  const existing = email ? await userRepo.findByEmail(email) : null;

  if (!existing) {
    // Create and return the new user
    const created = await createUser({ email, name, googleId });
    return created; // new user object
  }

  // Return the existing user
  return existing;
}

async function createUser({ email, name, googleId }) {
  // Example rule: unique email
  const existing = email ? await userRepo.findByEmail(email) : null;
  if (existing) {
    const err = new Error("Email already exists");
    err.status = 409;
    throw err;
  }
  return userRepo.create({ email, name, googleId });
}

async function updateUser(id, { email, name }) {
  // Optional: prevent dup email on update
  if (email) {
    const existing = await userRepo.findByEmail(email);
    if (existing && existing.id !== id) {
      const err = new Error("Email already exists");
      err.status = 409;
      throw err;
    }
  }
  return userRepo.updateById(id, { email, name });
}

async function deleteUser(id) {
  await userRepo.deleteById(id);
}

async function checkHealth() {
  await userRepo.healthCheck();
  return { ok: true };
}

module.exports = {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
    checkHealth,
    CreateUserByOAuth,
};