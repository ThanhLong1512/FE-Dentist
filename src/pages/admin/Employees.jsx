function TableAdmin() {
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
                <h4 className="card-title">Add Employee</h4>
                <button
                  className="btn btn-primary btn-round ms-auto"
                  data-bs-toggle="modal"
                  data-bs-target="#addRowModal"
                >
                  <i className="fa fa-plus me-2"></i>
                  Add Employee
                </button>
              </div>
            </div>
            <div className="card-body">
              <div
                className="modal fade"
                id="addRowModal"
                tabindex="-1"
                role="dialog"
                aria-hidden="true"
              >
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header border-0">
                      <h5 className="modal-title">
                        <span className="fw-mediumbold"> New</span>
                        <span className="fw-light"> Row </span>
                      </h5>
                      <button
                        type="button"
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <p className="small">
                        Create a new row using this form, make sure you fill
                        them all
                      </p>
                      <form>
                        <div className="row">
                          <div className="col-sm-12">
                            <div className="form-group form-group-default">
                              <label>Name</label>
                              <input
                                id="addName"
                                type="text"
                                className="form-control"
                                placeholder="fill name"
                              />
                            </div>
                          </div>
                          <div className="col-md-6 pe-0">
                            <div className="form-group form-group-default">
                              <label>Position</label>
                              <input
                                id="addPosition"
                                type="text"
                                className="form-control"
                                placeholder="fill position"
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group form-group-default">
                              <label>Office</label>
                              <input
                                id="addOffice"
                                type="text"
                                className="form-control"
                                placeholder="fill office"
                              />
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                    <div className="modal-footer border-0">
                      <button
                        type="button"
                        id="addRowButton"
                        className="btn btn-primary"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        data-dismiss="modal"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="table-responsive">
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
                      <th style={{ width: "10%" }}>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>Tiger Nixon</td>
                      <td>System Architect</td>
                      <td>Edinburgh</td>
                      <td>
                        <div className="form-button-action">
                          <button
                            type="button"
                            data-bs-toggle="tooltip"
                            title=""
                            className="btn btn-link btn-primary btn-lg"
                            data-original-title="Edit Task"
                          >
                            <i className="fa fa-edit"></i>
                          </button>
                          <button
                            type="button"
                            data-bs-toggle="tooltip"
                            title=""
                            className="btn btn-link btn-danger"
                            data-original-title="Remove"
                          >
                            <i className="fa fa-times"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Garrett Winters</td>
                      <td>Accountant</td>
                      <td>Tokyo</td>
                      <td>
                        <div className="form-button-action">
                          <button
                            type="button"
                            data-bs-toggle="tooltip"
                            title=""
                            className="btn btn-link btn-primary btn-lg"
                            data-original-title="Edit Task"
                          >
                            <i className="fa fa-edit"></i>
                          </button>
                          <button
                            type="button"
                            data-bs-toggle="tooltip"
                            title=""
                            className="btn btn-link btn-danger"
                            data-original-title="Remove"
                          >
                            <i className="fa fa-times"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Ashton Cox</td>
                      <td>Junior Technical Author</td>
                      <td>San Francisco</td>
                      <td>San Francisco</td>
                      <td>San Francisco</td>
                      <td>
                        <div className="form-button-action">
                          <button
                            type="button"
                            data-bs-toggle="tooltip"
                            title=""
                            className="btn btn-link btn-primary btn-lg"
                            data-original-title="Edit Task"
                          >
                            <i className="fa fa-edit"></i>
                          </button>
                          <button
                            type="button"
                            data-bs-toggle="tooltip"
                            title=""
                            className="btn btn-link btn-danger"
                            data-original-title="Remove"
                          >
                            <i className="fa fa-times"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Cedric Kelly</td>
                      <td>Senior Javascript Developer</td>
                      <td>Edinburgh</td>
                      <td>Edinburgh</td>
                      <td>
                        <div className="form-button-action">
                          <button
                            type="button"
                            data-bs-toggle="tooltip"
                            title=""
                            className="btn btn-link btn-primary btn-lg"
                            data-original-title="Edit Task"
                          >
                            <i className="fa fa-edit"></i>
                          </button>
                          <button
                            type="button"
                            data-bs-toggle="tooltip"
                            title=""
                            className="btn btn-link btn-danger"
                            data-original-title="Remove"
                          >
                            <i className="fa fa-times"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Airi Satou</td>
                      <td>Accountant</td>
                      <td>Tokyo</td>
                      <td>
                        <div className="form-button-action">
                          <button
                            type="button"
                            data-bs-toggle="tooltip"
                            title=""
                            className="btn btn-link btn-primary btn-lg"
                            data-original-title="Edit Task"
                          >
                            <i className="fa fa-edit"></i>
                          </button>
                          <button
                            type="button"
                            data-bs-toggle="tooltip"
                            title=""
                            className="btn btn-link btn-danger"
                            data-original-title="Remove"
                          >
                            <i className="fa fa-times"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Brielle Williamson</td>
                      <td>Integration Specialist</td>
                      <td>New York</td>
                      <td>
                        <div className="form-button-action">
                          <button
                            type="button"
                            data-bs-toggle="tooltip"
                            title=""
                            className="btn btn-link btn-primary btn-lg"
                            data-original-title="Edit Task"
                          >
                            <i className="fa fa-edit"></i>
                          </button>
                          <button
                            type="button"
                            data-bs-toggle="tooltip"
                            title=""
                            className="btn btn-link btn-danger"
                            data-original-title="Remove"
                          >
                            <i className="fa fa-times"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Herrod Chandler</td>
                      <td>Sales Assistant</td>
                      <td>San Francisco</td>
                      <td>
                        <div className="form-button-action">
                          <button
                            type="button"
                            data-bs-toggle="tooltip"
                            title=""
                            className="btn btn-link btn-primary btn-lg"
                            data-original-title="Edit Task"
                          >
                            <i className="fa fa-edit"></i>
                          </button>
                          <button
                            type="button"
                            data-bs-toggle="tooltip"
                            title=""
                            className="btn btn-link btn-danger"
                            data-original-title="Remove"
                          >
                            <i className="fa fa-times"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Rhona Davidson</td>
                      <td>Integration Specialist</td>
                      <td>Tokyo</td>
                      <td>
                        <div className="form-button-action">
                          <button
                            type="button"
                            data-bs-toggle="tooltip"
                            title=""
                            className="btn btn-link btn-primary btn-lg"
                            data-original-title="Edit Task"
                          >
                            <i className="fa fa-edit"></i>
                          </button>
                          <button
                            type="button"
                            data-bs-toggle="tooltip"
                            title=""
                            className="btn btn-link btn-danger"
                            data-original-title="Remove"
                          >
                            <i className="fa fa-times"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Colleen Hurst</td>
                      <td>Javascript Developer</td>
                      <td>San Francisco</td>
                      <td>
                        <div className="form-button-action">
                          <button
                            type="button"
                            data-bs-toggle="tooltip"
                            title=""
                            className="btn btn-link btn-primary btn-lg"
                            data-original-title="Edit Task"
                          >
                            <i className="fa fa-edit"></i>
                          </button>
                          <button
                            type="button"
                            data-bs-toggle="tooltip"
                            title=""
                            className="btn btn-link btn-danger"
                            data-original-title="Remove"
                          >
                            <i className="fa fa-times"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Sonya Frost</td>
                      <td>Software Engineer</td>
                      <td>Edinburgh</td>
                      <td>
                        <div className="form-button-action">
                          <button
                            type="button"
                            data-bs-toggle="tooltip"
                            title=""
                            className="btn btn-link btn-primary btn-lg"
                            data-original-title="Edit Task"
                          >
                            <i className="fa fa-edit"></i>
                          </button>
                          <button
                            type="button"
                            data-bs-toggle="tooltip"
                            title=""
                            className="btn btn-link btn-danger"
                            data-original-title="Remove"
                          >
                            <i className="fa fa-times"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TableAdmin;
