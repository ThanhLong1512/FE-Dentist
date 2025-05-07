import { useState, useContext, useEffect } from "react";
import { RecoveryContext } from "../App";
import { Eye, EyeOff, Lock, Check, X } from "lucide-react";
import { handleResetPassword } from "../apis";

function ResetPassword() {
  const { email } = useContext(RecoveryContext);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordError, setPasswordError] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Check password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    setPasswordStrength(strength);
  }, [password]);

  // Check password confirmation
  useEffect(() => {
    if (!passwordConfirm) return;
    setPasswordMatch(password === passwordConfirm);
  }, [password, passwordConfirm]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  const handlePasswordConfirmChange = (e) => {
    setPasswordConfirm(e.target.value);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowPasswordConfirm = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      setPasswordError("Vui lòng nhập mật khẩu mới");
      return;
    }

    if (passwordStrength < 3) {
      setPasswordError(
        "Mật khẩu không đủ mạnh. Vui lòng thử lại với mật khẩu an toàn hơn."
      );
      return;
    }

    if (password !== passwordConfirm) {
      setPasswordError("Mật khẩu xác nhận không khớp");
      return;
    }

    setIsSubmitting(true);

    const data = { password, email, passwordConfirm };
    await handleResetPassword(data).then((res) => {
      setIsSubmitting(false);
      setResetSuccess(true);
    });
  };

  // Success screen
  if (resetSuccess) {
    return (
      <div className="container d-flex flex-column justify-content-center min-vh-100 py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card p-4 text-center">
              <div
                className="mx-auto bg-success bg-opacity-10 rounded-circle p-4 mb-4"
                style={{ width: "80px", height: "80px" }}
              >
                <Check
                  className="h-3 w-3 text-success"
                  style={{ fontSize: "2rem" }}
                />
              </div>
              <h2 className="mb-3">Đặt lại mật khẩu thành công!</h2>
              <p className="text-muted mb-4">
                Mật khẩu mới của bạn đã được cập nhật. Bạn sẽ được chuyển hướng
                đến trang đăng nhập.
              </p>
              <a href="/login" className="btn btn-primary">
                Đến trang đăng nhập
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container d-flex flex-column justify-content-center min-vh-100 py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4">
            <div className="text-center mb-4">
              <h2>Đặt lại mật khẩu</h2>
              {email && (
                <p className="text-muted, ">
                  Tạo mật khẩu mới cho tài khoản{" "}
                  <span className="fw-semibold">{email}</span>
                </p>
              )}
            </div>

            {passwordError && (
              <div className="alert alert-danger d-flex align-items-center">
                <X className="me-2" />
                <div>{passwordError}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Password field */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Mật khẩu mới
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <Lock size={18} />
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="form-control"
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="input-group-text"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Password strength */}
                {password && (
                  <div className="mt-2">
                    <div className="d-flex align-items-center">
                      <div className="progress w-100" style={{ height: "5px" }}>
                        <div
                          className={`progress-bar ${
                            passwordStrength <= 1
                              ? "bg-danger"
                              : passwordStrength <= 3
                              ? "bg-warning"
                              : "bg-success"
                          }`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className="ms-2 small text-muted">
                        {passwordStrength <= 1
                          ? "Yếu"
                          : passwordStrength <= 3
                          ? "Trung bình"
                          : "Mạnh"}
                      </span>
                    </div>
                    <p className="small text-muted mt-1 mb-0">
                      Mật khẩu nên có ít nhất 8 ký tự, bao gồm chữ hoa, chữ
                      thường, số và ký tự đặc biệt
                    </p>
                  </div>
                )}
              </div>

              {/* Password confirmation field */}
              <div className="mb-4">
                <label htmlFor="passwordConfirm" className="form-label">
                  Xác nhận mật khẩu
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <Lock size={18} />
                  </span>
                  <input
                    id="passwordConfirm"
                    name="passwordConfirm"
                    type={showPasswordConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    value={passwordConfirm}
                    onChange={handlePasswordConfirmChange}
                    className={`form-control ${
                      passwordConfirm && !passwordMatch ? "is-invalid" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={toggleShowPasswordConfirm}
                    className="input-group-text"
                  >
                    {showPasswordConfirm ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {passwordConfirm && !passwordMatch && (
                  <div className="invalid-feedback d-block">
                    Mật khẩu xác nhận không khớp
                  </div>
                )}
              </div>

              {/* Submit button */}
              <div className="d-grid mb-3">
                <button
                  type="submit"
                  disabled={isSubmitting || (passwordConfirm && !passwordMatch)}
                  className="btn btn-primary"
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Đang xử lý...
                    </>
                  ) : (
                    "Đặt lại mật khẩu"
                  )}
                </button>
              </div>
            </form>

            <div className="text-center">
              <a href="#" className="text-decoration-none">
                Quay lại đăng nhập
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
