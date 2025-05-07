import React, { useState, useContext, useEffect } from "react";
import { RecoveryContext } from "../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

      <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white py-8 px-6 shadow-xl rounded-lg sm:px-10 relative">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Xác minh OTP</h2>
              <p className="mt-2 text-sm text-gray-600">
                Chúng tôi đã gửi mã OTP đến email {email}
              </p>
            </div>

            <div className="mt-8">
              <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs mb-8">
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="w-16 h-16">
                    <input
                      maxLength="1"
                      className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-lg border border-gray-300 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-indigo-500"
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

              <div className="space-y-4">
                <button
                  onClick={verifyOTP}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Xác minh
                </button>

                <div className="text-center text-sm text-gray-600">
                  <p>
                    Không nhận được mã?{" "}
                    <button
                      onClick={resendOTP}
                      disabled={disable}
                      className={`font-medium ${
                        disable
                          ? "text-gray-400"
                          : "text-indigo-600 hover:text-indigo-500"
                      }`}
                    >
                      {disable ? `Gửi lại sau ${timerCount}s` : "Gửi lại mã"}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
