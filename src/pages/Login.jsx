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
import { API_ROOT } from "./../utils/constants";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Facebook, Google } from "@mui/icons-material";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { handleRegister } from "../apis";
import { ToastContainer, toast } from "react-toastify";
import { handleLogin } from "../apis";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const {
    register: registerRegister,
    handleSubmit: handleSubmitRegister,
    formState: { errors: errorsRegister },
  } = useForm();

  const navigate = useNavigate();

  const handleSuccessGoogle = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;
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
        const userInfo = {
          id: res.data.id,
          name: res.data.name,
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
        alert("Login with Google failed!");
      }
    } catch (error) {
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
      toast.error(
        error.response?.data?.message ||
          "Login with Facebook failed. Please try again."
      );
    }
  };

  const submitLogIn = async (payLoad) => {
    const res = await handleLogin(payLoad);
    const userInfo = {
      id: res.data.id,
      email: res.data.email,
      name: res.data.name,
      role: res.data.role,
      image: res.data.image,
      require_2FA: res.data.require_2FA,
      is_2fa_verified: res.data.is_2fa_verified,
      last_login: res.data.last_login,
    };
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    res.data.role === "user" ? navigate("/home") : navigate("/admin/dashboard");
  };

  const submitRegister = async (payLoad) => {
    await handleRegister(payLoad)
      .then((res) => {
        const userInfo = {
          id: res.id,
          email: res.email,
          name: res.name,
          role: res.role,
          require_2FA: res.require_2FA,
          is_2fa_verified: res.is_2fa_verified,
          last_login: res.last_login,
        };
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        res.role === "user" ? navigate("/home") : navigate("/admin/dashboard");
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message || "Register failed. Please try again."
        );
      });
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
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
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
              <Box className="form-register">
                <form onSubmit={handleSubmitRegister(submitRegister)}>
                  <Zoom in={true} style={{ transitionDelay: "400ms" }}>
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
                        <h2 style={{ marginLeft: "40px" }}>Register</h2>
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
                            Username
                          </Typography>
                          <TextField
                            fullWidth
                            label="Enter Username..."
                            type="text"
                            variant="outlined"
                            {...registerRegister("username")}
                          />
                        </Box>

                        {/* Email Field */}
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
                            Email
                          </Typography>
                          <TextField
                            fullWidth
                            label="Enter Email..."
                            type="email"
                            variant="outlined"
                            {...registerRegister("email")}
                          />
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
                            {...registerRegister("password")}
                          />
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
                            Password Confirm
                          </Typography>
                          <TextField
                            fullWidth
                            label="Enter Password..."
                            type="password"
                            variant="outlined"
                            {...registerRegister("passwordConfirm")}
                          />
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
                          Register
                        </Button>
                      </CardActions>
                    </MuiCard>
                  </Zoom>
                </form>
              </Box>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Login;
