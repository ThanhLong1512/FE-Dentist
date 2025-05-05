import React from "react";
import { useState } from "react";
import { useContext } from "react";
import { RecoveryContext } from "../App";
import axios from "axios";

export default function OTPInput() {
  const { email, otp, setPage } = useContext(RecoveryContext);
  const [timerCount, setTimer] = React.useState(60);
  const [OTPinput, setOTPinput] = useState(["", "", "", ""]);
  const [disable, setDisable] = useState(true);

  function resendOTP() {
    if (disable) return;
    axios
      .post("http://localhost:5000/send_recovery_email", {
        OTP: otp,
        recipient_email: email,
      })
      .then(() => setDisable(true))
      .then(() => alert("A new OTP has successfully been sent to your email."))
      .then(() => setTimer(60))
      .catch(console.log);
  }

  function verifyOTP() {
    if (parseInt(OTPinput.join("")) === otp) {
      setPage("reset");
      return;
    }
    alert(
      "The code you have entered is not correct, try again or re-send the link"
    );
    return;
  }

  React.useEffect(() => {
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-lg sm:px-10">
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
                      newOTPinput[index] = e.target.value;
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
  );
}
