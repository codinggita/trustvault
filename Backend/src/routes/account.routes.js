const express = require("express");

const { requireAuth } = require("../middleware/auth.middleware");
const {
  createAccount,
  createTransaction,
  updateStore,
  readStore,
} = require("../utils/store");

const router = express.Router();

const ACCOUNT_TYPES = new Set(["checking", "savings", "credit"]);

router.use(requireAuth);

router.get("/", async (req, res) => {
  const store = await readStore();
  const search = String(req.query.q || "").trim().toLowerCase();

  const accounts = store.accounts
    .filter((account) => account.userId === req.user.id)
    .filter((account) => {
      if (!search) {
        return true;
      }

      return (
        account.name.toLowerCase().includes(search) ||
        account.type.toLowerCase().includes(search)
      );
    })
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));

  res.json(accounts);
});

router.post("/", async (req, res) => {
  const name = String(req.body?.name || "").trim();
  const type = String(req.body?.type || "").trim().toLowerCase();
  const initialDeposit = Number(req.body?.initialDeposit || 0);

  if (!name) {
    return res.status(400).json({ message: "Account name is required." });
  }

  if (!ACCOUNT_TYPES.has(type)) {
    return res.status(400).json({ message: "Please choose a valid account type." });
  }

  if (!Number.isFinite(initialDeposit) || initialDeposit < 0) {
    return res
      .status(400)
      .json({ message: "Initial deposit must be 0 or greater." });
  }

  const result = await updateStore((store) => {
    const account = createAccount({
      userId: req.user.id,
      name,
      type,
      initialDeposit,
    });

    store.accounts.push(account);

    if (initialDeposit > 0) {
      store.transactions.push(
        createTransaction({
          userId: req.user.id,
          accountId: account.id,
          amount: initialDeposit,
          type: "credit",
          description: "Initial deposit",
        }),
      );
    }

    return {
      status: 201,
      body: {
        message: "Account created successfully.",
        account,
      },
    };
  });

  return res.status(result.status).json(result.body);
});

router.get("/:accountId/balance", async (req, res) => {
  const store = await readStore();
  const account = store.accounts.find(
    (entry) => entry.id === req.params.accountId && entry.userId === req.user.id,
  );

  if (!account) {
    return res.status(404).json({ message: "Account not found." });
  }

  return res.json({
    accountId: account.id,
    balance: account.balance,
    currency: account.currency,
  });
});

module.exports = router;
