import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Card as MuiCard } from "@mui/material";
import CardActions from "@mui/material/CardActions";
import TextField from "@mui/material/TextField";
import Zoom from "@mui/material/Zoom";
import Alert from "@mui/material/Alert";
import { useForm } from "react-hook-form";
import Typography from "@mui/material/Typography";
import authorizedAxiosInstance from "./../utils/authorizedAxios";
import { toast } from "react-toastify";
import { API_ROOT } from "./../utils/constants";
import { useNavigate } from "react-router-dom";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const submitLogIn = async (payLoad) => {
    const res = await authorizedAxiosInstance.post(
      `${API_ROOT}/api/v1/users/login`,
      payLoad
    );
    const userInfo = {
      id: res.data.id,
      email: res.data.email,
      role: res.data.role,
    };
    console.log("role: ", res.data.role);
    const accessToken = res.data.accessToken;
    const refreshToken = res.data.refreshToken;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    res.data.role === "user" ? navigate("/home") : navigate("/admin/dashboard");
  };
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
                    </Box>
                    <CardActions sx={{ padding: "0.5em 1em 1em 1em" }}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                      >
                        Login
                      </Button>
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
