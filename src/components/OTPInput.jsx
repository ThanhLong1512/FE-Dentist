import React, { useState, useContext, useEffect } from "react";
import { RecoveryContext } from "../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export default function OTPInput() {
  const { email, otp, setShowOTPInput } = useContext(RecoveryContext);
  const [timerCount, setTimer] = useState(60);
  const [OTPinput, setOTPinput] = useState(["", "", "", ""]);
  const [disable, setDisable] = useState(true);
  const navigate = useNavigate();

  function resendOTP() {
    if (disable) return;
    axios
      .post("http://localhost:5000/send_recovery_email", {
        OTP: otp,
        recipient_email: email,
      })
      .then(() => setDisable(true))
      .then(() =>
        toast.success("A new OTP has successfully been sent to your email.")
      )
      .then(() => setTimer(60))
      .catch((error) => {
        console.log(error);
        toast.error("Failed to resend OTP. Please try again.");
      });
  }

  function verifyOTP() {
    if (parseInt(OTPinput.join("")) === otp) {
      navigate("/reset-password");
      return;
    }
    toast.error(
      "The code you have entered is not correct, try again or re-send the link"
    );
    return;
  }

  function handleClose() {
    setShowOTPInput(false);
  }

  useEffect(() => {
    let interval = setInterval(() => {
      setTimer((lastTimerCount) => {
        lastTimerCount <= 1 && clearInterval(interval);
        if (lastTimerCount <= 1) setDisable(false);
        if (lastTimerCount <= 0) return lastTimerCount;
        return lastTimerCount - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [disable]);

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="modal-backdrop fade show"></div>
      <div className="modal d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0">
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body text-center p-4">
              <h2 className="mb-3">Xác minh OTP</h2>
              <p className="text-muted mb-4">
                Chúng tôi đã gửi mã OTP đến email {email}
              </p>

              <div className="d-flex justify-content-center mb-4">
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="mx-2">
                    <input
                      maxLength="1"
                      className="form-control text-center py-3"
                      style={{
                        width: "60px",
                        height: "60px",
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                      }}
                      type="text"
                      value={OTPinput[index]}
                      onChange={(e) => {
                        const newOTPinput = [...OTPinput];
                        newOTPinput[index] = e.target.value.replace(/\D/g, "");
                        setOTPinput(newOTPinput);

                        if (e.target.value && index < 3) {
                          document
                            .getElementById(`otp-input-${index + 1}`)
                            .focus();
                        }
                      }}
                      id={`otp-input-${index}`}
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={verifyOTP}
                className="btn btn-primary w-100 mb-3 py-2"
              >
                Xác minh
              </button>

              <p className="text-muted">
                Không nhận được mã?{" "}
                <button
                  onClick={resendOTP}
                  disabled={disable}
                  className={`btn btn-link p-0 ${
                    disable ? "text-muted" : "text-primary"
                  }`}
                >
                  {disable ? `Gửi lại sau ${timerCount}s` : "Gửi lại mã"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
