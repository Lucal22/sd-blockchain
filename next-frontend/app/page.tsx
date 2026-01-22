"use client";

import { useState, useEffect } from "react";
import { createTransaction, getChain, type Block } from "@/libs/api";

export default function Home() {
  const [formData, setFormData] = useState({
    sender: "",
    recipient: "",
    amount: "",
  });
  const [chain, setChain] = useState<Block[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch chain on component mount and set up polling
  useEffect(() => {
    fetchChain();
    const interval = setInterval(fetchChain, 2000); // Poll every 2 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchChain = async () => {
    try {
      const data = await getChain();
      setChain(data.chain);
      setError(null);
    } catch (err) {
      console.error("Error fetching chain:", err);
      setError("Failed to fetch blockchain data");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.sender || !formData.recipient || !formData.amount) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Amount must be a valid positive number");
      }

      await createTransaction({
        sender: formData.sender,
        recipient: formData.recipient,
        amount,
      });

      setFormData({ sender: "", recipient: "", amount: "" });
      // Fetch chain immediately after transaction
      await fetchChain();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create transaction",
      );
    } finally {
      setLoading(false);
    }
  };

  // Get all transactions from the chain, excluding mining rewards (sender = "0")
  const allTransactions = chain
    .flatMap((block) => block.transactions)
    .filter((tx) => tx.sender !== "0");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Blockchain Network</h1>

        {/* Transaction Form */}
        <div className="bg-slate-700 rounded-lg p-6 mb-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">
            Create New Transaction
          </h2>

          {error && (
            <div className="bg-red-500 text-white p-3 rounded mb-4">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex gap-4 flex-wrap items-end"
          >
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium mb-2">Sender</label>
              <input
                type="text"
                name="sender"
                value={formData.sender}
                onChange={handleInputChange}
                placeholder="e.g., Alan"
                className="w-full px-4 py-2 rounded bg-slate-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium mb-2">
                Recipient
              </label>
              <input
                type="text"
                name="recipient"
                value={formData.recipient}
                onChange={handleInputChange}
                placeholder="e.g., Bob"
                className="w-full px-4 py-2 rounded bg-slate-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium mb-2">Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="e.g., 5"
                step="0.01"
                min="0"
                className="w-full px-4 py-2 rounded bg-slate-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-700 text-white font-semibold rounded transition"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
        </div>

        {/* Transactions List */}
        <div className="bg-slate-700 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">
            Transactions ({allTransactions.length})
          </h2>

          {allTransactions.length === 0 ? (
            <p className="text-gray-400">
              No transactions yet. Create one to get started!
            </p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {allTransactions.map((tx, index) => (
                <div
                  key={index}
                  className="bg-slate-600 p-4 rounded flex justify-between items-center hover:bg-slate-500 transition"
                >
                  <div className="flex-1">
                    <p className="text-sm text-gray-300">
                      <span className="font-semibold text-blue-400">
                        {tx.sender}
                      </span>
                      <span className="mx-2">→</span>
                      <span className="font-semibold text-green-400">
                        {tx.recipient}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-yellow-400">
                      {tx.amount}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-slate-500 text-sm text-gray-400">
            <p>Total Blocks: {chain.length}</p>
            <p>Last Update: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
