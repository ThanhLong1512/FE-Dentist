function FormsAdmin() {
  return (
    <div>
      <div className="page-header">
        <h3 className="fw-bold mb-3">Forms</h3>
        <ul className="breadcrumbs mb-3">
          <li className="nav-home">
            <a href="#">
              <i className="icon-home"></i>
            </a>
          </li>
          <li className="separator">
            <i className="icon-arrow-right"></i>
          </li>
          <li className="nav-item">
            <a href="#">Forms</a>
          </li>
          <li className="separator">
            <i className="icon-arrow-right"></i>
          </li>
          <li className="nav-item">
            <a href="#">Basic Form</a>
          </li>
        </ul>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Form Elements</div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 col-lg-4">
                  <div className="form-group">
                    <label for="email2">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email2"
                      placeholder="Enter Email"
                    />
                    <small id="emailHelp2" className="form-text text-muted">
                      We'll never share your email with anyone else.
                    </small>
                  </div>
                  <div className="form-group">
                    <label for="password">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Password"
                    />
                  </div>
                  <div className="form-group form-inline">
                    <label
                      for="inlineinput"
                      className="col-md-3 col-form-label"
                    >
                      Inline Input
                    </label>
                    <div className="col-md-9 p-0">
                      <input
                        type="text"
                        className="form-control input-full"
                        id="inlineinput"
                        placeholder="Enter Input"
                      />
                    </div>
                  </div>
                  <div className="form-group has-success">
                    <label for="successInput">Success Input</label>
                    <input
                      type="text"
                      id="successInput"
                      defaultValue="Success"
                      className="form-control"
                    />
                  </div>
                  <div className="form-group has-error has-feedback">
                    <label for="errorInput">Error Input</label>
                    <input
                      type="text"
                      id="errorInput"
                      defaultValue="Error"
                      className="form-control"
                    />
                    <small id="emailHelp" className="form-text text-muted">
                      Please provide a valid informations.
                    </small>
                  </div>
                  <div className="form-group">
                    <label for="disableinput">Disable Input</label>
                    <input
                      type="text"
                      className="form-control"
                      id="disableinput"
                      placeholder="Enter Input"
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label>Gender</label>
                    <br />
                    <div className="d-flex">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault1"
                        />
                        <label
                          className="form-check-label"
                          for="flexRadioDefault1"
                        >
                          Male
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault2"
                          checked
                        />
                        <label
                          className="form-check-label"
                          for="flexRadioDefault2"
                        >
                          Female
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="control-label"> Static </label>
                    <p className="form-control-static">hello@example.com</p>
                  </div>
                  <div className="form-group">
                    <label for="exampleFormControlSelect1">
                      Example select
                    </label>
                    <select
                      className="form-select"
                      id="exampleFormControlSelect1"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label for="exampleFormControlSelect2">
                      Example multiple select
                    </label>
                    <select
                      multiple
                      className="form-control"
                      id="exampleFormControlSelect2"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label for="exampleFormControlFile1">
                      Example file input
                    </label>
                    <input
                      type="file"
                      className="form-control-file"
                      id="exampleFormControlFile1"
                    />
                  </div>
                  <div className="form-group">
                    <label for="comment">Comment</label>
                    <textarea
                      className="form-control"
                      id="comment"
                      rows="5"
                    ></textarea>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      defaultValue=""
                      id="flexCheckDefault"
                    />
                    <label className="form-check-label" for="flexCheckDefault">
                      Agree with terms and conditions
                    </label>
                  </div>
                </div>
                <div className="col-md-6 col-lg-4">
                  <div className="form-group">
                    <div className="input-group mb-3">
                      <span className="input-group-text" id="basic-addon1">
                        @
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Username"
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Recipient's username"
                        aria-label="Recipient's username"
                        aria-describedby="basic-addon2"
                      />
                      <span className="input-group-text" id="basic-addon2">
                        @example.com
                      </span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label for="basic-url">Your vanity URL</label>
                    <div className="input-group mb-3">
                      <span className="input-group-text" id="basic-addon3">
                        https://example.com/users/
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        id="basic-url"
                        aria-describedby="basic-addon3"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="input-group mb-3">
                      <span className="input-group-text">$</span>
                      <input
                        type="text"
                        className="form-control"
                        aria-label="Amount (to the nearest dollar)"
                      />
                      <span className="input-group-text">.00</span>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="input-group">
                      <span className="input-group-text">With textarea</span>
                      <textarea
                        className="form-control"
                        aria-label="With textarea"
                      ></textarea>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="input-group">
                      <button
                        className="btn btn-black btn-border"
                        type="button"
                      >
                        Button
                      </button>
                      <input
                        type="text"
                        className="form-control"
                        placeholder=""
                        aria-label=""
                        aria-describedby="basic-addon1"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        aria-label="Text input with dropdown button"
                      />
                      <div className="input-group-append">
                        <button
                          className="btn btn-primary btn-border dropdown-toggle"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          Dropdown
                        </button>
                        <div className="dropdown-menu">
                          <a className="dropdown-item" href="#">
                            Action
                          </a>
                          <a className="dropdown-item" href="#">
                            Another action
                          </a>
                          <a className="dropdown-item" href="#">
                            Something else here
                          </a>
                          <div
                            role="separator"
                            className="dropdown-divider"
                          ></div>
                          <a className="dropdown-item" href="#">
                            Separated link
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="input-icon">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search for..."
                      />
                      <span className="input-icon-addon">
                        <i className="fa fa-search"></i>
                      </span>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="input-icon">
                      <span className="input-icon-addon">
                        <i className="fa fa-user"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Username"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Image Check</label>
                    <div className="row">
                      <div className="col-6 col-sm-4">
                        <label className="imagecheck mb-4">
                          <input
                            name="imagecheck"
                            type="checkbox"
                            defaultValue="1"
                            className="imagecheck-input"
                          />
                          <figure className="imagecheck-figure">
                            <img
                              src="../assets/img/examples/product1.jpg"
                              alt="title"
                              className="imagecheck-image"
                            />
                          </figure>
                        </label>
                      </div>
                      <div className="col-6 col-sm-4">
                        <label className="imagecheck mb-4">
                          <input
                            name="imagecheck"
                            type="checkbox"
                            defaultValue="2"
                            className="imagecheck-input"
                            checked=""
                          />
                          <figure className="imagecheck-figure">
                            <img
                              src="../assets/img/examples/product4.jpg"
                              alt="title"
                              className="imagecheck-image"
                            />
                          </figure>
                        </label>
                      </div>
                      <div className="col-6 col-sm-4">
                        <label className="imagecheck mb-4">
                          <input
                            name="imagecheck"
                            type="checkbox"
                            defaultValue="3"
                            className="imagecheck-input"
                          />
                          <figure className="imagecheck-figure">
                            <img
                              src="../assets/img/examples/product3.jpg"
                              alt="title"
                              className="imagecheck-image"
                            />
                          </figure>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Color Input</label>
                    <div className="row gutters-xs">
                      <div className="col-auto">
                        <label className="colorinput">
                          <input
                            name="color"
                            type="checkbox"
                            defaultValue="dark"
                            className="colorinput-input"
                          />
                          <span className="colorinput-color bg-black"></span>
                        </label>
                      </div>
                      <div className="col-auto">
                        <label className="colorinput">
                          <input
                            name="color"
                            type="checkbox"
                            defaultValue="primary"
                            className="colorinput-input"
                          />
                          <span className="colorinput-color bg-primary"></span>
                        </label>
                      </div>
                      <div className="col-auto">
                        <label className="colorinput">
                          <input
                            name="color"
                            type="checkbox"
                            defaultValue="secondary"
                            className="colorinput-input"
                          />
                          <span className="colorinput-color bg-secondary"></span>
                        </label>
                      </div>
                      <div className="col-auto">
                        <label className="colorinput">
                          <input
                            name="color"
                            type="checkbox"
                            defaultValue="info"
                            className="colorinput-input"
                          />
                          <span className="colorinput-color bg-info"></span>
                        </label>
                      </div>
                      <div className="col-auto">
                        <label className="colorinput">
                          <input
                            name="color"
                            type="checkbox"
                            defaultValue="success"
                            className="colorinput-input"
                          />
                          <span className="colorinput-color bg-success"></span>
                        </label>
                      </div>
                      <div className="col-auto">
                        <label className="colorinput">
                          <input
                            name="color"
                            type="checkbox"
                            defaultValue="danger"
                            className="colorinput-input"
                          />
                          <span className="colorinput-color bg-danger"></span>
                        </label>
                      </div>
                      <div className="col-auto">
                        <label className="colorinput">
                          <input
                            name="color"
                            type="checkbox"
                            defaultValue="warning"
                            className="colorinput-input"
                          />
                          <span className="colorinput-color bg-warning"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Size</label>
                    <div className="selectgroup w-100">
                      <label className="selectgroup-item">
                        <input
                          type="radio"
                          name="defaultValue"
                          defaultValue="50"
                          className="selectgroup-input"
                          checked=""
                        />
                        <span className="selectgroup-button">S</span>
                      </label>
                      <label className="selectgroup-item">
                        <input
                          type="radio"
                          name="defaultValue"
                          defaultValue="100"
                          className="selectgroup-input"
                        />
                        <span className="selectgroup-button">M</span>
                      </label>
                      <label className="selectgroup-item">
                        <input
                          type="radio"
                          name="defaultValue"
                          defaultValue="150"
                          className="selectgroup-input"
                        />
                        <span className="selectgroup-button">L</span>
                      </label>
                      <label className="selectgroup-item">
                        <input
                          type="radio"
                          name="defaultValue"
                          defaultValue="200"
                          className="selectgroup-input"
                        />
                        <span className="selectgroup-button">XL</span>
                      </label>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Icons input</label>
                    <div className="selectgroup w-100">
                      <label className="selectgroup-item">
                        <input
                          type="radio"
                          name="transportation"
                          defaultValue="2"
                          className="selectgroup-input"
                        />
                        <span className="selectgroup-button selectgroup-button-icon">
                          <i className="icon-screen-smartphone"></i>
                        </span>
                      </label>
                      <label className="selectgroup-item">
                        <input
                          type="radio"
                          name="transportation"
                          defaultValue="1"
                          className="selectgroup-input"
                          checked=""
                        />
                        <span className="selectgroup-button selectgroup-button-icon">
                          <i className="icon-screen-tablet"></i>
                        </span>
                      </label>
                      <label className="selectgroup-item">
                        <input
                          type="radio"
                          name="transportation"
                          defaultValue="6"
                          className="selectgroup-input"
                        />
                        <span className="selectgroup-button selectgroup-button-icon">
                          <i className="icon-screen-desktop"></i>
                        </span>
                      </label>
                      <label className="selectgroup-item">
                        <input
                          type="radio"
                          name="transportation"
                          defaultValue="6"
                          className="selectgroup-input"
                        />
                        <span className="selectgroup-button selectgroup-button-icon">
                          <i className="fa fa-times"></i>
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label d-block">Icon input</label>
                    <div className="selectgroup selectgroup-secondary selectgroup-pills">
                      <label className="selectgroup-item">
                        <input
                          type="radio"
                          name="icon-input"
                          defaultValue="1"
                          className="selectgroup-input"
                          checked=""
                        />
                        <span className="selectgroup-button selectgroup-button-icon">
                          <i className="fa fa-sun"></i>
                        </span>
                      </label>
                      <label className="selectgroup-item">
                        <input
                          type="radio"
                          name="icon-input"
                          defaultValue="2"
                          className="selectgroup-input"
                        />
                        <span className="selectgroup-button selectgroup-button-icon">
                          <i className="fa fa-moon"></i>
                        </span>
                      </label>
                      <label className="selectgroup-item">
                        <input
                          type="radio"
                          name="icon-input"
                          defaultValue="3"
                          className="selectgroup-input"
                        />
                        <span className="selectgroup-button selectgroup-button-icon">
                          <i className="fa fa-tint"></i>
                        </span>
                      </label>
                      <label className="selectgroup-item">
                        <input
                          type="radio"
                          name="icon-input"
                          defaultValue="4"
                          className="selectgroup-input"
                        />
                        <span className="selectgroup-button selectgroup-button-icon">
                          <i className="fa fa-cloud"></i>
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Your skills</label>
                    <div className="selectgroup selectgroup-pills">
                      <label className="selectgroup-item">
                        <input
                          type="checkbox"
                          name="defaultValue"
                          defaultValue="HTML"
                          className="selectgroup-input"
                          checked=""
                        />
                        <span className="selectgroup-button">HTML</span>
                      </label>
                      <label className="selectgroup-item">
                        <input
                          type="checkbox"
                          name="defaultValue"
                          defaultValue="CSS"
                          className="selectgroup-input"
                        />
                        <span className="selectgroup-button">CSS</span>
                      </label>
                      <label className="selectgroup-item">
                        <input
                          type="checkbox"
                          name="defaultValue"
                          defaultValue="PHP"
                          className="selectgroup-input"
                        />
                        <span className="selectgroup-button">PHP</span>
                      </label>
                      <label className="selectgroup-item">
                        <input
                          type="checkbox"
                          name="defaultValue"
                          defaultValue="JavaScript"
                          className="selectgroup-input"
                        />
                        <span className="selectgroup-button">JavaScript</span>
                      </label>
                      <label className="selectgroup-item">
                        <input
                          type="checkbox"
                          name="defaultValue"
                          defaultValue="Ruby"
                          className="selectgroup-input"
                        />
                        <span className="selectgroup-button">Ruby</span>
                      </label>
                      <label className="selectgroup-item">
                        <input
                          type="checkbox"
                          name="defaultValue"
                          defaultValue="Ruby"
                          className="selectgroup-input"
                        />
                        <span className="selectgroup-button">Ruby</span>
                      </label>
                      <label className="selectgroup-item">
                        <input
                          type="checkbox"
                          name="defaultValue"
                          defaultValue="C++"
                          className="selectgroup-input"
                        />
                        <span className="selectgroup-button">C++</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-4">
                  <label className="mb-3">
                    <b>Form Group Default</b>
                  </label>
                  <div className="form-group form-group-default">
                    <label>Input</label>
                    <input
                      id="Name"
                      type="text"
                      className="form-control"
                      placeholder="Fill Name"
                    />
                  </div>
                  <div className="form-group form-group-default">
                    <label>Select</label>
                    <select className="form-select" id="formGroupDefaultSelect">
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                    </select>
                  </div>
                  <label className="mt-3 mb-3">
                    <b>Form Floating Label</b>
                  </label>
                  <div className="form-floating form-floating-custom mb-3">
                    <input
                      type="email"
                      className="form-control"
                      id="floatingInput"
                      placeholder="name@example.com"
                    />
                    <label for="floatingInput">Email address</label>
                  </div>
                  <div className="form-floating form-floating-custom mb-3">
                    <select
                      className="form-select"
                      id="selectFloatingLabel"
                      required
                    >
                      <option selected>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                    </select>
                    <label for="selectFloatingLabel">Select</label>
                  </div>

                  <div className="form-group">
                    <label for="largeInput">Large Input</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="largeInput"
                      placeholder="Large Input"
                    />
                  </div>
                  <div className="form-group">
                    <label for="largeInput">Default Input</label>
                    <input
                      type="text"
                      className="form-control form-control"
                      id="defaultInput"
                      placeholder="Default Input"
                    />
                  </div>
                  <div className="form-group">
                    <label for="smallInput">Small Input</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="smallInput"
                      placeholder="Small Input"
                    />
                  </div>
                  <div className="form-group">
                    <label for="largeSelect">Large Select</label>
                    <select
                      className="form-select form-control-lg"
                      id="largeSelect"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label for="defaultSelect">Default Select</label>
                    <select
                      className="form-select form-control"
                      id="defaultSelect"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label for="smallSelect">Small Select</label>
                    <select
                      className="form-select form-control-sm"
                      id="smallSelect"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-action">
              <button className="btn btn-success">Submit</button>
              <button className="btn btn-danger">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormsAdmin;
