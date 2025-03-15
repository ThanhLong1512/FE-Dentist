import { Outlet } from "react-router-dom";
import Banner from "./Banner";
import Footer from "./Footer";
import Header from "./Header";
import Loading from "./Loading";
import SideFooter from "./SideFooter";

function AppLayout() {
  return (
    <div className="mm-page mm-slideout" id="mm-0">
      <div className="page-wrapper">
        <Loading />
        <Header />
        <Banner />
        <Outlet />
        <SideFooter />
        <Footer />
      </div>

      {/* Color Palate Section */}
      <div className="color-palate">
        <div className="inner-palate">
          <div className="color-trigger">
            <i className="fa fa-cog"></i>
          </div>
          <div className="color-palate-head">
            <h5>GET AN AWESOME START!</h5>
          </div>

          {/* Color Options */}
          <div className="various-color clearfix">
            <div className="colors-list">
              <h6>Choose Your Color</h6>
              {[
                "default",
                "tealblue",
                "scarlet",
                "kellygreen",
                "dodgerblue",
                "red",
                "selectiveyellow",
                "maroon",
                "brown",
                "green",
                "duchessblue",
                "lightblue",
                "frenchgray",
                "telemagenta",
                "signalviolet",
              ].map((color) => (
                <span
                  key={color}
                  className={`palate ${color}-color`}
                  data-theme-file={`css/color-themes/${color}.css`}
                ></span>
              ))}
            </div>
          </div>

          {/* Layout Options */}
          <div className="lower-options">
            <h6>RTL Supported</h6>
            <ul className="rtl-version option-box">
              <li className="active">LTR</li>
              <li className="rtl">RTL</li>
            </ul>
            <h6>Box &amp; Wide layout</h6>
            <ul className="box-version option-box">
              <li className="active">Wide</li>
              <li className="box">Boxed</li>
            </ul>

            {/* Boxed Mode Backgrounds */}
            <div className="box-mode-bg">
              <h6>Boxed Mode Backgrounds</h6>
              <ul className="clearfix">
                {[...Array(8)].map((_, index) => (
                  <li
                    key={index}
                    style={{
                      backgroundImage: `url(images/background/boxed-bg/${
                        index + 1
                      }.png)`,
                    }}
                  ></li>
                ))}
              </ul>
            </div>

            <div className="palate-foo">
              <span>
                You will find much more options for colors and styling in admin
                panel. This color picker is used only for demonstration
                purposes.
              </span>
            </div>

            <a
              href="https://themeforest.net/item/medicoz-clinic-hospital-html-template/28397578?ref=bold_touch"
              className="purchase-btn"
            >
              Purchase now $12
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
