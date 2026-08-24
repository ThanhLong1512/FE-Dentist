# 🦷 FE-Dentist

Hệ thống quản lý phòng khám nha khoa — Frontend được xây dựng bằng **React 18 + Vite 4**, gồm 2 phần chính:

- **Website khách hàng**: giới thiệu dịch vụ, đặt lịch hẹn, mua sắm, thanh toán online.
- **Trang quản trị (Admin)**: dashboard, quản lý bệnh nhân / dịch vụ / ca làm việc / nhân viên / lịch hẹn / đơn hàng / tài khoản.

> ⚠️ README này được viết lại dựa trên cấu trúc mã nguồn thực tế của dự án (thay cho README mặc định của template Vite).

---

## 🛠️ Công nghệ sử dụng

| Nhóm | Công nghệ |
|---|---|
| **Core** | React 18, Vite 4, JavaScript (JSX) |
| **Routing** | React Router v6 (lazy-load theo route) |
| **State / Data** | Redux Toolkit, TanStack React Query |
| **Auth** | Auth0, Google OAuth, Facebook SDK, JWT + refresh token, 2FA (QR code / OTP) |
| **UI** | MUI, Bootstrap 5, TailwindCSS, react-hook-form, react-select, swiper |
| **Biểu đồ** | Recharts |
| **Realtime** | Socket.IO client (chat) |
| **Thanh toán** | MoMo, ZaloPay, VNPay, COD |
| **Đa ngôn ngữ** | i18n tự viết (Context) — Việt / Anh |
| **CI/CD** | GitHub Actions + Docker + Nginx |

---

## ✨ Tính năng chính

### Website khách hàng
- Trang chủ giới thiệu (banner, dịch vụ, đội ngũ, tin tức, đánh giá...)
- **Đặt lịch hẹn** theo slot khả dụng (chọn ngày → dịch vụ → nhân viên → ca trống)
- **Shop dịch vụ**: xem chi tiết, thêm vào giỏ hàng
- **Thanh toán** online: MoMo / ZaloPay / VNPay / COD
- **Tài khoản cá nhân**: hồ sơ, lịch sử lịch hẹn, đơn hàng, đánh giá dịch vụ
- **Chat hỗ trợ** realtime với admin
- Đăng ký / đăng nhập (email + mật khẩu, Google, Facebook), quên mật khẩu, bảo mật **2FA**

### Trang quản trị (`/admin`)
- **Dashboard**: thống kê doanh thu, số lịch hẹn, đánh giá theo kỳ; biểu đồ
- **Quản lý**: Bệnh nhân, Dịch vụ, Ca làm việc, Nhân viên, Lịch hẹn, Đơn hàng, Tài khoản, Cơ sở vật chất, Cài đặt
- CRUD đầy đủ + nhân bản (duplicate), tìm kiếm, phân trang
- **Chat** quản trị viên ↔ khách hàng

---

## 🗂️ Cấu trúc thư mục

```
src/
├── main.jsx                  # Entry point (bọc Redux, Auth0, Google OAuth)
├── App.jsx                   # Định nghĩa routes + QueryClient + Context
├── apis/                     # Tầng gọi API (axios)
│   ├── index.js              # ~60 hàm API: auth, users, services, orders, payments...
│   └── appointmentApi.js     # Logic lịch hẹn (hold / cancel / reschedule)
├── components/               # UI dùng chung
│   ├── admin/                # Components quản trị (Button, Table, Modal, Spinner...)
│   └── *.jsx                 # Header, Footer, Chat, OTP, 2FA, Home sections...
├── features/                 # Logic + hook theo module
│   ├── account/              # Tài khoản
│   ├── appointment/          # Lịch hẹn
│   ├── authentication/       # Đăng nhập / đăng xuất
│   ├── booking/              # Đặt lịch
│   ├── dashboard/            # Thống kê, biểu đồ
│   ├── employee/  order/  patient/  services/  shift/
├── pages/                    # Trang client (Home, Shop, Cart, Checkout, Login...)
│   └── admin/                # Trang quản trị
├── context/                  # DarkModeContext, LanguageContext
├── hooks/                    # useLocalStorageState, useOutsideClick, useMoveBack...
├── locales/                  # vi.js, en.js (bản dịch)
├── redux/store.js            # Redux store
├── utils/                    # constants, authorizedAxios, authStorage, helpers
└── styles/                   # GlobalStyles (theme dark/light)
```

---

## 🚀 Chạy dự án

### Yêu cầu
- Node.js ≥ 18
- npm

### Cài đặt & chạy dev

```bash
npm install
npm run dev        # http://localhost:5173
```

### Build cho production

```bash
npm run build      # output vào thư mục dist/
npm run preview    # xem thử bản build
```

### Kiểm tra code

```bash
npm run lint
```

---

## ⚙️ Cấu hình (biến môi trường)

Toàn bộ cấu hình được quản lý qua **file `.env`** (Vite sử dụng tiền tố `VITE_`), không còn khai báo cứng trong mã nguồn.

### Bước 1 — Tạo file `.env`

```bash
cp .env.example .env
```

Sau đó mở `.env` và điền giá trị thật của bạn:

| Biến | Mô tả |
|---|---|
| `VITE_API_ROOT` | URL backend REST API |
| `VITE_SOCKET_URL` | URL Socket.IO server cho chat |
| `VITE_ADMIN_ID` | ID tài khoản admin |
| `VITE_GOOGLE_MAP_API_KEY` | Key Google Maps |
| `VITE_DOMAIN_AUTH0` / `VITE_CLIENT_ID_AUTH0` | Cấu hình Auth0 |
| `VITE_REACT_GOOGLE_CLIENT_ID` | Client ID Google OAuth |
| `VITE_FACEBOOK_APP_ID` | App ID Facebook (đăng nhập Facebook) |

### ⚠️ Bảo mật

- **`.env` đã nằm trong `.gitignore`** — KHÔNG BAO GIỜ commit file này lên git.
- **`.env.example`** là bản mẫu trống (chỉ chứa placeholder), được phép commit.
- `config.json` cũng đã được thêm vào `.gitignore` (chứa cấu hình môi trường cục bộ).

### Cách hoạt động

- `src/utils/constants.js` đọc giá trị qua `import.meta.env.VITE_*`.
- Sau khi thay đổi `.env`, **khởi động lại** server dev (`npm run dev`) để áp dụng.

### Token & xác thực (`src/utils/authorizedAxios.js`)
- Interceptor tự gắn `Authorization: Bearer <token>`.
- Nhận mã lỗi **410** → tự động gọi refresh token rồi gửi lại request.
- Nhận mã lỗi **401** → toast thông báo + chuyển về `/login`.

---

## 🐳 Docker & CI/CD

### Build image (truyền biến môi trường qua build-arg)

Các biến `VITE_*` được đưa vào build qua `--build-arg`, **không** copy file `.env` vào image:

```bash
docker build -t fe-dentist \
  --build-arg VITE_API_ROOT='http://localhost:8080' \
  --build-arg VITE_SOCKET_URL='http://localhost:8090' \
  --build-arg VITE_ADMIN_ID='your-admin-id' \
  --build-arg VITE_DOMAIN_AUTH0='your-domain.auth0.com' \
  --build-arg VITE_CLIENT_ID_AUTH0='your-client-id' \
  --build-arg VITE_REACT_GOOGLE_CLIENT_ID='your-google-client-id' \
  --build-arg VITE_GOOGLE_MAP_API_KEY='your-maps-key' \
  --build-arg VITE_FACEBOOK_APP_ID='your-fb-app-id' \
  .
```

- Giai đoạn **build**: `node:18` chạy `npm install --legacy-peer-deps && npm run build`.
- Giai đoạn **runtime**: `nginx:1.23-alpine` phục vụ thư mục `dist/` trên cổng `80`.

### Chạy container

```bash
docker run -d -p 5173:80 --name fe-dentist fe-dentist
```

### CI/CD (`.github/workflows/cicd.yml`)
Khi push lên nhánh `master`, workflow tự động:
1. **Build** image Docker (lấy biến `VITE_*` từ GitHub **secrets**) và push lên Docker Hub.
2. **Deploy** trên runner self-hosted: pull image → xóa container cũ → chạy container mới (cổng `5173:80`).

> Cần khai báo các secrets trong GitHub: `DOCKER_USERNAME`, `DOCKER_PASSWORD`, và `VITE_API_ROOT`, `VITE_SOCKET_URL`, `VITE_ADMIN_ID`, `VITE_DOMAIN_AUTH0`, `VITE_CLIENT_ID_AUTH0`, `VITE_REACT_GOOGLE_CLIENT_ID`, `VITE_GOOGLE_MAP_API_KEY`, `VITE_FACEBOOK_APP_ID`.

---

## 🔑 Nhóm quyền / Route chính

| Route | Mô tả |
|---|---|
| `/home` | Trang chủ |
| `/shop` `/shop/:ServiceID` | Danh sách / chi tiết dịch vụ |
| `/booking` | Đặt lịch hẹn |
| `/cart` `/checkout` | Giỏ hàng & thanh toán |
| `/appointment/checkout` | Thanh toán lịch hẹn |
| `/account/profile` `/appointments` `/orders` | Khu vực cá nhân |
| `/admin/dashboard` ... `/admin/settings` | Trang quản trị |

---

## 📝 Ghi chú

- Redux store hiện tại rỗng (`reducer: {}`) — dữ liệu chủ yếu dùng **React Query** và **Context API**.
- Giao diện được viết chủ yếu bằng tiếng Việt, hỗ trợ chuyển đổi ngôn ngữ **Vi/En** qua `LanguageContext`.
- Hỗ trợ **dark mode** lưu vào `localStorage`.
