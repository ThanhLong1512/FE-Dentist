import React, { useState, useEffect } from "react";
import axios from "axios";

function AccountAdmin() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    isLocked: false
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8080/api/v1/accounts",
        { withCredentials: true }
      );
      setAccounts(response.data);
      localStorage.setItem("accounts", JSON.stringify(response.data));
      setLoading(false);
    } catch (err) {
      const cachedData = localStorage.getItem("accounts");
      if (cachedData) {
        setAccounts(JSON.parse(cachedData));
        setError("Using cached data. Network request failed.");
      } else {
        setError("Failed to fetch accounts data");
      }
      setLoading(false);
      console.error("Error fetching accounts:", err);
    }
  };

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    const fieldName = id.replace("add", "");
    const camelCaseField = fieldName.charAt(0).toLowerCase() + fieldName.slice(1);
    
    setFormData(prevData => ({
      ...prevData,
      [camelCaseField]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEditClick = (account) => {
    console.log("Editing account:", account);
    setEditingId(account._id);
    setFormData({
      name: account.name || "",
      email: account.email || "",
      role: account.role || "",
      password: account.password || "",
      isLocked: account.isLocked || false
    });

    const modal = document.getElementById("accountModal");
    if (modal) {
      const modalInstance = new bootstrap.Modal(modal);
      modalInstance.show();
    } else {
      console.error("Modal not found");
    }
  };

  const handleUpdateAccount = async () => {
    try {
      if (!editingId) {
        console.error("No editingId found");
        return;
      }
      console.log("Updating account with data:", formData);
      setLoading(true);
      const response = await axios.put(
        `http://localhost:8080/api/v1/accounts/${editingId}`,
        formData,
        { withCredentials: true }
      );

      if (response.data) {
        console.log("Update response:", response.data);
        const updatedAccounts = accounts.map((acc) =>
          acc._id === editingId ? response.data : acc
        );
        setAccounts(updatedAccounts);
        localStorage.setItem("accounts", JSON.stringify(updatedAccounts));

        setFormData({
          name: "",
          email: "",
          role: "",
          password: "",
          isLocked: false
        });
        setEditingId(null);

        const closeBtn = document.getElementById("closeModalBtn");
        if (closeBtn) {
          closeBtn.click();
        }
      }
    } catch (err) {
      console.error("Error updating account:", err);
      setError(`Failed to update account: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (isLocked) => {
    return isLocked ? (
      <span className="badge badge-danger">Inactive</span>
    ) : (
      <span className="badge badge-success">Active</span>
    );
  };

  return (
    <div>
      <div className="page-header">
        <h3 className="fw-bold mb-3">Accounts</h3>
        <ul className="breadcrumbs mb-3">
          <li className="nav-home">
            <a href="#">
              <i className="icon-user"></i>
            </a>
          </li>
          <li className="separator">
            <i className="icon-arrow-right"></i>
          </li>
          <li className="nav-item">
            <a href="#">Accounts</a>
          </li>
          <li className="separator">
            <i className="icon-arrow-right"></i>
          </li>
          <li className="nav-item">
            <a href="#">Datatables</a>
          </li>
        </ul>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <div className="d-flex align-items-center">
                <h4 className="card-title">Manage Accounts</h4>
              </div>
            </div>
            <div className="card-body">
              <div
                className="modal fade"
                id="accountModal"
                tabIndex="-1"
                role="dialog"
                aria-hidden="true"
              >
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header border-0">
                      <h5 className="modal-title">
                        <span className="fw-mediumbold">
                          {editingId ? "Edit" : "New"}
                        </span>
                        <span className="fw-light"> Account</span>
                      </h5>
                      <button
                        type="button"
                        className="close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <form>
                        <div className="row">
                          <div className="col-sm-12">
                            <div className="form-group form-group-default">
                              <label>Name</label>
                              <input
                                id="addName"
                                type="text"
                                className="form-control"
                                placeholder="Enter full name"
                                value={formData.name}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-md-6 pe-0">
                            <div className="form-group form-group-default">
                              <label>Email</label>
                              <input
                                id="addEmail"
                                type="email"
                                className="form-control"
                                placeholder="Enter email"
                                value={formData.email}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group form-group-default">
                              <label>Role</label>
                              <select
                                className="form-control"
                                value={formData.role}
                                onChange={handleInputChange}
                                id="addRole"
                              >
                                <option value="">-- Select Role --</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-sm-12">
                            <div className="form-group form-group-default">
                              <label>Password</label>
                              <input
                                id="addpassword"
                                type="password"
                                className="form-control"
                                placeholder="Enter password"
                                value={formData.password}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-sm-12">
                            <div className="form-check">
                              <label className="form-check-label">
                                <input
                                  id="addIsLocked"
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={formData.isLocked}
                                  onChange={handleInputChange}
                                />
                                <span className="form-check-sign">Khóa tài khoản</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                    <div className="modal-footer border-0">
                      <button
                        type="button"
                        onClick={handleUpdateAccount}
                        className="btn btn-primary"
                      >
                        Update
                      </button>
                      <button
                        id="closeModalBtn"
                        type="button"
                        className="btn btn-danger"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="table-responsive">
                {loading ? (
                  <div className="text-center p-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <table
                    id="add-row"
                    className="display table table-striped table-hover"
                  >
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th style={{ width: "15%" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accounts.map((account) => (
                        <tr key={account._id}>
                          <td>{account.name}</td>
                          <td>{account.email}</td>
                          <td>{account.role}</td>
                          <td>{getStatusBadge(account.isLocked)}</td>
                          <td>
                            <div className="form-button-action">
                              <button
                                type="button"
                                data-bs-toggle="tooltip"
                                title="Edit"
                                className="btn btn-link btn-primary btn-lg"
                                onClick={() => handleEditClick(account)}
                              >
                                <i className="fa fa-edit"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountAdmin; 