import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { Card as MuiCard, ThemeProvider, createTheme } from "@mui/material";
import CardActions from "@mui/material/CardActions";
import TextField from "@mui/material/TextField";
import Zoom from "@mui/material/Zoom";
import Alert from "@mui/material/Alert";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Typography from "@mui/material/Typography";
import { API_ROOT, FACEBOOK_APP_ID } from "./../utils/constants";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Facebook } from "@mui/icons-material";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { handleRegister } from "../apis";
import { ToastContainer, toast } from "react-toastify";
import { handleLogin } from "../apis";
import { useLanguage } from "../context/LanguageContext";
import { useDarkMode } from "../context/DarkModeContext";
import { saveAuthSession } from "../utils/authStorage";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const { t, language } = useLanguage();
  const { isDarkMode } = useDarkMode();
  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? "dark" : "light",
          primary: { main: "#1370b5" },
          background: {
            paper: isDarkMode ? "#1e293b" : "#ffffff",
            default: isDarkMode ? "#0f172a" : "#f8fafc",
          },
        },
        components: {
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
              },
            },
          },
        },
      }),
    [isDarkMode]
  );
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
      const credential = credentialResponse?.credential;
      if (!credential) {
        toast.error(t("login.googleFail"));
        return;
      }
      const res = await axios.post(
        `${API_ROOT}/api/v1/users/loginGoogle`,
        { token: credential, credential },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data) {
        saveAuthSession(res.data);
        res.data.role === "user"
          ? navigate("/home")
          : navigate("/admin/dashboard");
      } else {
        toast.error(t("login.googleFail"));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || t("login.googleFail")
      );
    }
  };

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
        saveAuthSession(res.data);
        res.data.role === "user"
          ? navigate("/home")
          : navigate("/admin/dashboard");
      } else {
        console.error("Login response does not contain data");
        alert("Login with Facebook failed!");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Login with Facebook failed. Please try again."
      );
    }
  };

  const [loginError, setLoginError] = useState("");

  const submitLogIn = async (payLoad) => {
    setLoginError("");
    try {
      const res = await handleLogin(payLoad);
      saveAuthSession(res.data);
      res.data.role === "user"
        ? navigate("/home")
        : navigate("/admin/dashboard");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        t("login.loginFail");
      setLoginError(message);
      toast.error(message);
    }
  };

  const [registerError, setRegisterError] = useState("");

  const submitRegister = async (payLoad) => {
    setRegisterError("");
    const apiPayload = {
      name: payLoad.name,
      email: payLoad.email,
      password: payLoad.password,
      passwordConfirm: payLoad.passwordConfirm,
    };
    try {
      const res = await handleRegister(apiPayload);
      saveAuthSession(res);
      toast.success(t("toast.registerSuccess"));
      (res?.role || "user") === "admin"
        ? navigate("/admin/dashboard")
        : navigate("/home");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        t("toast.registerFail");
      setRegisterError(message);
      toast.error(message);
    }
  };

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
      <ThemeProvider theme={muiTheme}>
      <section className="login-section login-page">
        <div className="login-container">
          <div className="login-grid">
            <div className="login-card-wrap">
              <Box className="form-login">
                <form onSubmit={handleSubmit(submitLogIn)}>
                  <Zoom in={true} style={{ transitionDelay: "200ms" }}>
                    <MuiCard className="login-card">
                      <Box className="login-card-header">
                        <h2>{t("login.title")}</h2>
                        <Typography variant="body2" color="text.secondary">
                          {t("login.subtitle")}
                        </Typography>
                      </Box>

                      {loginError && (
                        <Alert
                          severity="error"
                          onClose={() => setLoginError("")}
                          sx={{ mx: 2, mb: 2 }}
                        >
                          {loginError}
                        </Alert>
                      )}

                      <Box sx={{ padding: "0 1.5em 1em 1.5em" }}>
                        <Box sx={{ marginTop: "1.2em" }}>
                          <TextField
                            autoFocus
                            fullWidth
                            label={t("login.email")}
                            placeholder={t("login.emailPlaceholder")}
                            type="email"
                            variant="outlined"
                            error={!!errors.email}
                            {...register("email", {
                              required: t("login.emailRequired"),
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

                        <Box sx={{ marginTop: "1.2em" }}>
                          <TextField
                            fullWidth
                            label={t("login.password")}
                            placeholder={t("login.passwordPlaceholder")}
                            type="password"
                            variant="outlined"
                            error={!!errors.password}
                            {...register("password", {
                              required: t("login.passwordRequired"),
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
                            label={t("login.remember")}
                          />
                          <Typography
                            component={Link}
                            to="/forgot-password"
                            sx={{
                              color: "primary.main",
                              textDecoration: "none",
                              fontSize: "0.875rem",
                              "&:hover": {
                                textDecoration: "underline",
                              },
                            }}
                          >
                            {t("login.forgotPassword")}
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
                          size="large"
                          fullWidth
                          className="login-submit-btn"
                          sx={{
                            py: 1.5,
                            fontSize: "1rem",
                            fontWeight: 600,
                            textTransform: "none",
                          }}
                        >
                          {t("login.submit")}
                        </Button>

                        <Typography
                          variant="body2"
                          align="center"
                          sx={{ my: 1.5, color: "#64748b" }}
                        >
                          {t("login.orContinue")}
                        </Typography>
                        <Box className="google-login-wrap" sx={{ mt: 1, width: "100%" }}>
                          <GoogleLogin
                            onSuccess={handleSuccessGoogle}
                            onError={() => toast.error(t("login.googleFail"))}
                            useOneTap={false}
                            theme={isDarkMode ? "filled_black" : "outline"}
                            size="large"
                            text="signin_with"
                            width="360"
                            locale={language === "vi" ? "vi" : "en"}
                          />
                        </Box>

                        <FacebookLogin
                          appId={FACEBOOK_APP_ID}
                          autoLoad={false}
                          fields="name,email,picture"
                          onSuccess={handleResponseFacebook}
                          onFail={(error) => {
                            toast.error(
                              error?.message || t("login.facebookFail")
                            );
                          }}
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
                              {t("login.facebook")}
                            </Button>
                          )}
                        />
                      </CardActions>
                    </MuiCard>
                  </Zoom>
                </form>
              </Box>
            </div>

            <div className="login-card-wrap">
              <Box className="form-register">
                <form onSubmit={handleSubmitRegister(submitRegister)}>
                  <Zoom in={true} style={{ transitionDelay: "400ms" }}>
                    <MuiCard className="login-card">
                      <Box className="login-card-header">
                        <h2>{t("register.title")}</h2>
                        <Typography variant="body2" color="text.secondary">
                          {t("register.subtitle")}
                        </Typography>
                      </Box>

                      {registerError && (
                        <Alert
                          severity="error"
                          onClose={() => setRegisterError("")}
                          sx={{ mx: 2, mb: 2 }}
                        >
                          {registerError}
                        </Alert>
                      )}

                      <Box sx={{ padding: "0 1.5em 1em 1.5em" }}>
                        <Box sx={{ marginTop: "1.2em" }}>
                          <TextField
                            fullWidth
                            label={t("register.name")}
                            placeholder={t("register.namePlaceholder")}
                            type="text"
                            variant="outlined"
                            error={!!errorsRegister.name}
                            {...registerRegister("name", {
                              required: t("register.nameRequired"),
                              minLength: {
                                value: 2,
                                message: t("register.nameMinLength"),
                              },
                            })}
                          />
                          {errorsRegister.name && (
                            <Alert
                              severity="error"
                              sx={{
                                mt: "0.7em",
                                ".MuiAlert-message": { overflow: "hidden" },
                              }}
                            >
                              {errorsRegister.name.message}
                            </Alert>
                          )}
                        </Box>

                        <Box sx={{ marginTop: "1.2em" }}>
                          <TextField
                            fullWidth
                            label={t("register.email")}
                            placeholder={t("register.emailPlaceholder")}
                            type="email"
                            variant="outlined"
                            error={!!errorsRegister.email}
                            {...registerRegister("email", {
                              required: t("register.emailRequired"),
                              pattern: {
                                value:
                                  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: t("register.emailInvalid"),
                              },
                            })}
                          />
                          {errorsRegister.email && (
                            <Alert
                              severity="error"
                              sx={{
                                mt: "0.7em",
                                ".MuiAlert-message": { overflow: "hidden" },
                              }}
                            >
                              {errorsRegister.email.message}
                            </Alert>
                          )}
                        </Box>

                        <Box sx={{ marginTop: "1.2em" }}>
                          <TextField
                            fullWidth
                            label={t("register.password")}
                            placeholder={t("register.passwordPlaceholder")}
                            type="password"
                            variant="outlined"
                            error={!!errorsRegister.password}
                            {...registerRegister("password", {
                              required: t("register.passwordRequired"),
                              minLength: {
                                value: 6,
                                message:
                                  "Mật khẩu phải có ít nhất 6 ký tự",
                              },
                            })}
                          />
                          {errorsRegister.password && (
                            <Alert
                              severity="error"
                              sx={{
                                mt: "0.7em",
                                ".MuiAlert-message": { overflow: "hidden" },
                              }}
                            >
                              {errorsRegister.password.message}
                            </Alert>
                          )}
                        </Box>

                        <Box sx={{ marginTop: "1.2em" }}>
                          <TextField
                            fullWidth
                            label={t("register.passwordConfirm")}
                            placeholder={t("register.passwordConfirmPlaceholder")}
                            type="password"
                            variant="outlined"
                            error={!!errorsRegister.passwordConfirm}
                            {...registerRegister("passwordConfirm", {
                              required: t("register.passwordConfirmRequired"),
                              validate: (value, formValues) =>
                                value === formValues.password ||
                                t("register.passwordMismatch"),
                            })}
                          />
                          {errorsRegister.passwordConfirm && (
                            <Alert
                              severity="error"
                              sx={{
                                mt: "0.7em",
                                ".MuiAlert-message": { overflow: "hidden" },
                              }}
                            >
                              {errorsRegister.passwordConfirm.message}
                            </Alert>
                          )}
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
                          size="large"
                          fullWidth
                          className="login-submit-btn"
                          sx={{
                            py: 1.5,
                            fontSize: "1rem",
                            fontWeight: 600,
                            textTransform: "none",
                          }}
                        >
                          {t("register.submit")}
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
      </ThemeProvider>
    </>
  );
}

export default Login;
