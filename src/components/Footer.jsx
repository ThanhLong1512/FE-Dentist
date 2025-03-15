function Footer() {
  return (
    <footer className="main-footer">
      <div
        className="widgets-section"
        style={{ backgroundImage: "url(images/background/7.jpg)" }}
      >
        <div className="auto-container">
          <div className="row">
            <div className="big-column col-xl-6 col-lg-12 col-md-12 col-sm-12">
              <div className="row">
                <div className="footer-column col-xl-7 col-lg-6 col-md-6 col-sm-12">
                  <div className="footer-widget about-widget">
                    <div className="logo">
                      <a href="index.html">
                        <img src="images/logo-2.png" alt="logo" />
                      </a>
                    </div>
                    <div className="text">
                      <p>
                        Our Clinic has grown to provide a world-class facility
                        for advanced restorative treatments.
                      </p>
                      <p>
                        We are among the most qualified implant providers in
                        Australia with over 30 years of quality training and
                        experience.
                      </p>
                    </div>
                    <ul className="social-icon-three">
                      {[
                        "facebook-f",
                        "google-plus-g",
                        "twitter",
                        "skype",
                        "linkedin-in",
                      ].map((icon, index) => (
                        <li key={index}>
                          <a href="#">
                            <i className={`fab fa-${icon}`}></i>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="footer-column col-xl-5 col-lg-6 col-md-6 col-sm-12">
                  <div className="footer-widget">
                    <h2 className="widget-title">Departments</h2>
                    <ul className="user-links">
                      {[
                        "Surgery & Radiology",
                        "Family Medicine",
                        "Women’s Health",
                        "Optician",
                        "Pediatrics",
                        "Dermatology",
                      ].map((dept, index) => (
                        <li key={index}>
                          <a href="#">{dept}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="big-column col-xl-6 col-lg-12 col-md-12 col-sm-12">
              <div className="row">
                <div className="footer-column col-lg-6 col-md-6 col-sm-12">
                  <div className="footer-widget recent-posts">
                    <h2 className="widget-title">Latest News</h2>
                    <div className="widget-content">
                      {[1, 2, 3].map((num) => (
                        <div className="post" key={num}>
                          <div className="thumb">
                            <a href="blog-post-image.html">
                              <img
                                src={`images/resource/post-thumb-${num}.jpg`}
                                alt={`Post ${num}`}
                              />
                            </a>
                          </div>
                          <h4>
                            <a href="blog-post-image.html">
                              Sample Title {num}
                            </a>
                          </h4>
                          <span className="date">August 1, 2020</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="footer-column col-lg-6 col-md-6 col-sm-12">
                  <div className="footer-widget contact-widget">
                    <h2 className="widget-title">Contact Us</h2>
                    <div className="widget-content">
                      <ul className="contact-list">
                        <li>
                          <span className="icon flaticon-placeholder"></span>
                          <div className="text">
                            2130 Fulton Street San Diego, CA 94117-1080 USA
                          </div>
                        </li>
                        <li>
                          <span className="icon flaticon-call-1"></span>
                          <div className="text">Mon to Fri: 08:30 - 18:00</div>
                          <a href="tel:+89868679575">
                            <strong>+898 68679 575</strong>
                          </a>
                        </li>
                        <li>
                          <span className="icon flaticon-email"></span>
                          <div className="text">
                            Do you have a question?
                            <br />
                            <a href="mailto:info@gmail.com">
                              <strong>info@gmail.com</strong>
                            </a>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="scroll-to-top scroll-to-target" data-target="html">
          <span className="fa fa-angle-up"></span>
        </div>
        <div className="auto-container">
          <div className="inner-container clearfix">
            <div className="footer-nav">
              <ul className="clearfix">
                {["Privacy Policy", "Contact", "Supplier"].map(
                  (item, index) => (
                    <li key={index}>
                      <a href="#">{item}</a>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div className="copyright-text">
              <p>
                Copyright © 2020 <a href="#">Bold Touch</a> All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
