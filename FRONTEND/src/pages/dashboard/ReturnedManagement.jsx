import React, { useState, useEffect } from "react";
import { FiClipboard, FiRefreshCw } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";

const RETURN_REASONS = [
    "Khách đổi ý",
    "Sản phẩm lỗi",
    "Giao sai sản phẩm",
    "Khác"
];

const ReturnedManagement = () => {
    const [activeTab, setActiveTab] = useState("orders");
    const [orders, setOrders] = useState([]);
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [showRecordModal, setShowRecordModal] = useState(false);
    const [recordOrderId, setRecordOrderId] = useState(null);
    const [recordReason, setRecordReason] = useState("");
    const [customReason, setCustomReason] = useState("");
    const [showEditReasonModal, setShowEditReasonModal] = useState(false);
    const [editReason, setEditReason] = useState("");
    const [editReturnOrderId, setEditReturnOrderId] = useState(null);

    const openEditReasonModal = (returnOrderId, currentReason) => {
        setEditReturnOrderId(returnOrderId);
        setEditReason(currentReason || "");
        setShowEditReasonModal(true);
    };
    // Lấy userId từ localStorage (hoặc context)
    const userId = localStorage.getItem("userId") || 1;

    // Fetch orders có trạng thái returned
    useEffect(() => {
        if (activeTab === "orders") {
            setLoading(true);
            axios
                .get("http://localhost:9999/PureFoods_war/api/export-requests")
                .then((res) => {
                    setOrders(res.data.filter((order) => order.status.trim() === "returned"));
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [activeTab]);

    // Fetch danh sách returns
    useEffect(() => {
        if (activeTab === "returns") {
            setLoading(true);
            axios
                .get("http://localhost:9999/PureFoods_war/api/returns/list")
                .then((res) => {
                    setReturns(res.data);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [activeTab]);

    // Modal ghi nhận trả hàng
    const openRecordModal = (orderId) => {
        setRecordOrderId(orderId);
        setRecordReason("");
        setCustomReason("");
        setShowRecordModal(true);
    };

    const handleRecordReturn = async () => {
    const reason = recordReason === "Khác" ? customReason : recordReason;
    if (!reason) {
        toast.error("Vui lòng chọn hoặc nhập lý do trả hàng!");
        return;
    }
    try {
        // Ghi nhận trả hàng
        await axios.post(
            `http://localhost:9999/PureFoods_war/api/returns/record/${recordOrderId.replace("ORD00", "")}?reason=${encodeURIComponent(
                reason
            )}&processBy=${userId}`
        );
        // Gọi API cập nhật tồn kho sau trả hàng
        await axios.put(
            `http://localhost:9999/PureFoods_war/api/returns/update-inventory/${recordOrderId.replace("ORD00", "")}`
        );
        toast.success("Ghi nhận trả hàng và cập nhật tồn kho thành công!");
        setShowRecordModal(false);
        setOrders(orders.filter((order) => order.id !== recordOrderId));
    } catch (err) {
        const msg =
            err.response?.data?.message ||
            (typeof err.response?.data === "string" ? err.response.data : "Ghi nhận trả hàng hoặc cập nhật tồn kho thất bại!");
        toast.error(msg);
    }
};
    const handleEditReason = async () => {
        if (!editReason.trim()) {
            toast.error("Vui lòng nhập lý do mới!");
            return;
        }
        try {
            await axios.put(
                `http://localhost:9999/PureFoods_war/api/returns/edit-reason/${editReturnOrderId}?reason=${encodeURIComponent(editReason)}`
            );
            toast.success("Sửa lý do trả hàng thành công!");
            setShowEditReasonModal(false);
            // Refresh lại danh sách returns
            setLoading(true);
            const res = await axios.get("http://localhost:9999/PureFoods_war/api/returns/list");
            setReturns(res.data);
            setLoading(false);
        } catch (err) {
            toast.error("Sửa lý do thất bại!");
        }
    };
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold mb-8">Quản lý trả hàng</h1>
                {/* Tabs */}
                <div className="flex space-x-4 mb-6">
                    <button
                        className={`px-4 py-2 rounded ${activeTab === "orders" ? "bg-blue-600 text-white" : "bg-white text-blue-600 border"}`}
                        onClick={() => setActiveTab("orders")}
                    >
                        Đơn hàng trạng thái Returned
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${activeTab === "returns" ? "bg-blue-600 text-white" : "bg-white text-blue-600 border"}`}
                        onClick={() => setActiveTab("returns")}
                    >
                        Danh sách đơn trả hàng
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
                    </div>
                ) : activeTab === "orders" ? (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{order.customerName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">${order.amount?.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{order.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                title="Ghi nhận trả hàng"
                                                onClick={() => openRecordModal(order.id)}
                                                className="text-red-600 hover:text-red-800 flex items-center space-x-1"
                                            >
                                                <FiClipboard className="w-5 h-5" />
                                                <span>Ghi nhận trả hàng</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Return ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày trả</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lý do</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Người xử lý</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {returns.map((ret) => (
                                    <tr key={ret.returnOrderId} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">{ret.returnOrderId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{ret.orderId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{ret.customerName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {ret.returnDate ? new Date(ret.returnDate).toLocaleString() : ""}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{ret.returnReason}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{ret.statusName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{ret.processedByName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                className="text-yellow-600 hover:text-yellow-800"
                                                title="Sửa lý do"
                                                onClick={() => openEditReasonModal(ret.returnOrderId, ret.returnReason)}
                                            >
                                                Sửa lý do
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Modal ghi nhận trả hàng */}
                {showRecordModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h3 className="text-lg font-semibold mb-4">Chọn lý do trả hàng</h3>
                            <div className="mb-4">
                                {RETURN_REASONS.map((reason) => (
                                    <label key={reason} className="block mb-2">
                                        <input
                                            type="radio"
                                            name="returnReason"
                                            value={reason}
                                            checked={recordReason === reason}
                                            onChange={() => setRecordReason(reason)}
                                            className="mr-2"
                                        />
                                        {reason}
                                    </label>
                                ))}
                                {recordReason === "Khác" && (
                                    <input
                                        type="text"
                                        className="w-full border rounded p-2 mt-2"
                                        placeholder="Nhập lý do khác..."
                                        value={customReason}
                                        onChange={e => setCustomReason(e.target.value)}
                                    />
                                )}
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setShowRecordModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleRecordReturn}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Xác nhận
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {showEditReasonModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h3 className="text-lg font-semibold mb-4">Sửa lý do trả hàng</h3>
                            <input
                                type="text"
                                className="w-full border rounded p-2 mb-4"
                                placeholder="Nhập lý do mới..."
                                value={editReason}
                                onChange={e => setEditReason(e.target.value)}
                            />
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setShowEditReasonModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleEditReason}
                                    className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                                >
                                    Xác nhận
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReturnedManagement;