function Login() {
  return (
    <section className="login-section">
      <div className="auto-container">
        <div className="row clearfix">
          <div className="column col-lg-6 col-md-6 col-sm-12">
            <div className="login-form">
              <h2>Login</h2>

              <form
                method="post"
                action="https://skyethemes.com/html/2022/medicoz/contact.html"
              >
                <div className="form-group">
                  <label>Username or Email</label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Name or Email "
                    required=""
                  />
                </div>

                <div className="form-group">
                  <label>Enter Your Password</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Password"
                    required=""
                  />
                </div>

                <div className="form-group">
                  <input
                    type="checkbox"
                    name="shipping-option"
                    id="account-option-1"
                  />
                  &nbsp; <label htmlFor="account-option-1">Remember me</label>
                </div>

                <div className="form-group">
                  <button
                    className="theme-btn btn-style-one"
                    type="submit"
                    name="submit-form"
                  >
                    <span className="btn-title">LOGIN</span>
                    <span></span> <span></span> <span></span> <span></span>{" "}
                    <span></span>
                  </button>
                </div>

                <div className="form-group pass">
                  <a href="#" className="psw">
                    Lost your password?
                  </a>
                </div>
              </form>
            </div>
          </div>

          <div className="column col-lg-6 col-md-6 col-sm-12">
            <div className="login-form register-form">
              <h2>Register</h2>

              <form
                method="post"
                action="https://skyethemes.com/html/2022/medicoz/contact.html"
              >
                <div className="form-group">
                  <label>User Name</label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Your Name"
                    required=""
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    required=""
                  />
                </div>

                <div className="form-group">
                  <label>Your Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    required=""
                  />
                </div>

                <div className="form-group text-right">
                  <button
                    className="theme-btn btn-style-one"
                    type="submit"
                    name="submit-form"
                  >
                    <span className="btn-title">Register</span>
                    <span></span> <span></span> <span></span> <span></span>{" "}
                    <span></span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
