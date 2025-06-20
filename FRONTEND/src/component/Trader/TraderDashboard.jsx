import React from "react";
import TraderLayout from "../../layouts/TraderLayout";

const TraderDashboard = () => {
  return (
    <TraderLayout>
      <section className="p-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Welcome back, Trader!</h2>
          <p className="text-gray-600">Here is your trading dashboard summary.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow p-4 rounded-lg">
            <h4 className="text-lg text-gray-700 font-semibold">Account Balance</h4>
            <p className="text-2xl font-bold text-green-500">$45,320.50</p>
          </div>
          <div className="bg-white shadow p-4 rounded-lg">
            <h4 className="text-lg text-gray-700 font-semibold">Open Trades</h4>
            <p className="text-2xl font-bold text-yellow-500">5</p>
          </div>
          <div className="bg-white shadow p-4 rounded-lg">
            <h4 className="text-lg text-gray-700 font-semibold">Profit (This Month)</h4>
            <p className="text-2xl font-bold text-blue-500">+ $2,130.00</p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Recent Trades</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Trade ID</th>
                  <th className="p-2 border">Asset</th>
                  <th className="p-2 border">Type</th>
                  <th className="p-2 border">Amount</th>
                  <th className="p-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border">TR12345</td>
                  <td className="p-2 border">BTC/USD</td>
                  <td className="p-2 border">Buy</td>
                  <td className="p-2 border">$5,000</td>
                  <td className="p-2 border text-green-600">Closed</td>
                </tr>
                <tr>
                  <td className="p-2 border">TR12346</td>
                  <td className="p-2 border">ETH/USD</td>
                  <td className="p-2 border">Sell</td>
                  <td className="p-2 border">$2,500</td>
                  <td className="p-2 border text-yellow-600">Pending</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </TraderLayout>
  );
};

export default TraderDashboard;
