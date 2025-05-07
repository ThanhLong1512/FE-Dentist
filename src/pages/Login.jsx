import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "react-facebook-login";
import { Card as MuiCard } from "@mui/material";
import CardActions from "@mui/material/CardActions";
import TextField from "@mui/material/TextField";
import Zoom from "@mui/material/Zoom";
import Alert from "@mui/material/Alert";
import { useForm } from "react-hook-form";
import Typography from "@mui/material/Typography";
import authorizedAxiosInstance from "./../utils/authorizedAxios";
import { API_ROOT } from "./../utils/constants";
import { useNavigate, Link } from "react-router-dom";
import { el } from "date-fns/locale";
import axios from "axios";
import { Facebook, Google } from "@mui/icons-material";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { handleRegister } from "../apis";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const handleSuccessGoogle = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;

      // Gọi API đăng nhập Google
      const res = await axios.post(
        `${API_ROOT}/api/v1/users/loginGoogle`,
        {
          token: credential,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data) {
        console.log("Login successful:", res.data);

        // Lưu thông tin người dùng vào localStorage
        const userInfo = {
          id: res.data.id,
          email: res.data.email,
          role: res.data.role,
          require_2FA: res.data.require_2FA,
          is_2fa_verified: res.data.is_2fa_verified,
          last_login: res.data.last_login,
        };
        localStorage.setItem("userInfo", JSON.stringify(userInfo));

        // Chuyển hướng người dùng dựa trên vai trò
        res.data.role === "user"
          ? navigate("/home")
          : navigate("/admin/dashboard");
      } else {
        console.error("Login response does not contain data");
        alert("Login with Google failed!");
      }
    } catch (error) {
      // Xử lý lỗi khi gọi API
      console.error("Google login error:", error);
      alert(
        error.response?.data?.message ||
          "Login with Google failed. Please try again."
      );
    }
  };

  const handleClickFacebook = async (response) => {};

  const handleResponseFacebook = async (response) => {
    try {
      const res = await axios.post(
        `${API_ROOT}/api/v1/users/loginFacebook`,
        {
          accessToken: response.accessToken,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data) {
        console.log("Login successful:", res.data);

        // Lưu thông tin người dùng vào localStorage
        const userInfo = {
          id: res.data.id,
          email: res.data.email,
          role: res.data.role,
          require_2FA: res.data.require_2FA,
          is_2fa_verified: res.data.is_2fa_verified,
          last_login: res.data.last_login,
        };
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        res.data.role === "user"
          ? navigate("/home")
          : navigate("/admin/dashboard");
      } else {
        console.error("Login response does not contain data");
        alert("Login with Facebook failed!");
      }
    } catch (error) {
      // Xử lý lỗi khi gọi API
      console.error("Facebook login error:", error);
      alert(
        error.response?.data?.message ||
          "Login with Google failed. Please try again."
      );
    }
  };

  const submitLogIn = async (payLoad) => {
    const res = await authorizedAxiosInstance.post(
      `${API_ROOT}/api/v1/users/login`,
      payLoad
    );
    const userInfo = {
      id: res.data.id,
      email: res.data.email,
      role: res.data.role,
      require_2FA: res.data.require_2FA,
      is_2fa_verified: res.data.is_2fa_verified,
      last_login: res.data.last_login,
    };
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    res.data.role === "user" ? navigate("/home") : navigate("/admin/dashboard");
  };

  const submitRegister = async (payLoad) => {
    console.log("Register payload:", payLoad);
  };

  // Custom render props cho nút Google
  const renderGoogleButton = ({ onClick }) => (
    <Button
      onClick={onClick}
      variant="outlined"
      fullWidth
      sx={{
        mt: 2,
        py: 1,
        color: "#757575",
        borderColor: "#dadce0",
        textTransform: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      startIcon={
        <Google
          sx={{
            color: "#4285F4",
          }}
        />
      }
    >
      Sign in with Google
    </Button>
  );

  return (
    <section className="login-section">
      <div className="auto-container">
        <div className="row clearfix">
          <div className="column col-lg-6 col-md-6 col-sm-12">
            <Box className="form-login">
              <form onSubmit={handleSubmit(submitLogIn)}>
                <Zoom in={true} style={{ transitionDelay: "200ms" }}>
                  <MuiCard
                    sx={{
                      minWidth: 500,
                      maxWidth: 500,
                      minHeight: 350,
                      marginTop: "6em",
                      p: "0.5em 0",
                      borderRadius: 2,
                    }}
                  >
                    <Box>
                      <h2 style={{ marginLeft: "40px" }}>Login</h2>
                    </Box>

                    <Box sx={{ padding: "0 1em 1em 1em" }}>
                      <Box sx={{ marginTop: "1.2em" }}>
                        <Typography
                          component="span"
                          sx={{
                            display: "inline-block",
                            color: "#999999",
                            fontWeight: "400",
                            fontSize: "16px",
                            marginBottom: "20px",
                          }}
                        >
                          Email
                        </Typography>
                        <TextField
                          autoFocus
                          fullWidth
                          label="Enter Email..."
                          type="text"
                          variant="outlined"
                          error={!!errors.email}
                          {...register("email", {
                            required: "This field is required.",
                          })}
                        />
                        {errors.email && (
                          <Alert
                            severity="error"
                            sx={{
                              mt: "0.7em",
                              ".MuiAlert-message": { overflow: "hidden" },
                            }}
                          >
                            {errors.email.message}
                          </Alert>
                        )}
                      </Box>

                      <Box sx={{ marginTop: "1em" }}>
                        <Typography
                          component="span"
                          sx={{
                            display: "inline-block",
                            color: "#999999",
                            fontWeight: "400",
                            fontSize: "16px",
                            marginBottom: "20px",
                          }}
                        >
                          Password
                        </Typography>
                        <TextField
                          fullWidth
                          label="Enter Password..."
                          type="password"
                          variant="outlined"
                          error={!!errors.password}
                          {...register("password", {
                            required: "This field is required.",
                          })}
                        />
                        {errors.password && (
                          <Alert
                            severity="error"
                            sx={{
                              mt: "0.7em",
                              ".MuiAlert-message": { overflow: "hidden" },
                            }}
                          >
                            {errors.password.message}
                          </Alert>
                        )}
                      </Box>

                      {/* Thêm Remember me và Forgot password */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mt: 1,
                        }}
                      >
                        <FormControlLabel
                          control={<Checkbox {...register("remember")} />}
                          label="Remember me"
                        />
                        <Typography
                          component={Link}
                          to="/forgot-password"
                          sx={{
                            color: "primary.main",
                            textDecoration: "none",
                            "&:hover": {
                              textDecoration: "underline",
                            },
                          }}
                        >
                          Forgot password?
                        </Typography>
                      </Box>
                    </Box>
                    <CardActions
                      sx={{
                        padding: "0.5em 1em 1em 1em",
                        flexDirection: "column",
                      }}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        sx={{ py: 1 }}
                      >
                        Login
                      </Button>

                      <Typography
                        variant="body2"
                        align="center"
                        sx={{ my: 1.5, color: "#757575" }}
                      >
                        Or continue with
                      </Typography>

                      {/* Nút Google - đã điều chỉnh */}
                      <GoogleLogin
                        onSuccess={handleSuccessGoogle}
                        render={({ onClick }) => (
                          <Button
                            onClick={onClick}
                            variant="outlined"
                            fullWidth
                            sx={{
                              mt: 1,
                              py: 1,
                              color: "#757575",
                              borderColor: "#dadce0",
                              textTransform: "none",
                              fontSize: "0.875rem",
                              height: "40px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 1,
                            }}
                            startIcon={
                              <Google
                                sx={{
                                  color: "#4285F4",
                                  fontSize: "1.2rem",
                                }}
                              />
                            }
                          >
                            Sign in with Google
                          </Button>
                        )}
                      />

                      <FacebookLogin
                        appId="2441728712860238"
                        autoLoad={false}
                        fields="name,email,picture"
                        onClick={handleClickFacebook}
                        callback={handleResponseFacebook}
                        render={({ onClick }) => (
                          <Button
                            onClick={onClick}
                            variant="outlined"
                            fullWidth
                            sx={{
                              mt: 2,
                              py: 1,
                              borderColor: "#dadce0",
                              textTransform: "none",
                              fontSize: "0.875rem",
                              height: "40px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 1,
                              background:
                                "linear-gradient(to right, #4267B2, #3b5998)",
                              color: "white",
                              "&:hover": {
                                background:
                                  "linear-gradient(to right, #3b5998, #4267B2)",
                                color: "white",
                              },
                            }}
                            startIcon={
                              <Facebook
                                sx={{
                                  color: "white",
                                  fontSize: "1.2rem",
                                }}
                              />
                            }
                          >
                            Sign in with Facebook
                          </Button>
                        )}
                      />
                    </CardActions>
                  </MuiCard>
                </Zoom>
              </form>
            </Box>
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
