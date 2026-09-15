import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import {
  ShieldCheck,
  KeyRound,
  X,
  QrCode,
  Copy,
  Check,
  AlertCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Mail,
} from "lucide-react";
import { get2FA_QRCodeAPI, handleVerify2FA, handleSetUp2FA } from "../apis";
import "./require-2fa.css";

function Require2FA({
  user = null,
  handleSuccessVerify2FA,
  onCancel,
  initialShowQR = false,
}) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingQR, setLoadingQR] = useState(false);
  const [showQR, setShowQR] = useState(initialShowQR);
  const [qrCodeData, setQrCodeData] = useState(null);
  const [copied, setCopied] = useState(false);

  const inputRefs = useRef([]);

  // Auto-focus first input box
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Fetch QR Code if accordion is opened or initialShowQR is true
  const fetchQRCode = async () => {
    if (qrCodeData) return;
    setLoadingQR(true);
    try {
      const res = await get2FA_QRCodeAPI();
      // Handle response formats: res.data can be string or object { qrCodeImage, secret }
      if (typeof res?.data === "string") {
        setQrCodeData({ qrCodeImage: res.data, secret: "" });
      } else if (res?.data?.qrCodeImage) {
        setQrCodeData(res.data);
      } else {
        setQrCodeData({ qrCodeImage: res?.data || "", secret: "" });
      }
    } catch (err) {
      console.error("Failed to load 2FA QR code:", err);
      toast.error(
        err.response?.data?.message || "Không thể tải mã QR xác thực"
      );
    } finally {
      setLoadingQR(false);
    }
  };

  const handleToggleQR = () => {
    const next = !showQR;
    setShowQR(next);
    if (next && !qrCodeData) {
      fetchQRCode();
    }
  };

  useEffect(() => {
    if (initialShowQR && !qrCodeData) {
      fetchQRCode();
    }
  }, [initialShowQR]);

  // Handle single digit typing & auto-advance
  const handleDigitChange = (index, value) => {
    setError("");
    const numericValue = value.replace(/\D/g, "");

    // If user pasted multiple characters into a single box
    if (numericValue.length > 1) {
      handlePasteValue(numericValue);
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = numericValue.slice(-1);
    setOtp(newOtp);

    // Auto-advance to next input if digit entered
    if (numericValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace, left, right arrow keys
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Move back and delete previous
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text/plain").trim();
    handlePasteValue(pastedText);
  };

  const handlePasteValue = (pasted) => {
    const digits = pasted.replace(/\D/g, "").slice(0, 6).split("");
    if (!digits.length) return;

    const newOtp = ["", "", "", "", "", ""];
    digits.forEach((digit, i) => {
      newOtp[i] = digit;
    });
    setOtp(newOtp);

    const focusIndex = Math.min(digits.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  // Copy secret key to clipboard
  const handleCopySecret = () => {
    if (!qrCodeData?.secret) return;
    navigator.clipboard.writeText(qrCodeData.secret);
    setCopied(true);
    toast.success("Đã sao chép mã bảo mật!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Submit 2FA verification
  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      setError("Vui lòng nhập đủ 6 chữ số mã xác thực.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // If QR accordion was actively opened because user had not set up yet, or standard verify
      let response;
      try {
        response = await handleVerify2FA(fullOtp);
      } catch (err) {
        // If user hasn't initialized secret, attempt setUp2FA
        if (err.response?.data?.needs_setup || err.response?.status === 404) {
          setShowQR(true);
          await fetchQRCode();
          response = await handleSetUp2FA(fullOtp);
        } else {
          throw err;
        }
      }

      toast.success("Xác thực bảo mật 2FA thành công!");
      if (handleSuccessVerify2FA) {
        handleSuccessVerify2FA(response);
      }
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        "Mã xác thực không chính xác hoặc đã hết hạn.";
      setError(errMsg);
      toast.error(errMsg);
      // If needs setup, expand QR automatically
      if (err.response?.data?.needs_setup) {
        setShowQR(true);
        fetchQRCode();
      }
    } finally {
      setLoading(false);
    }
  };

  const isComplete = otp.join("").length === 6;

  return (
    <div className="twofa-modal-overlay">
      <div className="twofa-card">
        {onCancel && (
          <button
            type="button"
            className="twofa-close-btn"
            onClick={onCancel}
            title="Đóng / Hủy"
          >
            <X size={18} />
          </button>
        )}

        {/* Header Icon */}
        <div className="twofa-header-icon-wrap">
          <div className="twofa-icon-glow">
            <ShieldCheck size={36} />
          </div>
        </div>

        <h2 className="twofa-title">Xác thực hai lớp (2FA)</h2>
        <p className="twofa-subtitle">
          Nhập mã bảo mật gồm 6 chữ số từ ứng dụng Google Authenticator hoặc
          Authy trên điện thoại của bạn.
        </p>

        {/* User Email Indicator */}
        {user?.email && (
          <div className="twofa-user-badge-wrap">
            <span className="twofa-user-badge">
              <Mail size={13} />
              {user.email}
            </span>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="twofa-error-pill">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* 6-Digit OTP Box Grid */}
        <form onSubmit={handleVerify}>
          <div className="twofa-otp-grid" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={digit}
                className={`twofa-otp-input ${digit ? "has-value" : ""}`}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={loading}
              />
            ))}
          </div>

          {/* QR Code Setup Accordion */}
          <div className="twofa-qr-accordion">
            <button
              type="button"
              className="twofa-qr-accordion-btn"
              onClick={handleToggleQR}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <QrCode size={16} />
                {showQR ? "Ẩn mã QR thiết lập" : "Chưa cài đặt hoặc cần quét mã QR?"}
              </span>
              {showQR ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showQR && (
              <div className="twofa-qr-content">
                {loadingQR ? (
                  <div style={{ padding: "24px 0", display: "flex", alignItems: "center", gap: "10px", color: "#64748b" }}>
                    <div className="twofa-spinner" style={{ borderColor: "#cbd5e1", borderTopColor: "#0284c7" }} />
                    <span>Đang tải mã QR...</span>
                  </div>
                ) : qrCodeData?.qrCodeImage ? (
                  <>
                    <div className="twofa-qr-image-frame">
                      <img src={qrCodeData.qrCodeImage} alt="2FA QR Code" />
                    </div>

                    {qrCodeData.secret && (
                      <div className="twofa-secret-box">
                        <span>Khóa: {qrCodeData.secret}</span>
                        <button
                          type="button"
                          className="twofa-copy-btn"
                          onClick={handleCopySecret}
                          title="Sao chép khóa bí mật"
                        >
                          {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                        </button>
                      </div>
                    )}

                    <p className="twofa-qr-instructions">
                      1. Mở <strong>Google Authenticator</strong> hoặc <strong>Authy</strong>.<br />
                      2. Chọn <strong>Quét mã QR</strong> và đưa máy ảnh vào hình trên.<br />
                      3. Nhập mã gồm 6 chữ số vừa tạo vào các ô ở trên.
                    </p>
                  </>
                ) : (
                  <p className="twofa-qr-instructions" style={{ color: "#ef4444" }}>
                    Không tìm thấy mã QR. Vui lòng thử lại sau.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="twofa-actions">
            <button
              type="submit"
              className="twofa-btn-submit"
              disabled={!isComplete || loading}
            >
              {loading ? (
                <>
                  <div className="twofa-spinner" />
                  <span>Đang xác thực...</span>
                </>
              ) : (
                <>
                  <span>Xác thực & Tiếp tục</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>

            {onCancel && (
              <button
                type="button"
                className="twofa-btn-cancel"
                onClick={onCancel}
                disabled={loading}
              >
                Hủy & Quay lại đăng nhập
              </button>
            )}
          </div>
        </form>

        <div className="twofa-footer-note">
          <KeyRound size={13} />
          <span>Mã bảo mật được làm mới tự động sau mỗi 30 giây</span>
        </div>
      </div>
    </div>
  );
}

export default Require2FA;
