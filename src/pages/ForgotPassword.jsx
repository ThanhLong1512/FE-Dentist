import { useState } from "react";
import { Mail } from "lucide-react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "success", text: "" });

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmitClick = () => {
    if (!email) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setMessage({
        type: "success",
        text: "Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn!",
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col py-12 sm:px-6 lg:px-8 ">
      {/* Thêm thẻ style để nhúng Tailwind từ CDN */}
      <style>
        {`
          @import url("https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css");
        `}
      </style>

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

          {message.text && (
            <div
              className={`mt-4 p-3 rounded-md ${
                message.type === "success"
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              {message.text}
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
                  ? "Đang gửi..."
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
