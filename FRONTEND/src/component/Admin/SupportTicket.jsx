import React, { useEffect, useState } from 'react';
import TopBar from '../AdminDashboard/TopBar';
import SideBar from '../AdminDashboard/SideBar';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const SupportTicket = () => {
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({
    userId: '',
    subject: '',
    description: '',
    status: 'Pending'
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const handleClick = (e) => {
      const nextEl = e.currentTarget.nextElementSibling;
      if (nextEl && nextEl.classList.contains('sidebar-submenu')) {
        e.preventDefault();
        nextEl.classList.toggle('show');
      }
    };
    sidebarLinks.forEach(link => link.addEventListener('click', handleClick));
    return () => sidebarLinks.forEach(link => link.removeEventListener('click', handleClick));
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axios.get('http://localhost:8082/PureFoods/api/support-tickets/all');
      if (response.data.status === 200) {
        setTickets(response.data.tickets || []);
      } else {
        toast.error(response.data.message || 'Failed to fetch tickets');
      }
    } catch (error) {
      toast.error('Network error or server issue');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.userId || !form.subject || !form.description) {
      toast.error('Please fill in all required fields (User ID, Subject, Description)');
      return;
    }
    if (isNaN(parseInt(form.userId)) || parseInt(form.userId) <= 0) {
      toast.error('User ID must be a positive number');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8082/PureFoods/api/support-tickets/create', {
        userId: parseInt(form.userId),
        subject: form.subject,
        description: form.description
        // Priority omitted, defaults to Medium in backend
      });
      if (response.data.status === 200) {
        toast.success(response.data.message || 'Ticket created successfully');
        setForm({ userId: '', subject: '', description: '', status: 'Pending' });
        fetchTickets();
      } else {
        toast.error(response.data.message || 'Failed to create ticket');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create ticket due to server error';
      toast.error(errorMessage);
    }
  };

  const handleUpdateStatus = async (ticketId, checked) => {
    try {
      const ticket = tickets.find(t => t.ticketId === ticketId);
      if (!ticket) {
        toast.error('Ticket not found');
        return;
      }
      const newStatus = checked ? 'Pending' : 'Closed';
      const response = await axios.put('http://localhost:8082/PureFoods/api/support-tickets/update', {
        ticketId: ticket.ticketId,
        userId: ticket.userId,
        subject: ticket.subject,
        description: ticket.description,
        status: newStatus,
        priority: ticket.priority // Keep existing priority
      });
      if (response.data.status === 200) {
        toast.success(response.data.message || 'Ticket status updated');
        fetchTickets();
      } else {
        toast.error(response.data.message || 'Failed to update ticket');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update ticket due to server error';
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (ticketId) => {
    try {
      const response = await axios.delete(`http://localhost:8082/PureFoods/api/support-tickets/delete/${ticketId}`);
      if (response.data.status === 200) {
        toast.success(response.data.message || 'Ticket deleted successfully');
        fetchTickets();
      } else {
        toast.error(response.data.message || 'Failed to delete ticket');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete ticket due to server error';
      toast.error(errorMessage);
    }
  };

  return (
    <div>
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
                  <div className="row">
                    <div className="col-sm-8 m-auto">
                      <div className="card">
                        <div className="card-body">
                          <div className="title-header option-title">
                            <h5>Create Support Ticket</h5>
                          </div>
                          <form className="theme-form theme-form-2 mega-form" onSubmit={handleSubmit}>
                            <div className="mb-4 row align-items-center">
                              <label className="col-lg-2 col-md-3 mb-0">User ID</label>
                              <div className="col-md-9 col-lg-10">
                                <input
                                  className="form-control"
                                  name="userId"
                                  value={form.userId}
                                  onChange={handleChange}
                                  type="number"
                                  min="1"
                                  required
                                />
                              </div>
                            </div>
                            <div className="mb-4 row align-items-center">
                              <label className="col-lg-2 col-md-3">Subject</label>
                              <div className="col-md-9 col-lg-10">
                                <input
                                  className="form-control"
                                  name="subject"
                                  value={form.subject}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                            </div>
                            <div className="mb-4 row align-items-center">
                              <label className="col-lg-2 col-md-3">Description</label>
                              <div className="col-md-9 col-lg-10">
                                <textarea
                                  className="form-control"
                                  name="description"
                                  value={form.description}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                            </div>
                            <div className="mb-4 row align-items-center">
                              <label className="col-lg-2 col-md-3">Status</label>
                              <div className="col-md-9 col-lg-10 d-flex align-items-center">
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    name="status"
                                    checked={form.status === 'Pending'}
                                    onChange={(e) =>
                                      setForm({
                                        ...form,
                                        status: e.target.checked ? 'Pending' : 'Closed'
                                      })
                                    }
                                  />
                                  <span className="switch-state"></span>
                                </label>
                              </div>
                            </div>
                            <div className="card-submit-button">
                              <button className="btn btn-animation ms-auto" type="submit">
                                Submit
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-body">
                      <div className="title-header option-title">
                        <h5>Support Tickets</h5>
                      </div>
                      <div className="table-responsive mt-4">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Ticket Number</th>
                              <th>Date</th>
                              <th>Subject</th>
                              <th>Status</th>
                              <th>Options</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tickets.map((ticket) => (
                              <tr key={ticket.ticketId}>
                                <td>#{ticket.ticketId}</td>
                                <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                                <td>{ticket.subject}</td>
                                <td>
                                  <label className="switch">
                                    <input
                                      type="checkbox"
                                      checked={ticket.status !== 'Closed'}
                                      onChange={(e) => handleUpdateStatus(ticket.ticketId, e.target.checked)}
                                    />
                                    <span className="switch-state"></span>
                                  </label>
                                </td>
                                <td>
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(ticket.ticketId)}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
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
                    <p className="mb-0">Copyright 2025 © Clean Food Shop theme by pixelstrap</p>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <h5 className="modal-title" id="staticBackdropLabel">Logging Out</h5>
              <p>Are you sure you want to log out?</p>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              <div className="button-box">
                <button type="button" className="btn btn--no" data-bs-dismiss="modal">No</button>
                <button type="button" onClick={() => navigate('/login')} className="btn btn--yes btn-primary">Yes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportTicket;