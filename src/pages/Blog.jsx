import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Search,
  Calendar,
  Clock,
  User,
  ArrowRight,
  Bookmark,
  Share2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  CalendarCheck,
  Send,
  X,
  Tag,
  CheckCircle2,
} from "lucide-react";
import "./Blog.css";

const BLOG_ARTICLES = [
  {
    id: 1,
    title: "Cấy Ghép Implant: Tỷ Lệ Thành Công 98% Và 5 Lưu Ý Vàng Cho Bệnh Nhân",
    slug: "cay-ghep-implant-ty-le-thanh-cong",
    category: "Cấy ghép Implant",
    tag: "Implant",
    author: "BS. CKI Nguyễn Văn Long",
    date: "15 Tháng 9, 2026",
    readTime: "5 phút đọc",
    image: "/images/resource/blog-1.jpg",
    excerpt:
      "Tìm hiểu công nghệ cấy ghép Implant tức thì, tiêu chuẩn phòng phẫu thuật vô trùng áp lực dương và chế độ chăm sóc để trụ tích hợp xương bền vững trọn đời.",
    content: `
      Cấy ghép Implant hiện nay được xem là giải pháp phục hình răng đã mất tiên tiến và tối ưu nhất. Với công nghệ hiện đại tại Cheese Clinic, tỷ lệ thành công đạt trên 98%.

      ### 1. Tại sao nên chọn phục hình Implant?
      Khác với cầu răng sứ hay hàm tháo lắp, trụ Implant thay thế hoàn hảo cả chân răng và thân răng, giúp ngăn chặn hiện tượng tiêu xương hàm, giữ vững cơ mặt và phục hồi 100% lực ăn nhai.

      ### 2. Tiêu chuẩn vô trùng khắt khe
      Tại Cheese Clinic, toàn bộ quy trình cấy ghép được thực hiện trong phòng mổ vô trùng một chiều, trang thiết bị nhập khẩu từ Thụy Sĩ và Đức. Mọi dụng cụ phẫu thuật đều được xử lý hấp sấy kép đạt chuẩn FDA.

      ### 3. Những lưu ý quan trọng sau phẫu thuật
      - Cắn chặt gạc cầm máu trong 30-45 phút đầu.
      - Chườm lạnh vùng má trong 24 giờ đầu để giảm sưng nhẹ.
      - Tránh súc miệng bằng nước muối tự pha hoặc khạc nhổ mạnh trong ngày đầu tiên.
      - Tuân thủ lịch tái khám định kỳ để bác sĩ chụp phim kiểm tra độ tích hợp xương.
    `,
  },
  {
    id: 2,
    title: "Niềng Răng Trong Suốt Invisalign: Lựa Chọn Đẳng Cấp Cho Nụ Cười Hoàn Hảo",
    slug: "nieng-rang-invisalign-lua-chon-dang-cap",
    category: "Niềng răng thẩm mỹ",
    tag: "Invisalign",
    author: "BS. Trần Thảo Vy",
    date: "12 Tháng 9, 2026",
    readTime: "6 phút đọc",
    image: "/images/resource/blog-2.jpg",
    excerpt:
      "Khay niềng gần như vô hình, nhẹ nhàng ôm sát cung răng, dễ dàng tháo lắp khi ăn uống. Xem ngay quy trình quét dấu răng 3D iTero Lumina thế hệ mới.",
    content: `
      Niềng răng trong suốt Invisalign là bước đột phá trong chỉnh nha hiện đại. Bạn hoàn toàn có thể tự tin giao tiếp, thuyết trình hay chụp ảnh mà không lo lộ mắc cài kim loại.

      ### 1. Công nghệ quét dấu 3D iTero Lumina
      Tại Cheese Clinic, bạn sẽ được nhìn thấy trước kết quả dịch chuyển của hàm răng qua phần mềm ClinCheck chỉ sau 5 phút quét dấu quang học, chuẩn xác đến từng micromet.

      ### 2. Ưu điểm vượt trội
      - **Thẩm mỹ tối đa:** Khay trong suốt SmartTrack chế tác riêng biệt ôm sát viền nướu.
      - **Thuận tiện ăn uống & vệ sinh:** Dễ dàng tháo rời trước mỗi bữa ăn và vệ sinh răng miệng thông thường.
      - **Ít đau nhức:** Lực tác động sinh học dàn đều, hạn chế cọ xát niêm mạc miệng.

      ### 3. Thời gian điều trị
      Tùy thuộc vào mức độ chen chúc, khớp cắn ngược hay hô vẩu, thời gian đeo khay trung bình kéo dài từ 9 đến 18 tháng với hiệu quả bền vững lâu dài.
    `,
  },
  {
    id: 3,
    title: "Dán Sứ Veneer Siêu Mỏng: Giải Pháp Thẩm Mỹ Bảo Tồn 100% Răng Thật",
    slug: "dan-su-veneer-bao-ton-rang-that",
    category: "Bọc răng sứ",
    tag: "Răng sứ",
    author: "ThS. BS Hoàng Minh Nhật",
    date: "08 Tháng 9, 2026",
    readTime: "4 phút đọc",
    image: "/images/resource/blog-3.jpg",
    excerpt:
      "Mặt dán sứ thủy tinh với độ dày chỉ từ 0.2mm - 0.5mm, không xâm lấn tủy răng, chịu lực gấp 5 lần răng sinh học và lưu giữ màu sắc trong suốt tự nhiên.",
    content: `
      Nếu bạn tự ti vì hàm răng xỉn màu do nhiễm kháng sinh, thưa kẽ nhẹ hoặc sứt mẻ rìa cắn, mặt dán sứ Veneer chính là 'chân ái' giúp bạn lấy lại nụ cười rạng rỡ.

      ### 1. Mặt sứ siêu mỏng chỉ 0.2 - 0.5mm
      Bác sĩ chỉ cần làm nhám một lớp men răng siêu mỏng mặt ngoài để tạo độ bám dính mà hoàn toàn không xâm lấn mô răng lành hay ảnh hưởng đến tủy sống.

      ### 2. Độ cứng và độ thấu quang tự nhiên
      Được đúc từ khối sứ tinh thể nguyên chất E.max hoặc Lisi Press, mặt dán sứ có độ vân trong, khúc xạ ánh sáng tự nhiên như răng thật và khả năng chịu lực lên tới 400 - 500 MPa.

      ### 3. Tuổi thọ của mặt dán sứ
      Nếu được chăm sóc tốt và sử dụng chỉ nha khoa đúng cách, mặt dán sứ Veneer có độ bền lên tới 15 - 20 năm mà không bị ố vàng hay bong tróc.
    `,
  },
  {
    id: 4,
    title: "Thời Điểm Vàng Nên Nhổ Răng Khôn Tránh Biến Chứng Nguy Hiểm",
    slug: "thoi-diem-vang-nho-rang-khon",
    category: "Nha khoa tổng quát",
    tag: "Răng khôn",
    author: "BS. Lê Hồng Sơn",
    date: "03 Tháng 9, 2026",
    readTime: "5 phút đọc",
    image: "/images/resource/blog-4.jpg",
    excerpt:
      "Răng khôn mọc ngầm, mọc lệch gây tiêu xương răng số 7 và xô lệch hàm. Tìm hiểu công nghệ sóng siêu âm Piezotome nhổ răng nhẹ êm, mau lành thương.",
    content: `
      Răng số 8 (răng khôn) thường mọc trong độ tuổi từ 17 - 25, thời điểm cung hàm đã phát triển hoàn thiện và không còn đủ khoảng trống để răng mọc thẳng hàng.

      ### 1. Những nguy cơ khi giữ lại răng khôn mọc lệch
      - Nhồi nhét thức ăn gây viêm lợi trùm, sưng má và nhiễm trùng tái phát.
      - Làm hỏng chân răng kế cận (răng số 7 - răng ăn nhai quan trọng nhất).
      - Xô lệch cả cung hàm phía trước do lực đẩy của mầm răng.

      ### 2. Công nghệ nhổ răng siêu âm Piezotome
      Cheese Clinic ứng dụng công nghệ Piezotome sử dụng sóng siêu âm cao tần làm đứt dây chằng quanh răng một cách nhẹ nhàng, không gây sang chấn xương hàm, thời gian nhổ chỉ từ 10 - 15 phút.
    `,
  },
  {
    id: 5,
    title: "Laser Whitening: Tẩy Trắng Răng Bật 3 - 5 Tông Không Lo Ê Buốt Men Răng",
    slug: "laser-whitening-tay-trang-rang-an-toan",
    category: "Chăm sóc nụ cười",
    tag: "Tẩy trắng",
    author: "BS. CKI Nguyễn Văn Long",
    date: "28 Tháng 8, 2026",
    readTime: "4 phút đọc",
    image: "/images/resource/blog-5.jpg",
    excerpt:
      "Tạm biệt răng ố vàng do trà, cà phê hay thói quen sinh hoạt. Cơ chế kích hoạt phân tử thuốc tẩy bằng tia Laser lạnh an toàn tuyệt đối cho men răng.",
    content: `
      Hàm răng trắng sáng rạng rỡ mang lại sự tự tin rất lớn trong công việc và các mối quan hệ xã hội. Công nghệ Laser Whitening tại Cheese Clinic là giải pháp nhanh chóng và an toàn nhất hiện nay.

      ### 1. Cơ chế hoạt động của Laser Whitening
      Gel tẩy trắng chứa peroxide nồng độ an toàn kết hợp với bước sóng laser lạnh kích thích giải phóng oxy nguyên tử, đi sâu vào cấu trúc men răng để cắt đứt chuỗi màu hữu cơ gây ố vàng.

      ### 2. Ưu điểm nổi bật
      - Bật từ 3 đến 5 tông màu chỉ sau 45 - 60 phút thực hiện.
      - Chứa khoáng chất Fluoride giúp tái khoáng men răng, hạn chế tối đa cảm giác ê buốt.
      - Giữ màu trắng sáng bền đẹp từ 2 - 3 năm khi kết hợp chế độ vệ sinh hợp lý.
    `,
  },
  {
    id: 6,
    title: "Nha Khoa Trẻ Em: Bảo Vệ Răng Sữa - Nền Tảng Cho Hàm Răng Vĩnh Viễn Đẹp",
    slug: "nha-khoa-tre-em-bao-ve-rang-sua",
    category: "Nha khoa tổng quát",
    tag: "Trẻ em",
    author: "BS. Trần Thảo Vy",
    date: "20 Tháng 8, 2026",
    readTime: "5 phút đọc",
    image: "/images/resource/blog-6.jpg",
    excerpt:
      "Răng sữa định hướng cho răng vĩnh viễn mọc đúng vị trí. Hướng dẫn bôi Vecni Fluor ngừa sâu răng và phương pháp tập cho trẻ thích đi khám nha khoa.",
    content: `
      Nhiều phụ huynh quan niệm 'răng sữa rồi cũng thay nên không cần chăm sóc kỹ'. Đây là một hiểu lầm cực kỳ tai hại ảnh hưởng trực tiếp đến thẩm mỹ và chức năng nhai của trẻ.

      ### 1. Vai trò của răng sữa
      Răng sữa không chỉ giúp bé nhai nghiền thức ăn và phát âm chuẩn xác mà còn giữ khoảng cho mầm răng vĩnh viễn phát triển bên dưới xương hàm. Nếu mất răng sữa sớm, răng vĩnh viễn rất dễ mọc khấp khểnh, mọc lệch.

      ### 2. Các dịch vụ nha khoa dự phòng cho trẻ
      - **Bôi Vecni Fluor:** Tạo lớp màng bảo vệ men răng chống lại axit vi khuẩn.
      - **Trám bít hố rãnh:** Ngăn ngừa sâu răng sớm ở các răng hàm ăn nhai.
      - **Tiền chỉnh nha silicon:** Can thiệp sớm các tật xấu như mút ngón tay, thở miệng.
    `,
  },
];

const CATEGORIES = [
  { name: "Tất cả", count: 6 },
  { name: "Cấy ghép Implant", count: 1 },
  { name: "Niềng răng thẩm mỹ", count: 1 },
  { name: "Bọc răng sứ", count: 1 },
  { name: "Nha khoa tổng quát", count: 2 },
  { name: "Chăm sóc nụ cười", count: 1 },
];

const POPULAR_POSTS = [
  {
    id: 1,
    title: "Cấy Ghép Implant: Tỷ Lệ Thành Công 98% Và Lưu Ý Vàng Cho Bệnh Nhân",
    date: "15 Tháng 9, 2026",
    image: "/images/resource/post-thumb-1.jpg",
  },
  {
    id: 2,
    title: "Niềng Răng Trong Suốt Invisalign: Lựa Chọn Đẳng Cấp Cho Nụ Cười",
    date: "12 Tháng 9, 2026",
    image: "/images/resource/post-thumb-2.jpg",
  },
  {
    id: 3,
    title: "Dán Sứ Veneer Siêu Mỏng: Bảo Tồn 100% Răng Thật Tự Nhiên",
    date: "08 Tháng 9, 2026",
    image: "/images/resource/post-thumb-3.jpg",
  },
];

const POPULAR_TAGS = [
  "Implant",
  "Invisalign",
  "Răng sứ",
  "Răng khôn",
  "Tẩy trắng",
  "Trẻ em",
  "Nha khoa kỹ thuật cao",
  "Vệ sinh răng miệng",
];

const POSTS_PER_PAGE = 4;

export default function Blog() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [activeTag, setActiveTag] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");

  // Filter articles based on category, tag, and search query
  const filteredArticles = useMemo(() => {
    return BLOG_ARTICLES.filter((article) => {
      const matchCategory =
        activeCategory === "Tất cả" || article.category === activeCategory;
      const matchTag = !activeTag || article.tag === activeTag;
      const matchSearch =
        !searchTerm.trim() ||
        article.title.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        article.category.toLowerCase().includes(searchTerm.toLowerCase().trim());

      return matchCategory && matchTag && matchSearch;
    });
  }, [activeCategory, activeTag, searchTerm]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredArticles.length / POSTS_PER_PAGE) || 1;
  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredArticles.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [filteredArticles, currentPage]);

  const handleCategorySelect = (categoryName) => {
    setActiveCategory(categoryName);
    setActiveTag("");
    setCurrentPage(1);
  };

  const handleTagSelect = (tagName) => {
    if (activeTag === tagName) {
      setActiveTag("");
    } else {
      setActiveTag(tagName);
      setActiveCategory("Tất cả");
    }
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setActiveCategory("Tất cả");
    setActiveTag("");
    setCurrentPage(1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) {
      toast.warn("Vui lòng nhập địa chỉ email của bạn!");
      return;
    }
    toast.success("Đăng ký nhận bản tin thành công! Cảm ơn bạn đã đồng hành cùng Cheese Clinic.");
    setNewsletterEmail("");
  };

  const handleShare = (article, e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator
        .share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      toast.success("Đã sao chép liên kết bài viết vào khay nhớ tạm!");
    }
  };

  return (
    <div className="blog-page-wrapper">
      {/* ================= HERO BANNER ================= */}
      <section className="blog-hero-section">
        <div className="blog-hero-ambient ambient-1" />
        <div className="blog-hero-ambient ambient-2" />

        <div className="blog-hero-inner">
          <div className="blog-hero-badge">
            <Sparkles size={16} />
            <span>Cẩm Nang Kiến Thức Y Khoa</span>
          </div>

          <h1 className="blog-hero-title">
            Kiến Thức Nha Khoa Kỹ Thuật Cao & Tin Tức Sức Khỏe Nụ Cười
          </h1>

          <p className="blog-hero-subtitle">
            Cập nhật những giải pháp điều trị nha khoa chuẩn quốc tế, kinh nghiệm
            chăm sóc răng miệng và công nghệ nha khoa tiên tiến cùng đội ngũ bác
            sĩ chuyên khoa tại Cheese Clinic.
          </p>

          {/* Quick Search */}
          <div className="blog-hero-search-box">
            <form onSubmit={handleSearchSubmit} className="blog-hero-search-form">
              <span className="blog-hero-search-icon">
                <Search size={20} />
              </span>
              <input
                type="text"
                className="blog-hero-search-input"
                placeholder="Tìm kiếm bài viết, chủ đề (Implant, niềng răng, bọc sứ...)..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="blog-search-clear-btn"
                  onClick={() => setSearchTerm("")}
                  title="Xóa tìm kiếm"
                >
                  <X size={18} />
                </button>
              )}
              <button type="submit" className="blog-hero-search-btn">
                Tìm kiếm
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <div className="blog-content-container">
        {/* Category Pills Bar */}
        <div className="blog-category-bar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              type="button"
              className={`blog-cat-pill ${
                activeCategory === cat.name ? "active" : ""
              }`}
              onClick={() => handleCategorySelect(cat.name)}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Active Filter Notification */}
        {(activeCategory !== "Tất cả" || activeTag || searchTerm) && (
          <div className="blog-filter-status">
            <span>
              Đang lọc theo:{" "}
              <strong>
                {searchTerm && `"${searchTerm}" `}
                {activeCategory !== "Tất cả" && `[Chuyên mục: ${activeCategory}] `}
                {activeTag && `[Tag: ${activeTag}]`}
              </strong>{" "}
              ({filteredArticles.length} bài viết)
            </span>
            <button
              type="button"
              className="blog-filter-clear-link"
              onClick={handleClearFilters}
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        )}

        <div className="blog-main-grid">
          {/* ================= CỘT TRÁI: DANH SÁCH BÀI VIẾT ================= */}
          <div className="blog-articles-column">
            {paginatedArticles.length > 0 ? (
              <div className="blog-cards-grid">
                {paginatedArticles.map((article) => (
                  <article key={article.id} className="blog-card">
                    <div
                      className="blog-card-thumb-wrap"
                      onClick={() => setSelectedArticle(article)}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={article.image}
                        alt={article.title}
                        className="blog-card-img"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80";
                        }}
                      />
                      <span className="blog-card-cat-badge">
                        {article.category}
                      </span>
                    </div>

                    <div className="blog-card-body">
                      <div className="blog-card-meta">
                        <span className="blog-meta-item">
                          <User size={14} />
                          <span>{article.author}</span>
                        </span>
                        <span className="blog-meta-item">
                          <Calendar size={14} />
                          <span>{article.date}</span>
                        </span>
                        <span className="blog-meta-item">
                          <Clock size={14} />
                          <span>{article.readTime}</span>
                        </span>
                      </div>

                      <h3
                        className="blog-card-title"
                        onClick={() => setSelectedArticle(article)}
                        title={article.title}
                      >
                        {article.title}
                      </h3>

                      <p className="blog-card-excerpt">{article.excerpt}</p>

                      <div className="blog-card-footer">
                        <button
                          type="button"
                          className="blog-read-more-btn"
                          onClick={() => setSelectedArticle(article)}
                        >
                          <span>Xem chi tiết</span>
                          <ArrowRight size={16} />
                        </button>

                        <button
                          type="button"
                          className="blog-card-share-btn"
                          onClick={(e) => handleShare(article, e)}
                          title="Chia sẻ bài viết"
                        >
                          <Share2 size={16} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="blog-empty-state">
                <div className="blog-empty-icon">
                  <Search size={32} />
                </div>
                <h3>Không tìm thấy bài viết nào</h3>
                <p>
                  Hãy thử tìm kiếm với từ khóa khác hoặc xóa các bộ lọc đang chọn.
                </p>
                <button
                  type="button"
                  className="blog-reset-filter-btn"
                  onClick={handleClearFilters}
                >
                  Xem tất cả bài viết
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="blog-pagination-wrapper">
                <button
                  type="button"
                  className="blog-page-btn"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  title="Trang trước"
                >
                  <ChevronLeft size={18} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      className={`blog-page-btn ${
                        currentPage === pageNum ? "active" : ""
                      }`}
                      onClick={() => {
                        setCurrentPage(pageNum);
                        window.scrollTo({ top: 300, behavior: "smooth" });
                      }}
                    >
                      {pageNum}
                    </button>
                  )
                )}

                <button
                  type="button"
                  className="blog-page-btn"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  title="Trang tiếp"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>

          {/* ================= CỘT PHẢI: SIDEBAR ================= */}
          <aside className="blog-sidebar">
            {/* Widget: Chuyên mục */}
            <div className="blog-sidebar-widget">
              <h3 className="blog-widget-title">
                <BookOpen size={18} color="#0284c7" />
                <span>Chuyên Mục Nha Khoa</span>
              </h3>
              <ul className="blog-sidebar-cat-list">
                {CATEGORIES.map((cat) => (
                  <li key={cat.name} className="blog-sidebar-cat-item">
                    <button
                      type="button"
                      className={`blog-sidebar-cat-btn ${
                        activeCategory === cat.name ? "active" : ""
                      }`}
                      onClick={() => handleCategorySelect(cat.name)}
                    >
                      <span>{cat.name}</span>
                      <span className="blog-cat-count-badge">{cat.count}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Widget: Bài viết nổi bật */}
            <div className="blog-sidebar-widget">
              <h3 className="blog-widget-title">
                <Bookmark size={18} color="#0284c7" />
                <span>Bài Viết Nổi Bật</span>
              </h3>
              <div className="blog-popular-list">
                {POPULAR_POSTS.map((item) => {
                  const fullArticle =
                    BLOG_ARTICLES.find((a) => a.id === item.id) ||
                    BLOG_ARTICLES[0];
                  return (
                    <div
                      key={item.id}
                      className="blog-popular-item"
                      onClick={() => setSelectedArticle(fullArticle)}
                    >
                      <div className="blog-popular-thumb">
                        <img
                          src={item.image}
                          alt={item.title}
                          loading="lazy"
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=150&q=80";
                          }}
                        />
                      </div>
                      <div className="blog-popular-info">
                        <div className="blog-popular-title">{item.title}</div>
                        <div className="blog-popular-date">
                          <Calendar size={12} />
                          <span>{item.date}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Widget: CTA Đặt Hẹn Nhanh */}
            <div className="blog-sidebar-cta">
              <div className="blog-cta-icon-box">
                <CalendarCheck size={26} />
              </div>
              <h4>Khám Răng Miễn Phí</h4>
              <p>
                Đặt hẹn ngay hôm nay để nhận gói thăm khám tổng quát & chụp phim
                chẩn đoán 3D hoàn toàn miễn phí cùng chuyên gia.
              </p>
              <button
                type="button"
                className="blog-cta-btn"
                onClick={() => navigate("/booking")}
              >
                Đặt Lịch Hẹn Ngay
              </button>
            </div>

            {/* Widget: Đăng Ký Bản Tin */}
            <div className="blog-sidebar-widget">
              <h3 className="blog-widget-title">
                <Send size={18} color="#0284c7" />
                <span>Bản Tin Ưu Đãi</span>
              </h3>
              <p
                style={{
                  fontSize: "13.5px",
                  color: "#64748b",
                  marginBottom: "14px",
                  lineHeight: "1.5",
                }}
              >
                Nhận voucher giảm giá 15% cho các dịch vụ thẩm mỹ răng và cẩm
                nang sức khỏe định kỳ mỗi tuần.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="blog-newsletter-form">
                <input
                  type="email"
                  className="blog-newsletter-input"
                  placeholder="Nhập email của bạn..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                />
                <button type="submit" className="blog-newsletter-btn">
                  <span>Đăng ký nhận tin</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>

            {/* Widget: Tags Cloud */}
            <div className="blog-sidebar-widget">
              <h3 className="blog-widget-title">
                <Tag size={18} color="#0284c7" />
                <span>Từ Khóa Quan Tâm</span>
              </h3>
              <div className="blog-tags-cloud">
                {POPULAR_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={`blog-tag-pill ${
                      activeTag === tag ? "active" : ""
                    }`}
                    onClick={() => handleTagSelect(tag)}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ================= MODAL XEM CHI TIẾT BÀI VIẾT ================= */}
      {selectedArticle && (
        <div
          className="blog-modal-backdrop"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="blog-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="blog-modal-close-btn"
              onClick={() => setSelectedArticle(null)}
              title="Đóng bài viết"
            >
              <X size={20} />
            </button>

            <img
              src={selectedArticle.image}
              alt={selectedArticle.title}
              className="blog-modal-hero-img"
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80";
              }}
            />

            <div className="blog-modal-content">
              <span className="blog-modal-badge">
                {selectedArticle.category}
              </span>
              <h2 className="blog-modal-title">{selectedArticle.title}</h2>

              <div className="blog-modal-meta">
                <span className="blog-meta-item">
                  <User size={15} color="#0284c7" />
                  <span>{selectedArticle.author}</span>
                </span>
                <span className="blog-meta-item">
                  <Calendar size={15} color="#0284c7" />
                  <span>{selectedArticle.date}</span>
                </span>
                <span className="blog-meta-item">
                  <Clock size={15} color="#0284c7" />
                  <span>{selectedArticle.readTime}</span>
                </span>
              </div>

              <div className="blog-modal-quote">
                &ldquo;{selectedArticle.excerpt}&rdquo;
              </div>

              <div className="blog-modal-body">
                {selectedArticle.content.split("\n\n").map((paragraph, idx) => {
                  const trimmed = paragraph.trim();
                  if (trimmed.startsWith("### ")) {
                    return (
                      <h4
                        key={idx}
                        style={{
                          fontSize: "18px",
                          fontWeight: "700",
                          margin: "20px 0 10px",
                          color: "inherit",
                        }}
                      >
                        {trimmed.replace("### ", "")}
                      </h4>
                    );
                  }
                  if (trimmed.startsWith("- ")) {
                    const items = trimmed.split("\n").map((item) =>
                      item.replace("- ", "").trim()
                    );
                    return (
                      <ul
                        key={idx}
                        style={{
                          paddingLeft: "20px",
                          marginBottom: "16px",
                          listStyleType: "disc",
                        }}
                      >
                        {items.map((it, i) => (
                          <li
                            key={i}
                            style={{
                              fontSize: "15px",
                              lineHeight: "1.7",
                              marginBottom: "6px",
                            }}
                          >
                            {it}
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return <p key={idx}>{trimmed}</p>;
                })}
              </div>

              <div className="blog-modal-footer">
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    className="blog-cat-pill"
                    onClick={(e) => handleShare(selectedArticle, e)}
                  >
                    <Share2 size={16} />
                    <span>Chia sẻ bài viết</span>
                  </button>
                </div>

                <button
                  type="button"
                  className="blog-hero-search-btn"
                  onClick={() => {
                    setSelectedArticle(null);
                    navigate("/booking");
                  }}
                >
                  <CalendarCheck size={16} style={{ marginRight: 6 }} />
                  <span>Đặt hẹn tư vấn dịch vụ này</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
