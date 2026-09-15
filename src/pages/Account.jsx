import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  ShieldAlert,
  Key,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Edit3,
  Save,
  X,
  AlertTriangle,
  Trash2,
  Bell,
  CheckCircle2,
  Check,
  Calendar,
  Sparkles,
  Info,
} from "lucide-react";
import AvatarFullscreenModal from "../components/AvatarFullscreenModal";
import Require2FA from "../components/require-2fa";
import { handleLogoutApi } from "../apis";
import { useMe, useUpdateMe } from "../features/authentication/useMe";
import "./Account.css";

const DEFAULT_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle fill='%23e2e8f0' cx='50' cy='50' r='50'/%3E%3Ccircle fill='%2394a3b8' cx='50' cy='38' r='18'/%3E%3Cellipse fill='%2394a3b8' cx='50' cy='88' rx='28' ry='24'/%3E%3C/svg%3E";

function Account() {
  const navigate = useNavigate();
  const { me, isLoading: isLoadingMe, refetch: refetchMe } = useMe();
  const { updateMe, isUpdating } = useUpdateMe();

  const [activeTab, setActiveTab] = useState(0);
  const [userInfo, setUserInfo] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("userInfo") || "{}");
      return {
        name: stored.name || "",
        email: stored.email || "",
        phone: stored.phone || "",
        photo: stored.photo || stored.image || "",
        role: stored.role || "",
        require_2FA: Boolean(stored.require_2FA),
      };
    } catch {
      return {
        name: "",
        email: "",
        phone: "",
        photo: "",
        role: "",
        require_2FA: false,
      };
    }
  });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [submitError, setSubmitError] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [show2FASetupModal, setShow2FASetupModal] = useState(false);

  // Notification preferences state
  const [notifications, setNotifications] = useState({
    newAppointment: true,
    reminder24h: true,
    newsAndPromos: false,
  });

  const loading = isLoadingMe || isUpdating || isSubmitting;

  useEffect(() => {
    if (!me) return;
    const is2FA = Boolean(me.require_2FA);
    setUserInfo({
      name: me.name || "",
      email: me.email || "",
      phone: me.phone || "",
      photo: me.photo || DEFAULT_AVATAR,
      role: me.role || "user",
      require_2FA: is2FA,
    });
    setFormData((prev) => ({
      ...prev,
      name: me.name || "",
      phone: me.phone || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));

    try {
      const stored = JSON.parse(localStorage.getItem("userInfo") || "{}");
      if (stored && typeof stored === "object" && stored.require_2FA !== is2FA) {
        localStorage.setItem(
          "userInfo",
          JSON.stringify({ ...stored, require_2FA: is2FA })
        );
        window.dispatchEvent(new Event("userInfoUpdated"));
      }
    } catch (e) {
      console.error("Failed to sync userInfo to localStorage:", e);
    }
  }, [me]);

  useEffect(() => {
    if (!isLoadingMe && !me) {
      toast.error("Không thể tải thông tin tài khoản");
    }
  }, [isLoadingMe, me]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggleEditMode = () => {
    if (editMode) {
      // Cancel edit mode
      setFormData((prev) => ({
        ...prev,
        name: userInfo.name,
        phone: userInfo.phone,
      }));
      setSubmitError("");
      setEditMode(false);
    } else {
      setEditMode(true);
      setActiveTab(0); // Jump to personal info tab
    }
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file hình ảnh hợp lệ");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước file ảnh quá lớn. Vui lòng chọn file dưới 5MB");
        return;
      }

      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
      toast.info("Đã chọn ảnh mới. Nhấn 'Lưu ảnh' để hoàn tất cập nhật.");
    }
  };

  const handleCancelPhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const handleSavePhotoOnly = async () => {
    if (!photoFile) return;
    setIsSubmitting(true);
    setSubmitError("");

    const formDataToSend = new FormData();
    formDataToSend.append("photo", photoFile);

    try {
      const res = await updateMe(formDataToSend);
      toast.success("Cập nhật ảnh đại diện thành công");
      setPhotoPreview(null);
      setPhotoFile(null);

      const existingUserInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
      const updatedUserInfo = {
        ...existingUserInfo,
        photo: res?.photo || existingUserInfo.photo,
        image: res?.photo || existingUserInfo.image,
      };
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));

      setUserInfo((prev) => ({
        ...prev,
        photo: res?.photo || prev.photo,
      }));

      window.dispatchEvent(new Event("userInfoUpdated"));
      await refetchMe();
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || "Đã xảy ra lỗi khi lưu ảnh đại diện"
      );
      toast.error("Không thể cập nhật ảnh đại diện");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleUpdateProfile = async (e) => {
    if (e) e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    const formDataToSend = new FormData();
    let hasChanges = false;

    if (formData.name.trim() !== userInfo.name) {
      formDataToSend.append("name", formData.name.trim());
      hasChanges = true;
    }

    if (formData.phone && formData.phone.trim() !== userInfo.phone) {
      formDataToSend.append("phone", formData.phone.trim());
      hasChanges = true;
    }

    if (photoFile) {
      formDataToSend.append("photo", photoFile);
      hasChanges = true;
    }

    if (!hasChanges) {
      toast.info("Không có thông tin nào được thay đổi");
      setEditMode(false);
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await updateMe(formDataToSend);
      toast.success("Cập nhật thông tin hồ sơ thành công!");
      setEditMode(false);
      setPhotoPreview(null);
      setPhotoFile(null);

      const existingUserInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
      const updatedUserInfo = {
        ...existingUserInfo,
        name: res?.name || existingUserInfo.name,
        photo: res?.photo || existingUserInfo.photo,
        image: res?.photo || existingUserInfo.image,
      };
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));

      setUserInfo((prev) => ({
        ...prev,
        name: res?.name || prev.name,
        phone: res?.phone || prev.phone,
        photo: res?.photo || prev.photo,
      }));

      window.dispatchEvent(new Event("userInfoUpdated"));
      await refetchMe();
    } catch (err) {
      const errMsg =
        err.response?.data?.message || "Đã xảy ra lỗi khi cập nhật hồ sơ";
      setSubmitError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!formData.currentPassword) {
      setSubmitError("Vui lòng nhập mật khẩu hiện tại");
      return;
    }

    if (!formData.newPassword) {
      setSubmitError("Vui lòng nhập mật khẩu mới");
      return;
    }

    if (formData.newPassword.length < 8) {
      setSubmitError("Mật khẩu mới phải có ít nhất 8 ký tự");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setSubmitError("Mật khẩu xác nhận không trùng khớp");
      return;
    }

    setIsSubmitting(true);

    const passwordData = {
      currentPassword: formData.currentPassword,
      password: formData.newPassword,
      passwordConfirm: formData.confirmPassword,
    };

    try {
      await updateMe(passwordData);
      toast.success("Thay đổi mật khẩu thành công!");
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (err) {
      const errMsg =
        err.response?.data?.message || "Đã xảy ra lỗi khi cập nhật mật khẩu";
      setSubmitError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle2FA = async () => {
    if (!userInfo.require_2FA) {
      setShow2FASetupModal(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await updateMe({ require_2FA: false });
      setUserInfo((prev) => ({ ...prev, require_2FA: false }));

      try {
        const stored = JSON.parse(localStorage.getItem("userInfo") || "{}");
        if (stored && typeof stored === "object") {
          localStorage.setItem(
            "userInfo",
            JSON.stringify({ ...stored, require_2FA: false })
          );
          window.dispatchEvent(new Event("userInfoUpdated"));
        }
      } catch (e) {
        console.error("Failed to sync userInfo to localStorage:", e);
      }

      toast.success("Đã tắt xác thực 2 bước (2FA)");
      await refetchMe();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Không thể cập nhật trạng thái 2FA"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessSetup2FA = () => {
    setShow2FASetupModal(false);
    setUserInfo((prev) => ({ ...prev, require_2FA: true }));
    try {
      const stored = JSON.parse(localStorage.getItem("userInfo") || "{}");
      localStorage.setItem(
        "userInfo",
        JSON.stringify({ ...stored, require_2FA: true })
      );
      window.dispatchEvent(new Event("userInfoUpdated"));
    } catch (e) {
      console.error(e);
    }
    toast.success("Kích hoạt 2FA thành công!");
    refetchMe();
  };

  const handleToggleNotification = (key) => {
    setNotifications((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      toast.success("Đã cập nhật tùy chọn thông báo");
      return next;
    });
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      toast.error("Vui lòng nhập chính xác 'DELETE' để xác nhận");
      return;
    }
    setIsSubmitting(true);
    try {
      await updateMe({ isLocked: true });
      toast.success("Tài khoản của bạn đã được xóa thành công");
      await handleLogoutApi();
      navigate("/");
    } catch {
      toast.error("Không thể thực hiện xóa tài khoản");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !userInfo.name) {
    return (
      <div className="account-page-loading">
        <CircularProgress size={40} sx={{ color: "#0284c7" }} />
      </div>
    );
  }

  return (
    <div className="account-profile-container">
      {/* ================= HERO PROFILE CARD ================= */}
      <section className="account-hero-card">
        <div className="account-hero-cover" />

        <div className="account-hero-body">
          <div className="account-hero-main">
            <div className="account-avatar-wrapper">
              <img
                src={photoPreview || userInfo.photo || DEFAULT_AVATAR}
                alt={userInfo.name}
                className="account-hero-avatar"
                onClick={() => setShowAvatarModal(true)}
                title="Nhấp vào ảnh để xem toàn màn hình"
                style={{ cursor: "pointer" }}
              />
              <label
                htmlFor="profile-photo-upload"
                className="account-camera-btn"
                title="Thay đổi ảnh đại diện"
              >
                <Camera size={18} />
                <input
                  id="profile-photo-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handlePhotoChange}
                />
              </label>
            </div>

            <div className="account-hero-info">
              <h1 className="account-hero-name">
                {userInfo.name || "Chưa đặt tên"}
              </h1>
              <div className="account-hero-badges">
                <span className="badge-pill role">
                  <ShieldCheck size={14} />
                  {userInfo.role === "admin" ? "Quản trị viên" : "Khách hàng"}
                </span>
                <span className="badge-pill email">
                  <Mail size={14} />
                  {userInfo.email}
                </span>
                <span
                  className={`badge-pill ${
                    userInfo.require_2FA ? "security-on" : "security-off"
                  }`}
                >
                  {userInfo.require_2FA ? (
                    <>
                      <ShieldCheck size={14} /> 2FA Đang bật
                    </>
                  ) : (
                    <>
                      <ShieldAlert size={14} /> 2FA Chưa kích hoạt
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="account-hero-actions">
            {!editMode ? (
              <button
                type="button"
                className="btn-primary-action"
                onClick={handleToggleEditMode}
              >
                <Edit3 size={16} />
                <span>Chỉnh sửa hồ sơ</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="btn-secondary-action"
                  onClick={handleToggleEditMode}
                >
                  <X size={16} />
                  <span>Hủy bỏ</span>
                </button>
                <button
                  type="button"
                  className="btn-primary-action"
                  onClick={handleUpdateProfile}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <>
                      <Save size={16} />
                      <span>Lưu thay đổi</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Floating Photo Preview Bar */}
        {photoFile && (
          <div className="photo-save-bar">
            <div className="photo-save-info">
              <Sparkles size={18} />
              <span>Đã chọn ảnh đại diện mới. Bạn có muốn lưu ảnh này không?</span>
            </div>
            <div className="photo-save-btns">
              <button
                type="button"
                className="btn-save-photo"
                onClick={handleSavePhotoOnly}
                disabled={loading}
              >
                {loading ? <CircularProgress size={14} color="inherit" /> : <Check size={14} />}
                <span>Lưu ảnh ngay</span>
              </button>
              <button
                type="button"
                className="btn-cancel-photo"
                onClick={handleCancelPhoto}
              >
                Hủy
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ================= PROFILE NAVIGATION TABS ================= */}
      <nav className="profile-nav-tabs">
        <button
          type="button"
          className={`profile-tab-btn ${activeTab === 0 ? "active" : ""}`}
          onClick={() => setActiveTab(0)}
        >
          <User size={16} />
          <span>Thông tin cá nhân</span>
        </button>

        <button
          type="button"
          className={`profile-tab-btn ${activeTab === 1 ? "active" : ""}`}
          onClick={() => setActiveTab(1)}
        >
          <Lock size={16} />
          <span>Bảo mật & Mật khẩu</span>
        </button>

        <button
          type="button"
          className={`profile-tab-btn ${activeTab === 2 ? "active" : ""}`}
          onClick={() => setActiveTab(2)}
        >
          <Bell size={16} />
          <span>Cài đặt thông báo</span>
        </button>

        <button
          type="button"
          className={`profile-tab-btn ${activeTab === 3 ? "active" : ""}`}
          onClick={() => setActiveTab(3)}
        >
          <AlertTriangle size={16} />
          <span>Quản lý tài khoản</span>
        </button>
      </nav>

      {/* ================= TAB 0: THÔNG TIN CÁ NHÂN ================= */}
      {activeTab === 0 && (
        <section className="account-card">
          <div className="card-header">
            <h2 className="card-title">Hồ sơ cá nhân</h2>
            <p className="card-desc">
              Quản lý thông tin họ tên, email liên hệ và phương thức nhận lịch khám nha khoa
            </p>
          </div>

          {submitError && (
            <div className="account-alert-error">
              <AlertTriangle size={18} />
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile}>
            <div className="form-grid-2">
              <div className="form-field">
                <label className="form-label">
                  <User size={15} />
                  <span>Họ và tên *</span>
                </label>
                <div
                  className={`form-input-box ${editMode ? "editing" : "readonly"}`}
                >
                  <div className="input-icon-pill">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    className="custom-input"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    placeholder="Nhập họ và tên đầy đủ"
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="form-label">
                  <Mail size={15} />
                  <span>Địa chỉ Email</span>
                </label>
                <div className="form-input-box readonly">
                  <div className="input-icon-pill">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    className="custom-input"
                    value={userInfo.email}
                    disabled
                  />
                  <span className="input-locked-badge">
                    <Lock size={11} /> Cố định
                  </span>
                </div>
              </div>

              <div className="form-field">
                <label className="form-label">
                  <Phone size={15} />
                  <span>Số điện thoại liên hệ</span>
                </label>
                <div
                  className={`form-input-box ${editMode ? "editing" : "readonly"}`}
                >
                  <div className="input-icon-pill">
                    <Phone size={16} />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    className="custom-input"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    placeholder={
                      editMode
                        ? "Nhập số điện thoại (ví dụ: 0901234567)"
                        : "Chưa cập nhật số điện thoại"
                    }
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="form-label">
                  <ShieldCheck size={15} />
                  <span>Vai trò tài khoản</span>
                </label>
                <div className="form-input-box readonly">
                  <div className="input-icon-pill">
                    <ShieldCheck size={16} />
                  </div>
                  <input
                    type="text"
                    className="custom-input"
                    value={
                      userInfo.role === "admin"
                        ? "Quản trị viên phòng khám"
                        : "Khách hàng khám bệnh"
                    }
                    disabled
                  />
                  <span
                    className={`input-role-pill ${
                      userInfo.role === "admin" ? "admin" : "client"
                    }`}
                  >
                    {userInfo.role === "admin" ? "Admin" : "Member"}
                  </span>
                </div>
              </div>
            </div>

            {editMode && (
              <div className="form-actions-bar">
                <button
                  type="button"
                  className="btn-secondary-action"
                  onClick={handleToggleEditMode}
                >
                  Hủy chỉnh sửa
                </button>
                <button
                  type="submit"
                  className="btn-primary-action"
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <>
                      <Save size={16} />
                      <span>Lưu thông tin</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </section>
      )}

      {/* ================= TAB 1: BẢO MẬT & MẬT KHẨU ================= */}
      {activeTab === 1 && (
        <div className="security-section">
          {/* Card 1: Change Password */}
          <section className="security-card-item">
            <div className="security-card-header">
              <div className="security-header-left">
                <div className="security-icon-bubble">
                  <Key size={22} />
                </div>
                <div>
                  <h2 className="card-title">Thay đổi mật khẩu</h2>
                  <p className="card-desc">
                    Nên sử dụng mật khẩu mạnh kết hợp chữ cái, số và ký tự đặc biệt
                  </p>
                </div>
              </div>
            </div>

            {submitError && (
              <div className="account-alert-error">
                <AlertTriangle size={18} />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleUpdatePassword}>
              <div className="form-field" style={{ marginBottom: "16px" }}>
                <label className="form-label">Mật khẩu hiện tại</label>
                <div className="form-input-box">
                  <Lock size={18} className="input-icon-start" />
                  <input
                    type={showPassword.current ? "text" : "password"}
                    name="currentPassword"
                    className="custom-input"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    placeholder="Nhập mật khẩu hiện tại"
                    required
                  />
                  <button
                    type="button"
                    className="input-icon-end"
                    onClick={() => handleTogglePasswordVisibility("current")}
                  >
                    {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-field">
                  <label className="form-label">Mật khẩu mới</label>
                  <div className="form-input-box">
                    <Key size={18} className="input-icon-start" />
                    <input
                      type={showPassword.new ? "text" : "password"}
                      name="newPassword"
                      className="custom-input"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      placeholder="Tối thiểu 8 ký tự"
                      required
                    />
                    <button
                      type="button"
                      className="input-icon-end"
                      onClick={() => handleTogglePasswordVisibility("new")}
                    >
                      {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="form-field">
                  <label className="form-label">Xác nhận mật khẩu mới</label>
                  <div className="form-input-box">
                    <Key size={18} className="input-icon-start" />
                    <input
                      type={showPassword.confirm ? "text" : "password"}
                      name="confirmPassword"
                      className="custom-input"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Nhập lại mật khẩu mới"
                      required
                    />
                    <button
                      type="button"
                      className="input-icon-end"
                      onClick={() => handleTogglePasswordVisibility("confirm")}
                    >
                      {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="password-requirements">
                <div
                  className={`req-item ${
                    formData.newPassword.length >= 8 ? "valid" : ""
                  }`}
                >
                  <CheckCircle2 size={14} />
                  <span>Độ dài tối thiểu từ 8 ký tự trở lên</span>
                </div>
                <div
                  className={`req-item ${
                    formData.newPassword &&
                    formData.newPassword === formData.confirmPassword
                      ? "valid"
                      : ""
                  }`}
                >
                  <CheckCircle2 size={14} />
                  <span>Mật khẩu xác nhận trùng khớp với mật khẩu mới</span>
                </div>
              </div>

              <div className="form-actions-bar">
                <button
                  type="submit"
                  className="btn-primary-action"
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <>
                      <Save size={16} />
                      <span>Cập nhật mật khẩu</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          {/* Card 2: 2FA Authentication */}
          <section className="security-card-item">
            <div className="security-card-header">
              <div className="security-header-left">
                <div className="security-icon-bubble">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h2 className="card-title">Xác thực hai lớp (2FA)</h2>
                  <p className="card-desc">
                    Bảo vệ an toàn tài khoản bằng mã bảo mật mỗi khi đăng nhập
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                {userInfo.require_2FA && (
                  <button
                    type="button"
                    className="btn-secondary-action"
                    onClick={() => setShow2FASetupModal(true)}
                    disabled={loading}
                    style={{ fontSize: "13px", padding: "8px 14px" }}
                  >
                    Xem lại mã QR
                  </button>
                )}

                <button
                  type="button"
                  className={
                    userInfo.require_2FA
                      ? "btn-secondary-action"
                      : "btn-primary-action"
                  }
                  onClick={handleToggle2FA}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : userInfo.require_2FA ? (
                    "Tắt xác thực 2 lớp"
                  ) : (
                    "Kích hoạt 2FA ngay"
                  )}
                </button>
              </div>
            </div>

            <p style={{ fontSize: "13.5px", color: "#64748b", margin: 0, lineHeight: 1.6 }}>
              Khi kích hoạt bảo mật hai lớp, mỗi lần đăng nhập hệ thống sẽ yêu cầu thêm mã xác thực từ email hoặc ứng dụng bảo mật nhằm ngăn chặn truy cập trái phép ngay cả khi mật khẩu của bạn bị lộ.
            </p>
          </section>
        </div>
      )}

      {/* ================= TAB 2: CÀI ĐẶT THÔNG BÁO ================= */}
      {activeTab === 2 && (
        <section className="account-card">
          <div className="card-header">
            <h2 className="card-title">Cài đặt thông báo & Nhắc hẹn</h2>
            <p className="card-desc">
              Quản lý các loại thông báo gửi qua email và tin nhắn điện thoại
            </p>
          </div>

          <div className="notification-list">
            <div className="notification-item">
              <div className="notification-info">
                <h4>Thông báo đặt lịch khám mới</h4>
                <p>
                  Nhận email và thông báo ngay khi lịch khám răng của bạn được xác nhận
                </p>
              </div>
              <label className="switch-label">
                <input
                  type="checkbox"
                  checked={notifications.newAppointment}
                  onChange={() => handleToggleNotification("newAppointment")}
                />
                <span className="switch-slider" />
              </label>
            </div>

            <div className="notification-item">
              <div className="notification-info">
                <h4>Nhắc nhở lịch hẹn trước 24 giờ</h4>
                <p>
                  Gửi thông báo nhắc bạn chuẩn bị thời gian đến phòng khám đúng giờ
                </p>
              </div>
              <label className="switch-label">
                <input
                  type="checkbox"
                  checked={notifications.reminder24h}
                  onChange={() => handleToggleNotification("reminder24h")}
                />
                <span className="switch-slider" />
              </label>
            </div>

            <div className="notification-item">
              <div className="notification-info">
                <h4>Cẩm nang nha khoa & Ưu đãi thành viên</h4>
                <p>
                  Nhận các bài viết kiến thức chăm sóc răng miệng và mã giảm giá dịch vụ
                </p>
              </div>
              <label className="switch-label">
                <input
                  type="checkbox"
                  checked={notifications.newsAndPromos}
                  onChange={() => handleToggleNotification("newsAndPromos")}
                />
                <span className="switch-slider" />
              </label>
            </div>
          </div>
        </section>
      )}

      {/* ================= TAB 3: QUẢN LÝ TÀI KHOẢN (DANGER ZONE) ================= */}
      {activeTab === 3 && (
        <section className="danger-zone-card">
          <div className="danger-header">
            <div className="danger-icon-bubble">
              <AlertTriangle size={20} />
            </div>
            <h3 className="danger-title">Vùng nguy hiểm: Xóa tài khoản</h3>
          </div>

          <p className="danger-desc">
            Khi bạn yêu cầu xóa tài khoản, tài khoản của bạn sẽ bị vô hiệu hóa
            vĩnh viễn. Toàn bộ thông tin lịch hẹn, hồ sơ điều trị nha khoa và lịch
            sử khám bệnh sẽ không thể truy cập lại. Hành động này không thể hoàn tác.
          </p>

          <button
            type="button"
            className="btn-danger-action"
            onClick={() => {
              setDeleteConfirmText("");
              setOpenDeleteDialog(true);
            }}
          >
            <Trash2 size={16} />
            <span>Xóa tài khoản vĩnh viễn</span>
          </button>
        </section>
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            p: 1,
            maxWidth: "460px",
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, color: "#ef4444", fontWeight: 700 }}>
          <AlertTriangle size={24} />
          <span>Xác nhận xóa tài khoản?</span>
        </DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ fontSize: "14px", color: "#475569", mb: 2 }}>
            Hành động này không thể hoàn tác. Để tiếp tục, vui lòng nhập chính xác từ <strong>DELETE</strong> vào ô bên dưới:
          </DialogContentText>

          <div
            className="form-input-box"
            style={{
              borderColor:
                deleteConfirmText && deleteConfirmText !== "DELETE"
                  ? "#ef4444"
                  : "#cbd5e1",
            }}
          >
            <input
              type="text"
              className="custom-input"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Nhập 'DELETE'"
              autoFocus
            />
          </div>
          {deleteConfirmText && deleteConfirmText !== "DELETE" && (
            <p style={{ color: "#ef4444", fontSize: "12px", margin: "6px 0 0" }}>
              Vui lòng nhập chính xác chữ hoa 'DELETE'
            </p>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <button
            type="button"
            className="btn-secondary-action"
            onClick={() => setOpenDeleteDialog(false)}
          >
            Hủy bỏ
          </button>

          <button
            type="button"
            className="btn-danger-action"
            disabled={deleteConfirmText !== "DELETE" || loading}
            onClick={handleDeleteAccount}
            style={{
              opacity: deleteConfirmText !== "DELETE" ? 0.5 : 1,
              cursor: deleteConfirmText !== "DELETE" ? "not-allowed" : "pointer",
            }}
          >
            {loading ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <>
                <Trash2 size={16} />
                <span>Xóa vĩnh viễn</span>
              </>
            )}
          </button>
        </DialogActions>
      </Dialog>

      <AvatarFullscreenModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        src={photoPreview || userInfo.photo || ""}
        name={userInfo.name || "Người dùng"}
        role={userInfo.role === "admin" ? "Quản trị viên" : "Khách hàng"}
        email={userInfo.email}
      />

      {show2FASetupModal && (
        <Require2FA
          user={userInfo}
          initialShowQR={true}
          handleSuccessVerify2FA={handleSuccessSetup2FA}
          onCancel={() => setShow2FASetupModal(false)}
        />
      )}
    </div>
  );
}

export default Account;
