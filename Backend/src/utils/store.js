const { randomUUID } = require("crypto");
const fs = require("fs/promises");
const path = require("path");

const dataDirectory = path.join(__dirname, "../../data");
const dataFilePath = path.join(dataDirectory, "store.json");

const defaultStore = {
  users: [],
  sessions: [],
  accounts: [],
  transactions: [],
};

let updateQueue = Promise.resolve();

function cloneDefaultStore() {
  return JSON.parse(JSON.stringify(defaultStore));
}

async function ensureStoreFile() {
  await fs.mkdir(dataDirectory, { recursive: true });

  try {
    await fs.access(dataFilePath);
  } catch {
    await fs.writeFile(
      dataFilePath,
      JSON.stringify(cloneDefaultStore(), null, 2),
      "utf8",
    );
  }
}

async function readStore() {
  await ensureStoreFile();

  try {
    const rawStore = await fs.readFile(dataFilePath, "utf8");
    const parsedStore = JSON.parse(rawStore);

    return {
      ...cloneDefaultStore(),
      ...parsedStore,
    };
  } catch {
    const freshStore = cloneDefaultStore();
    await fs.writeFile(dataFilePath, JSON.stringify(freshStore, null, 2), "utf8");
    return freshStore;
  }
}

async function writeStore(store) {
  await ensureStoreFile();
  await fs.writeFile(dataFilePath, JSON.stringify(store, null, 2), "utf8");
}

function updateStore(updater) {
  const task = updateQueue.then(async () => {
    const store = await readStore();
    const result = await updater(store);
    await writeStore(store);
    return result;
  });

  updateQueue = task.then(
    () => undefined,
    () => undefined,
  );

  return task;
}

function sanitizeUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}

function createAccount({ userId, name, type, initialDeposit = 0 }) {
  const now = new Date().toISOString();

  return {
    id: randomUUID(),
    userId,
    name,
    type,
    balance: Math.round(Number(initialDeposit) * 100) / 100,
    status: "ACTIVE",
    currency: "USD",
    createdAt: now,
    updatedAt: now,
  };
}

function createTransaction({
  userId,
  accountId,
  relatedAccountId = null,
  amount,
  type,
  description,
}) {
  return {
    id: randomUUID(),
    userId,
    accountId,
    relatedAccountId,
    amount: Math.round(Number(amount) * 100) / 100,
    type,
    description,
    status: "completed",
    createdAt: new Date().toISOString(),
  };
}

module.exports = {
  createAccount,
  createTransaction,
  randomId: randomUUID,
  readStore,
  sanitizeUser,
  updateStore,
};
