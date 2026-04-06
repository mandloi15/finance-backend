const Transaction = require('../models/Transaction');

exports.addTransaction = async (req, res) => {
  const data = await Transaction.create({ ...req.body, user: req.user.id });
  res.json(data);
};

exports.getTransactions = async (req, res) => {
  const data = await Transaction.find({ user: req.user.id });
  res.json(data);
};

exports.deleteTransaction = async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
