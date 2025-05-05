import { useState, useContext } from "react";
import { Mail } from "lucide-react";
import OTPInput from "../components/OTPInput";
import { RecoveryContext } from "../App";

function ForgotPassword() {
  const { setEmail, email } = useContext(RecoveryContext);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError(""); // Clear error khi người dùng thay đổi email
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmitClick = async () => {
    if (!email) {
      setError("Vui lòng nhập địa chỉ email");
      return;
    }

    if (!validateEmail(email)) {
      setError("Địa chỉ email không hợp lệ");
      return;
    }

    setIsSubmitting(true);

    try {
      // Giả định gọi API kiểm tra email tồn tại ở đây
      // await checkEmailExists(email);

      // Nếu email hợp lệ và tồn tại trong hệ thống
      setShowOTPInput(true);
    } catch (err) {
      setError("Có lỗi xảy ra khi kiểm tra email");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col py-12 sm:px-6 lg:px-8">
      <style>
        {`
          @import url("https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css");
        `}
      </style>
      {email && <OTPInput />}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Quên mật khẩu?
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Nhập địa chỉ email của bạn và chúng tôi sẽ gửi hướng dẫn để đặt
              lại mật khẩu.
            </p>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-md bg-red-50 text-red-800">
              {error}
            </div>
          )}

          <div className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  className="py-2 pl-10 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div>
              <button
                onClick={handleSubmitClick}
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? "Đang kiểm tra..."
                  : "Gửi hướng dẫn đặt lại mật khẩu"}
              </button>
            </div>
            <div className="text-center">
              <a
                href="#"
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Quay lại đăng nhập
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
