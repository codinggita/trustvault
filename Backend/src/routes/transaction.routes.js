const express = require("express");

const { requireAuth } = require("../middleware/auth.middleware");
const {
  createTransaction,
  readStore,
  updateStore,
} = require("../utils/store");

const router = express.Router();

function roundCurrency(value) {
  return Math.round(value * 100) / 100;
}

router.use(requireAuth);

router.get("/", async (req, res) => {
  const store = await readStore();

  const transactions = store.transactions
    .filter((entry) => entry.userId === req.user.id)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .map((entry) => {
      const account = store.accounts.find((accountItem) => accountItem.id === entry.accountId);
      const relatedAccount = store.accounts.find(
        (accountItem) => accountItem.id === entry.relatedAccountId,
      );

      return {
        ...entry,
        accountName: account ? account.name : "Account",
        relatedAccountName: relatedAccount ? relatedAccount.name : null,
      };
    });

  res.json(transactions);
});

router.post("/transfer", async (req, res) => {
  const fromAccountId = String(req.body?.fromAccount || "").trim();
  const toAccountId = String(req.body?.toAccount || "").trim();
  const amount = Number(req.body?.amount);
  const description = String(req.body?.description || "").trim();

  if (!fromAccountId || !toAccountId) {
    return res
      .status(400)
      .json({ message: "Please select both the source and destination accounts." });
  }

  if (fromAccountId === toAccountId) {
    return res
      .status(400)
      .json({ message: "Choose two different accounts for the transfer." });
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ message: "Amount must be greater than 0." });
  }

  const result = await updateStore((store) => {
    const fromAccount = store.accounts.find(
      (entry) => entry.id === fromAccountId && entry.userId === req.user.id,
    );
    const toAccount = store.accounts.find(
      (entry) => entry.id === toAccountId && entry.userId === req.user.id,
    );

    if (!fromAccount || !toAccount) {
      return { error: { status: 404, message: "One or more accounts were not found." } };
    }

    if (fromAccount.status !== "ACTIVE" || toAccount.status !== "ACTIVE") {
      return { error: { status: 400, message: "Both accounts must be active." } };
    }

    if (fromAccount.type !== "credit" && fromAccount.balance < amount) {
      return { error: { status: 400, message: "Insufficient balance for this transfer." } };
    }

    const now = new Date().toISOString();

    fromAccount.balance = roundCurrency(fromAccount.balance - amount);
    fromAccount.updatedAt = now;

    toAccount.balance = roundCurrency(toAccount.balance + amount);
    toAccount.updatedAt = now;

    const debitTransaction = createTransaction({
      userId: req.user.id,
      accountId: fromAccount.id,
      relatedAccountId: toAccount.id,
      amount,
      type: "debit",
      description: description || `Transfer to ${toAccount.name}`,
    });
    const creditTransaction = createTransaction({
      userId: req.user.id,
      accountId: toAccount.id,
      relatedAccountId: fromAccount.id,
      amount,
      type: "credit",
      description: description || `Transfer from ${fromAccount.name}`,
    });

    debitTransaction.createdAt = now;
    creditTransaction.createdAt = now;

    store.transactions.push(debitTransaction, creditTransaction);

    return {
      status: 201,
      body: {
        message: "Transfer completed successfully.",
        transfer: {
          amount,
          fromAccountId: fromAccount.id,
          toAccountId: toAccount.id,
          createdAt: now,
        },
      },
    };
  });

  if (result.error) {
    return res.status(result.error.status).json({ message: result.error.message });
  }

  return res.status(result.status).json(result.body);
});

module.exports = router;
