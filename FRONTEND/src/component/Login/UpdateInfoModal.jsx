import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import { toast } from "react-toastify";
import './UpdateInfoModal.css';

const UpdateInfoModal = ({ isOpen, onClose, user, onSuccess }) => {
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = {
        ...user,
        phone,
        address,
      };
      const res = await axios.put("http://localhost:8082/PureFoods/api/users/update", updatedUser, {
        withCredentials: true,
      });
      toast.success("Information added successfully. You can continue now...");
      localStorage.setItem("user", JSON.stringify(res.data.user));
      onSuccess(res.data.user);
      onClose();
    } catch (err) {
      toast.error("Update failed!");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => { }}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
      contentLabel="Update required information"
      style={{
        content: {
          maxWidth: "360px",
          margin: "auto",
          maxHeight: "50vh",
          overflowY: "auto",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 0 10px rgba(0,0,0,0.2)",
          zIndex: 10002,
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          zIndex: 10001,
        },
      }}
    >
      <h3 className="text-center">Additional Information</h3>
      <h4 className="modal-title mb-3 text-center">Update Account Information</h4>
      <form onSubmit={handleSubmit} className="form-update-info">
        <div className="form-group mb-3">
          <label>Phone Number</label>
          <input
            type="text"
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="form-group mb-4">
          <label>Address</label>
          <input
            type="text"
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-success w-100">Update</button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateInfoModal;
