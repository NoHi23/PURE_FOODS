import React, { useEffect, useState } from 'react';
import TopBar from '../AdminDashboard/TopBar';
import SideBar from '../AdminDashboard/SideBar';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import './ProfileSetting.css';

const ProfileSetting = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editForm, setEditForm] = useState({
    userId: 0,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirm: '',
    photo: null,
  });
  const nav = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8082/PureFoods/api/users/getAll')
      .then(res => {
        const userList = res.data.userList.map(user => {
          const nameParts = user.fullName ? user.fullName.split(' ') : ['', ''];
          return { ...user, firstName: nameParts[0] || '', lastName: nameParts.slice(1).join(' ') || '' };
        });
        setUsers(userList);
        if (userList.length > 0) setSelectedUserId(userList[0].userId);
      })
      .catch(() => toast.error('Failed to fetch user data'));
  }, []);

  const handleSelectUser = (userId) => {
    setSelectedUserId(userId);
    const user = users.find(u => u.userId === userId);
    if (user) {
      setEditForm({
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        password: '',
        confirm: '',
        photo: null,
      });
    }
  };

  const handleEdit = () => {
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.firstName || !editForm.lastName || !editForm.email) {
      toast.error('Please fill in name and email');
      return;
    }
    if (editForm.password && editForm.password !== editForm.confirm) {
      toast.error('Confirm password does not match');
      return;
    }

    try {
      const updateData = {
        userId: editForm.userId,
        fullName: `${editForm.firstName} ${editForm.lastName}`,
        email: editForm.email,
        phone: editForm.phone,
        address: editForm.address,
        password: editForm.password || undefined,
      };
      const res = await axios.put('http://localhost:8082/PureFoods/api/users/profile/update', updateData);
      if (res.data.status === 200) {
        toast.success(res.data.message);
        setShowModal(false);
        setUsers(users.map(u => u.userId === editForm.userId ? { ...u, ...updateData, firstName: editForm.firstName, lastName: editForm.lastName } : u));
        handleSelectUser(editForm.userId);
      } else {
        toast.warning(res.data.message);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'ERROR';
      toast.error(errorMessage);
    }
  };

  const selectedUser = users.find(u => u.userId === selectedUserId);

  return (
    <div className="wrapper">
      <div className="tap-top">
        <span className="lnr lnr-chevron-up"></span>
      </div>

      <div className="page-wrapper compact-wrapper" id="pageWrapper">
        <TopBar />
        <div className="page-body-wrapper">
          <SideBar />
          <div className="page-body">
            <div className="container-fluid">
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-body">
                      <div className="title-header option-title">
                        <h5>Select User</h5>
                      </div>
                      <div className="mb-4">
                        <select
                          className="form-select"
                          value={selectedUserId || ''}
                          onChange={(e) => handleSelectUser(parseInt(e.target.value))}
                        >
                          <option value="">Select a user</option>
                          {users.map(user => (
                            <option key={user.userId} value={user.userId}>
                              {`${user.firstName} ${user.lastName}`}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {selectedUser && (
                    <div className="card">
                      <div className="card-body">
                        <div className="title-header option-title">
                          <h5>Profile Setting for {`${selectedUser.firstName} ${selectedUser.lastName}`}</h5>
                        </div>
                        <div className="d-flex justify-content-end">
                          <Button variant="primary" onClick={handleEdit}>
                            Edit Profile
                          </Button>
                        </div>
                        <div className="mt-3">
                          <p><strong>Email:</strong> {selectedUser.email}</p>
                          <p><strong>Phone:</strong> {selectedUser.phone}</p>
                          <p><strong>Address:</strong> {selectedUser.address}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="card">
                    <div className="card-body">
                      <div className="title-header option-title">
                        <h5>Address</h5>
                      </div>
                      <div className="row g-3">
                        <div className="col-md-4">
                          <div className="address-box">
                            <div className="address">
                              <h6>{`${selectedUser?.firstName} ${selectedUser?.lastName}`}</h6>
                              <p>Home</p>
                              <p>{selectedUser?.address || '549 Sulphur Springs Road Downers Grove, IL 60515'}</p>
                              <p>Mobile No. {selectedUser?.phone || '+1-123-456-7890'}</p>
                              <a href="#" className="edit-link">Edit</a>
                              <a href="#" className="remove-link">Remove</a>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="address-box">
                            <div className="address">
                              <h6>Method Zaki</h6>
                              <p>Office</p>
                              <p>549 Sulphur Springs Road Downers Grove, IL 60515</p>
                              <p>Mobile No. +1-123-456-7890</p>
                              <a href="#" className="edit-link">Edit</a>
                              <a href="#" className="remove-link">Remove</a>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="address-box">
                            <div className="address">
                              <h6>{`${selectedUser?.firstName} ${selectedUser?.lastName}`}</h6>
                              <p>Home</p>
                              <p>549 Sulphur Springs Road Downers Grove, IL 60515</p>
                              <p>Mobile No. +1-123-456-7890</p>
                              <a href="#" className="edit-link">Edit</a>
                              <a href="#" className="remove-link">Remove</a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="container-fluid">
              <footer className="footer">
                <div className="row">
                  <div className="col-md-12 footer-copyright text-center">
                    <p className="mb-0">Copyright 2022 © Fastkart theme by pixelstrap</p>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="mb-3 row align-items-center">
              <label className="col-sm-3">First Name</label>
              <div className="col-sm-9">
                <input
                  className="form-control"
                  name="firstName"
                  value={editForm.firstName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mb-3 row align-items-center">
              <label className="col-sm-3">Last Name</label>
              <div className="col-sm-9">
                <input
                  className="form-control"
                  name="lastName"
                  value={editForm.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mb-3 row align-items-center">
              <label className="col-sm-3">Email Address</label>
              <div className="col-sm-9">
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={editForm.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mb-3 row align-items-center">
              <label className="col-sm-3">Phone Number</label>
              <div className="col-sm-9">
                <input
                  className="form-control"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mb-3 row align-items-center">
              <label className="col-sm-3">Address</label>
              <div className="col-sm-9">
                <input
                  className="form-control"
                  name="address"
                  value={editForm.address}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mb-3 row align-items-center">
              <label className="col-sm-3">Photo</label>
              <div className="col-sm-9">
                <input
                  type="file"
                  className="form-control"
                  name="photo"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mb-3 row align-items-center">
              <label className="col-sm-3">Password</label>
              <div className="col-sm-9">
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={editForm.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                />
              </div>
            </div>
            <div className="mb-3 row align-items-center">
              <label className="col-sm-3">Confirm Password</label>
              <div className="col-sm-9">
                <input
                  type="password"
                  className={`form-control ${editForm.confirm ? editForm.confirm === editForm.password ? 'is-valid' : 'is-invalid' : ''}`}
                  name="confirm"
                  value={editForm.confirm}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                />
                {editForm.confirm && editForm.confirm !== editForm.password && (
                  <p className="text-danger mt-1">Confirm password does not match</p>
                )}
                {editForm.confirm && editForm.confirm === editForm.password && (
                  <p className="text-success mt-1">Passwords match</p>
                )}
              </div>
            </div>
            <Button variant="primary" type="submit">Save Changes</Button>
          </form>
        </Modal.Body>
      </Modal>

      <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <h5 className="modal-title" id="staticBackdropLabel">Logging Out</h5>
              <p>Are you sure you want to log out?</p>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              <div className="button-box">
                <button type="button" className="btn btn--no" data-bs-dismiss="modal">No</button>
                <button type="button" onClick={() => nav('/login')} className="btn btn--yes btn-primary">Yes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetting;