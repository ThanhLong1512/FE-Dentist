import { useLanguage } from "../context/LanguageContext";
import { useLocation } from "react-router-dom";

function Banner() {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const isCart = pathname === "/cart";
  const isContact = pathname === "/contact";
  const title = isCart ? t("banner.cart") : isContact ? t("banner.contact") : t("banner.shop");
  return (
    <section
      className="page-title"
      style={{ backgroundImage: `url(/images/background/8.jpg)` }}
    >
      <div className="auto-container">
        <div className="title-outer">
          <h1>{title}</h1>
        </div>
      </div>
    </section>
  );
}

export default Banner;
