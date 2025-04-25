import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import SecurityIcon from "@mui/icons-material/Security";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function Require2FA({ handleSuccessVerify2FA }) {
  const [otpToken, setConfirmOtpToken] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRequire2FA = () => {
    if (!otpToken) {
      const errMsg = "Please enter your code.";
      setError(errMsg);
      toast.error(errMsg);
      return;
    }

    setLoading(true);
    console.log("handleRequire2FA > otpToken: ", otpToken);

    // Call API here
    axios
      .put(
        "http://localhost:8080/api/v1/users/verify2FA",
        { otpTokenClient: otpToken },
        { withCredentials: true }
      )
      .then((response) => {
        handleSuccessVerify2FA(response.data);
        toast.success("Verify 2FA successfully!");
        setError(null);
      })
      .catch((err) => {
        const errMsg = err.response?.data?.message || "Verification failed";
        toast.error(errMsg);
        setError(errMsg);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal disableScrollLock open={true} sx={{ overflowY: "auto" }}>
      <Box
        sx={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          bgcolor: "white",
          boxShadow: 24,
          borderRadius: "none",
          border: "none",
          outline: 0,
          padding: "60px 20px 20px",
          margin: "0 auto",
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#1A2027" : "#fff",
        }}
      >
        <Box
          sx={{
            pr: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <SecurityIcon sx={{ color: "#27ae60" }} />
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#27ae60" }}
          >
            Require 2FA (Two-Factor Authentication)
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            p: 1,
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            Nhập mã gồm 6 chữ số từ ứng dụng bảo mật của bạn và click vào{" "}
            <strong>Confirm</strong> để xác nhận.
          </Box>

          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              my: 1,
            }}
          >
            <TextField
              autoFocus
              autoComplete="nope"
              label="Enter your code..."
              type="text"
              variant="outlined"
              sx={{ minWidth: "280px" }}
              value={otpToken}
              onChange={(e) => setConfirmOtpToken(e.target.value)}
              error={!!error && !otpToken}
            />

            <Button
              type="button"
              variant="contained"
              color="primary"
              size="large"
              sx={{
                textTransform: "none",
                minWidth: "120px",
                height: "55px",
                fontSize: "1em",
              }}
              onClick={handleRequire2FA}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Confirm"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export default Require2FA;
