import React, { useState, useEffect } from "react";
import axios from "axios";

function TableAdmin() {
  // State variables for employees, services, loading, error, and form data
  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    gender: false,
    experience: "",
    description: "",
    photo: "",
    service: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchEmployees();
    fetchServices();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8080/api/v1/employees",
        { withCredentials: true }
      );
      setEmployees(response.data);
      // Lưu vào localStorage để có thể sử dụng khi offline hoặc làm cache
      localStorage.setItem("employees", JSON.stringify(response.data));
      setLoading(false);
    } catch (err) {
      // Thử lấy data từ localStorage nếu API fail
      const cachedData = localStorage.getItem("employees");
      if (cachedData) {
        setEmployees(JSON.parse(cachedData));
        setError("Using cached data. Network request failed.");
      } else {
        setError("Failed to fetch employees data");
      }
      setLoading(false);
      console.error("Error fetching employees:", err);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/services",
        { withCredentials: true }
      );
      setServices(response.data);
      // Lưu vào localStorage để có thể sử dụng khi offline
      localStorage.setItem("services", JSON.stringify(response.data));
    } catch (err) {
      // Thử lấy data từ localStorage nếu API fail
      const cachedServices = localStorage.getItem("services");
      if (cachedServices) {
        setServices(JSON.parse(cachedServices));
        setError((prevError) =>
          prevError
            ? `${prevError}. Using cached services data.`
            : "Using cached services data."
        );
      } else {
        setError((prevError) =>
          prevError
            ? `${prevError}. Failed to fetch services data.`
            : "Failed to fetch services data."
        );
      }
      console.error("Error fetching services:", err);
    }
  };
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const fieldName = id.replace("add", "");
    const camelCaseField = fieldName.charAt(0).toLowerCase() + fieldName.slice(1);
    
    setFormData(prevData => ({
      ...prevData,
      [camelCaseField]: value,
    }));
  };

  const handleServiceChange = (e) => {
    setFormData(prevData => ({
      ...prevData,
      service: e.target.value,
    }));
  };

  const handleGenderChange = (e) => {
    setFormData(prevData => ({
      ...prevData,
      gender: e.target.value === "true",
    }));
  };

  const formatGender = (gender) => {
    return gender === false ? "Nam" : "Nữ";
  };

  // Add new employee
  const handleAddEmployee = async () => {
    try {
      console.log("Form data before sending:", formData);
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8080/api/v1/employees",
        formData,
        { withCredentials: true }
      );

      setEmployees([...employees, response.data]);

      localStorage.setItem(
        "employees",
        JSON.stringify([...employees, response.data])
      );

      // Reset form
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        gender: false,
        experience: "",
        description: "",
        service: "",
      });

      document.getElementById("closeModalBtn").click();

      setLoading(false);
    } catch (err) {
      setError("Failed to add employee");
      setLoading(false);
      console.error("Error adding employee:", err);
    }
  };

  // Delete employee
  const handleDeleteEmployee = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`http://localhost:8080/api/v1/employees/${id}`);

        // Update local state without reloading
        const updatedEmployees = employees.filter((emp) => emp._id !== id);
        setEmployees(updatedEmployees);

        // Update localStorage
        localStorage.setItem("employees", JSON.stringify(updatedEmployees));
      } catch (err) {
        setError("Failed to delete employee");
        console.error("Error deleting employee:", err);
      }
    }
  };

  const handleEditClick = (employee) => {
    setEditingId(employee._id);

    // Set form data with all required fields
    setFormData({
      name: employee.name || "",
      email: employee.email || "",
      phoneNumber: employee.phoneNumber || "",
      gender: employee.gender || false,
      experience: employee.experience || "",
      description: employee.description || "",
      service: employee.service?._id || "",
      photo: employee.photo || ""
    });

    // Open modal programmatically
    const modal = document.getElementById("employeeModal");
    if (modal) {
      const modalInstance = new bootstrap.Modal(modal);
      modalInstance.show();
    } else {
      console.error("Modal not found");
    }
  };

  // Update employee
  const handleUpdateEmployee = async () => {
    try {
      console.log("Current editingId in update:", editingId);
      if (!editingId) {
        console.error("No editingId found");
        return;
      }
      setLoading(true);
      const response = await axios.put(
        `http://localhost:8080/api/v1/employees/${editingId}`,
        formData,
        { withCredentials: true }
      );

      if (response.data) {
        // Update local state without reloading
        const updatedEmployees = employees.map((emp) =>
          emp._id === editingId ? response.data : emp
        );
        setEmployees(updatedEmployees);

        // Update localStorage
        localStorage.setItem("employees", JSON.stringify(updatedEmployees));

        // Reset form and editing state
        setFormData({
          name: "",
          email: "",
          phoneNumber: "",
          gender: false,
          experience: "",
          description: "",
          service: "",
          photo: ""
        });
        setEditingId(null);

        // Close modal programmatically
        const closeBtn = document.getElementById("closeModalBtn");
        if (closeBtn) {
          closeBtn.click();
        } else {
          console.error("Close button not found");
        }
      }
    } catch (err) {
      console.error("Error updating employee:", err);
      setError(`Failed to update employee: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h3 className="fw-bold mb-3">Employees</h3>
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
            <a href="#">Employees</a>
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
                <h4 className="card-title">Manage Employees</h4>
                <button
                  id="openModalBtn"
                  className="btn btn-primary btn-round ms-auto"
                  data-bs-toggle="modal"
                  data-bs-target="#employeeModal"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      name: "",
                      email: "",
                      phoneNumber: "",
                      gender: false,
                      experience: "",
                      description: "",
                      service: "",
                    });
                  }}
                >
                  <i className="fa fa-plus me-2"></i>
                  Add Employee
                </button>
              </div>
            </div>
            <div className="card-body">
              <div
                className="modal fade"
                id="employeeModal"
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
                        <span className="fw-light"> Employee</span>
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
                              <label>Phone</label>
                              <input
                                id="addPhoneNumber"
                                type="text"
                                className="form-control"
                                placeholder="Enter phone number"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group form-group-default">
                              <label>Gender</label>
                              <select
                                className="form-control"
                                value={formData.gender.toString()}
                                onChange={handleGenderChange}
                              >
                                <option value="false">Nam</option>
                                <option value="true">Nữ</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group form-group-default">
                              <label>Experience</label>
                              <input
                                id="addExperience"
                                type="text"
                                className="form-control"
                                placeholder="Years of experience"
                                value={formData.experience}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="form-group form-group-default">
                              <label>Service</label>
                              <select
                                className="form-control"
                                value={formData.service}
                                onChange={handleServiceChange}
                              >
                                <option value="">-- Select Service --</option>
                                {services.map((service) => (
                                  <option key={service._id} value={service._id}>
                                    {service.nameService}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="col-sm-12">
                            <div className="form-group form-group-default">
                              <label>Description</label>
                              <textarea
                                id="addDescription"
                                className="form-control"
                                placeholder="Enter description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="3"
                              ></textarea>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                    <div className="modal-footer border-0">
                      <button
                        type="button"
                        onClick={
                          editingId ? handleUpdateEmployee : handleAddEmployee
                        }
                        className="btn btn-primary"
                      >
                        {editingId ? "Update" : "Add"}
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
                        <th>Phone Number</th>
                        <th>Gender</th>
                        <th>Service</th>
                        <th style={{ width: "15%" }}>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {employees.map((employee) => (
                        <tr key={employee._id}>
                          <td>{employee.name}</td>
                          <td>{employee.email}</td>
                          <td>{employee.phoneNumber}</td>
                          <td>{formatGender(employee.gender)}</td>
                          <td>{employee.service?.nameService || "N/A"}</td>
                          <td>
                            <div className="form-button-action">
                              <button
                                type="button"
                                data-bs-toggle="tooltip"
                                title="Edit"
                                className="btn btn-link btn-primary btn-lg"
                                onClick={() => handleEditClick(employee)}
                              >
                                <i className="fa fa-edit"></i>
                              </button>
                              <button
                                type="button"
                                data-bs-toggle="tooltip"
                                title="Delete"
                                className="btn btn-link btn-danger"
                                onClick={() =>
                                  handleDeleteEmployee(employee._id)
                                }
                              >
                                <i className="fa fa-times"></i>
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

export default TableAdmin;
