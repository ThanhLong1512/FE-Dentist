import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Avatar,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Paper,
  Container,
  Divider,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from "@mui/material";

import {
  Save as SaveIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  AccountCircle as AccountCircleIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { handleGetMe, handleLogoutApi, handleUpdateMe } from "../apis";

const DEFAULT_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle fill='%23e2e8f0' cx='50' cy='50' r='50'/%3E%3Ccircle fill='%2394a3b8' cx='50' cy='38' r='18'/%3E%3Cellipse fill='%2394a3b8' cx='50' cy='88' rx='28' ry='24'/%3E%3C/svg%3E";

function Account() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    photo: "",
    role: "",
    require_2FA: false,
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const userData = await handleGetMe();
      setUserInfo({
        name: userData.name,
        email: userData.email,
        photo: userData.photo || DEFAULT_AVATAR,
        role: userData.role,
        require_2FA: userData.require_2FA || false,
      });
      setFormData({
        name: userData.name,
        email: userData.email,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      toast.error("Không thể tải thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleToggleEditMode = () => {
    setEditMode(!editMode);
    if (!editMode) {
      setFormData({
        ...formData,
        name: userInfo.name,
        email: userInfo.email,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setSubmitError("");
      setPhotoPreview(null);
      setPhotoFile(null);
    }
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file hình ảnh");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước file quá lớn. Vui lòng chọn file dưới 5MB");
        return;
      }

      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleTogglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setLoading(true);

    const formDataToSend = new FormData();
    let hasChanges = false;
    if (formData.name.trim() !== userInfo.name) {
      formDataToSend.append("name", formData.name.trim());
      hasChanges = true;
    }
    if (photoFile) {
      formDataToSend.append("photo", photoFile);
      hasChanges = true;
    }

    if (!hasChanges) {
      toast.info("Không có thông tin nào được thay đổi");
      setEditMode(false);
      setLoading(false);
      return;
    }

    for (let [key, value] of formDataToSend.entries()) {
      console.log(key, value);
    }

    try {
      const res = await handleUpdateMe(formDataToSend);
      toast.success("Cập nhật thông tin thành công");
      setEditMode(false);
      setPhotoPreview(null);
      setPhotoFile(null);
      const existingUserInfo = JSON.parse(localStorage.getItem("userInfo"));
      const updatedUserInfo = {
        ...existingUserInfo,
        image: res.photo,
      };
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
      await fetchUserData();
    } catch (err) {
      setSubmitError(
        err.response?.data?.message ||
          "Đã xảy ra lỗi khi cập nhật thông tin"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setLoading(true);

    if (!formData.currentPassword) {
      setSubmitError("Vui lòng nhập mật khẩu hiện tại");
      setLoading(false);
      return;
    }

    if (!formData.newPassword) {
      setSubmitError("Vui lòng nhập mật khẩu mới");
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 8) {
      setSubmitError("Mật khẩu mới phải có ít nhất 8 ký tự");
      setLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setSubmitError("Mật khẩu mới không khớp");
      setLoading(false);
      return;
    }

    const passwordData = {
      currentPassword: formData.currentPassword,
      password: formData.newPassword,
      passwordConfirm: formData.confirmPassword,
    };

    try {
      await handleUpdateMe(passwordData);
      toast.success("Cập nhật mật khẩu thành công");
      setEditMode(false);
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || "Đã xảy ra lỗi khi cập nhật mật khẩu"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      toast.error("Vui lòng nhập 'DELETE' để xác nhận");
      return;
    }
    setLoading(true);
    try {
      const data = { isLocked: true };
      await handleUpdateMe(data);
      toast.success("Tài khoản đã được xóa thành công");
      await handleLogoutApi();
      navigate("/");
    } catch {
      toast.error("Không thể xóa tài khoản");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !userInfo.name) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 0, mb: 2, px: { xs: 0 } }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} lg={3}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Box sx={{ position: "relative", mb: 2 }}>
                <Avatar
                  src={photoPreview || userInfo.photo || DEFAULT_AVATAR}
                  alt={userInfo.name}
                  sx={{ width: 140, height: 140, mb: 1 }}
                >
                  {!photoPreview && !userInfo.photo
                    ? (userInfo.name?.[0] || "?").toUpperCase()
                    : null}
                </Avatar>

                {editMode && (
                  <Box
                    component="label"
                    htmlFor="photo-upload"
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      backgroundColor: "primary.main",
                      borderRadius: "50%",
                      width: 36,
                      height: 36,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      "&:hover": { backgroundColor: "primary.dark" },
                    }}
                  >
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handlePhotoChange}
                    />
                    <PhotoCameraIcon sx={{ color: "white" }} />
                  </Box>
                )}
              </Box>

              <Typography
                variant="h5"
                fontWeight="bold"
                textAlign="center"
                sx={{ fontSize: "1.5rem" }}
              >
                {userInfo.name}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                textAlign="center"
                sx={{ mb: 2, fontSize: "1.1rem" }}
              >
                {userInfo.role === "user"
                  ? "Người dùng"
                  : userInfo.role === "admin"
                  ? "Quản trị viên"
                  : userInfo.role}
              </Typography>

              <Divider sx={{ width: "100%", my: 2 }} />

              <Box sx={{ width: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: "1rem" }}>
                    Email
                  </Typography>
                  <Typography variant="body2" fontWeight="medium" sx={{ fontSize: "1rem" }}>
                    {userInfo.email}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: "1rem" }}>
                    Xác thực 2 lớp
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="medium"
                    sx={{
                      fontSize: "1rem",
                      color: userInfo.require_2FA
                        ? "success.main"
                        : "error.main",
                    }}
                  >
                    {userInfo.require_2FA ? "Đã bật" : "Chưa bật"}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mt: 3, width: "100%" }}>
                {!editMode ? (
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={handleToggleEditMode}
                    sx={{ mb: 2, fontSize: "1rem", py: 1.5 }}
                  >
                    Chỉnh sửa thông tin
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    onClick={handleToggleEditMode}
                    sx={{ mb: 2, fontSize: "1rem", py: 1.5 }}
                  >
                    Hủy chỉnh sửa
                  </Button>
                )}

                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => setOpenDeleteDialog(true)}
                  sx={{ fontSize: "1rem", py: 1.5 }}
                >
                  Xóa tài khoản
                </Button>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={8} lg={9}>
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="account tabs"
                textColor="primary"
                indicatorColor="primary"
                sx={{ "& .MuiTab-root": { fontSize: "1.05rem", minHeight: 56 } }}
              >
                <Tab
                  icon={<AccountCircleIcon />}
                  iconPosition="start"
                  label="Thông tin cá nhân"
                  id="tab-0"
                />
                <Tab
                  icon={<SecurityIcon />}
                  iconPosition="start"
                  label="Bảo mật"
                  id="tab-1"
                />
                <Tab
                  icon={<NotificationsIcon />}
                  iconPosition="start"
                  label="Thông báo"
                  id="tab-2"
                />
              </Tabs>
            </Box>

            {activeTab === 0 && (
              <Box component="form" onSubmit={handleUpdateProfile} noValidate>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, fontSize: "1.35rem" }}>
                  Thông tin cá nhân
                </Typography>

                {submitError && (
                  <Alert severity="error" sx={{ mb: 3, "& .MuiAlert-message": { fontSize: "1rem" } }}>
                    {submitError}
                  </Alert>
                )}

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="name"
                      name="name"
                      label="Họ và tên"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="email"
                      name="email"
                      label="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={true}
                      required
                    />
                  </Grid>
                </Grid>

                {editMode && (
                  <Box
                    sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                      disabled={loading}
                      sx={{ fontSize: "1rem", py: 1.25, px: 2 }}
                    >
                      {loading ? (
                        <CircularProgress size={24} />
                      ) : (
                        "Lưu thay đổi"
                      )}
                    </Button>
                  </Box>
                )}
              </Box>
            )}

            {activeTab === 1 && (
              <Box component="form" onSubmit={handleUpdatePassword} noValidate>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, fontSize: "1.35rem" }}>
                  Thay đổi mật khẩu
                </Typography>

                {submitError && (
                  <Alert severity="error" sx={{ mb: 3, "& .MuiAlert-message": { fontSize: "1rem" } }}>
                    {submitError}
                  </Alert>
                )}

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="currentPassword"
                      name="currentPassword"
                      label="Mật khẩu hiện tại"
                      type={showPassword.current ? "text" : "password"}
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      sx={{
                        "& .MuiInputBase-input": { fontSize: "1.05rem" },
                        "& .MuiInputLabel-root": { fontSize: "1.05rem" },
                      }}
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            onClick={() =>
                              handleTogglePasswordVisibility("current")
                            }
                            edge="end"
                            disabled={!editMode}
                          >
                            {showPassword.current ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="newPassword"
                      name="newPassword"
                      label="Mật khẩu mới"
                      type={showPassword.new ? "text" : "password"}
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      sx={{
                        "& .MuiInputBase-input": { fontSize: "1.05rem" },
                        "& .MuiInputLabel-root": { fontSize: "1.05rem" },
                      }}
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            onClick={() =>
                              handleTogglePasswordVisibility("new")
                            }
                            edge="end"
                            disabled={!editMode}
                          >
                            {showPassword.new ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="confirmPassword"
                      name="confirmPassword"
                      label="Xác nhận mật khẩu mới"
                      type={showPassword.confirm ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      sx={{
                        "& .MuiInputBase-input": { fontSize: "1.05rem" },
                        "& .MuiInputLabel-root": { fontSize: "1.05rem" },
                      }}
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            onClick={() =>
                              handleTogglePasswordVisibility("confirm")
                            }
                            edge="end"
                            disabled={!editMode}
                          >
                            {showPassword.confirm ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                {editMode && (
                  <Box
                    sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                      disabled={loading}
                      sx={{ fontSize: "1rem", py: 1.25, px: 2 }}
                    >
                      {loading ? (
                        <CircularProgress size={24} />
                      ) : (
                        "Cập nhật mật khẩu"
                      )}
                    </Button>
                  </Box>
                )}

                <Divider sx={{ my: 4 }} />

                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, fontSize: "1.35rem" }}>
                  Bảo mật hai lớp (2FA)
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1" fontWeight="medium" sx={{ fontSize: "1.1rem" }}>
                      Xác thực hai lớp
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: "1rem" }}>
                      Bảo vệ tài khoản của bạn bằng xác thực bổ sung mỗi khi
                      đăng nhập
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color={userInfo.require_2FA ? "error" : "primary"}
                    sx={{ fontSize: "1rem", py: 1.25, px: 2 }}
                  >
                    {userInfo.require_2FA ? "Tắt 2FA" : "Bật 2FA"}
                  </Button>
                </Box>
              </Box>
            )}

            {activeTab === 2 && (
              <Box>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, fontSize: "1.35rem" }}>
                  Cài đặt thông báo
                </Typography>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 4, fontSize: "1.05rem" }}
                >
                  Quản lý cách bạn nhận thông báo và cập nhật từ hệ thống
                </Typography>

                <Box
                  sx={{
                    p: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="medium"
                    sx={{ mb: 2, fontSize: "1.1rem" }}
                  >
                    Thông báo qua email
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          py: 1.5,
                        }}
                      >
                        <Typography variant="body2" sx={{ fontSize: "1rem" }}>Lịch hẹn mới</Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ minWidth: 100, fontSize: "0.95rem" }}
                        >
                          Bật
                        </Button>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                    </Grid>

                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          py: 1.5,
                        }}
                      >
                        <Typography variant="body2" sx={{ fontSize: "1rem" }}>
                          Cập nhật lịch hẹn
                        </Typography>
                        <Button
                          variant="outlined"
                          color="primary"
                          sx={{ minWidth: 100, fontSize: "0.95rem" }}
                        >
                          Tắt
                        </Button>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                    </Grid>

                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          py: 1.5,
                        }}
                      >
                        <Typography variant="body2" sx={{ fontSize: "1rem" }}>
                          Tin tức và cập nhật
                        </Typography>
                        <Button
                          variant="outlined"
                          color="primary"
                          sx={{ minWidth: 100, fontSize: "0.95rem" }}
                        >
                          Tắt
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{
          sx: {
            "& .MuiDialogTitle-root": { fontSize: "1.35rem" },
            "& .MuiDialogContentText-root": { fontSize: "1.05rem" },
            "& .MuiInputBase-input": { fontSize: "1.05rem" },
            "& .MuiInputLabel-root": { fontSize: "1.05rem" },
            "& .MuiFormHelperText-root": { fontSize: "0.95rem" },
            "& .MuiButton-root": { fontSize: "1rem" },
          },
        }}
      >
        <DialogTitle sx={{ color: "error.main", fontSize: "1.35rem" }}>Xóa tài khoản?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: "1.05rem" }}>
            Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể khôi
            phục. Tất cả dữ liệu, bao gồm lịch sử đặt lịch và thông tin cá nhân
            sẽ bị xóa vĩnh viễn.
          </DialogContentText>
          <Box sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Nhập 'DELETE' để xác nhận"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              variant="outlined"
              autoFocus
              error={deleteConfirmText !== "" && deleteConfirmText !== "DELETE"}
              helperText={
                deleteConfirmText !== "" && deleteConfirmText !== "DELETE"
                  ? "Vui lòng nhập chính xác 'DELETE'"
                  : ""
              }
              sx={{
                "& .MuiInputBase-input": { fontSize: "1.05rem" },
                "& .MuiInputLabel-root": { fontSize: "1.05rem" },
                "& .MuiFormHelperText-root": { fontSize: "0.95rem" },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenDeleteDialog(false)} sx={{ fontSize: "1rem" }}>Hủy</Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            disabled={deleteConfirmText !== "DELETE" || loading}
            startIcon={
              loading ? <CircularProgress size={20} /> : <DeleteIcon />
            }
            sx={{ fontSize: "1rem" }}
          >
            Xóa tài khoản
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Account;
