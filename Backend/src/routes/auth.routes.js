const bcrypt = require("bcryptjs");
const express = require("express");

const { requireAuth } = require("../middleware/auth.middleware");
const {
  createAccount,
  createTransaction,
  randomId,
  sanitizeUser,
  updateStore,
} = require("../utils/store");

const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/register", async (req, res) => {
  const name = String(req.body?.name || "").trim();
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email, and password are required." });
  }

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ message: "Please enter a valid email." });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long." });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const result = await updateStore((store) => {
    const existingUser = store.users.find((user) => user.email === email);

    if (existingUser) {
      return { error: { status: 409, message: "Email is already registered." } };
    }

    const now = new Date().toISOString();
    const user = {
      id: randomId(),
      email,
      name,
      passwordHash,
      createdAt: now,
      updatedAt: now,
    };

    const checkingAccount = createAccount({
      userId: user.id,
      name: "Primary Checking",
      type: "checking",
      initialDeposit: 2500,
    });
    const savingsAccount = createAccount({
      userId: user.id,
      name: "Savings Vault",
      type: "savings",
      initialDeposit: 1000,
    });
    const token = randomId();

    store.users.push(user);
    store.sessions.push({ token, userId: user.id, createdAt: now });
    store.accounts.push(checkingAccount, savingsAccount);
    store.transactions.push(
      createTransaction({
        userId: user.id,
        accountId: checkingAccount.id,
        amount: checkingAccount.balance,
        type: "credit",
        description: "Opening deposit",
      }),
      createTransaction({
        userId: user.id,
        accountId: savingsAccount.id,
        amount: savingsAccount.balance,
        type: "credit",
        description: "Savings starter deposit",
      }),
    );

    return {
      status: 201,
      body: {
        message: "Account created successfully.",
        user: sanitizeUser(user),
        token,
      },
    };
  });

  if (result.error) {
    return res.status(result.error.status).json({ message: result.error.message });
  }

  return res.status(result.status).json(result.body);
});

router.post("/login", async (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const result = await updateStore(async (store) => {
    const user = store.users.find((entry) => entry.email === email);

    if (!user) {
      return { error: { status: 401, message: "Invalid email or password." } };
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      return { error: { status: 401, message: "Invalid email or password." } };
    }

    const token = randomId();

    store.sessions = store.sessions.filter((session) => session.userId !== user.id);
    store.sessions.push({
      token,
      userId: user.id,
      createdAt: new Date().toISOString(),
    });

    return {
      body: {
        message: "Login successful.",
        user: sanitizeUser(user),
        token,
      },
    };
  });

  if (result.error) {
    return res.status(result.error.status).json({ message: result.error.message });
  }

  return res.json(result.body);
});

router.get("/me", requireAuth, async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});

router.post("/logout", requireAuth, async (req, res) => {
  await updateStore((store) => {
    store.sessions = store.sessions.filter(
      (session) => session.token !== req.authToken,
    );
  });

  res.json({ message: "Logged out successfully." });
});

module.exports = router;
