function HomeNews() {
  return (
    <section className="news-section">
      <div className="auto-container">
        <div className="sec-title text-center">
          <span className="title">OUR BLOG</span>
          <h2>Recent Articles and News</h2>
          <span className="divider">
            <svg viewBox="0 0 300.08 300.08">
              <path d="m293.26 184.14h-82.877l-12.692-76.138c-.546-3.287-3.396-5.701-6.718-5.701-.034 0-.061 0-.089 0-3.369.027-6.199 2.523-6.677 5.845l-12.507 87.602-14.874-148.69c-.355-3.43-3.205-6.056-6.643-6.138-.048 0-.096 0-.143 0-3.39 0-6.274 2.489-6.752 5.852l-19.621 137.368h-9.405l-12.221-42.782c-.866-3.028-3.812-5.149-6.8-4.944-3.13.109-5.777 2.332-6.431 5.395l-8.941 42.332h-73.049c-3.771 0-6.82 3.049-6.82 6.82 0 3.778 3.049 6.82 6.82 6.82h78.566c3.219 0 6.002-2.251 6.67-5.408l4.406-20.856 6.09 21.313c.839 2.939 3.526 4.951 6.568 4.951h20.46c3.396 0 6.274-2.489 6.752-5.845l12.508-87.596 14.874 148.683c.355 3.437 3.205 6.056 6.643 6.138h.143c3.39 0 6.274-2.489 6.752-5.845l14.227-99.599 6.397 38.362c.546 3.287 3.396 5.702 6.725 5.702h88.66c3.771 0 6.82-3.049 6.82-6.82-.001-3.772-3.05-6.821-6.821-6.821z"></path>
            </svg>
          </span>
        </div>

        <div className="row">
          <div
            className="news-block col-lg-4 col-md-6 col-sm-12 wow fadeInUp"
            style={{ visibility: "hidden", animationName: "none" }}
          >
            <div className="inner-box">
              <div className="image-box">
                <figure className="image">
                  <a href="blog-post-image.html">
                    <img src="/images/resource/news-1.jpg" alt="" />
                  </a>
                </figure>
                <a href="#" className="date">
                  Sep 19, 2020
                </a>
              </div>
              <div className="lower-content">
                <h4>
                  <a href="blog-post-image.html">
                    What is The Success rate
                    <br /> of a root canel?
                  </a>
                </h4>
                <div className="text">
                  Nullam mauris vitae tortor sodales efficitur. Quisque orci
                  ante. Proin amet turpis
                </div>
                <div className="post-info">
                  <div className="post-author">By Admin Rose</div>
                  <ul className="post-option">
                    <li>
                      <a href="#">
                        0 <i className="far fa-heart"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        0 <i className="far fa-comments"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div
            className="news-block col-lg-4 col-md-6 col-sm-12 wow fadeInUp"
            style={{ visibility: "hidden", animationName: "none" }}
          >
            <div className="inner-box">
              <div className="image-box">
                <figure className="image">
                  <a href="blog-post-image.html">
                    <img src="/images/resource/news-2.jpg" alt="" />
                  </a>
                </figure>
                <a href="#" className="date">
                  Sep 19, 2020
                </a>
              </div>
              <div className="lower-content">
                <h4>
                  <a href="blog-post-image.html">
                    How to handle your kids’ <br />
                    mystery ailments?
                  </a>
                </h4>
                <div className="text">
                  Nullam mauris vitae tortor sodales efficitur. Quisque orci
                  ante. Proin amet turpis
                </div>
                <div className="post-info">
                  <div className="post-author">By Admin Rose</div>
                  <ul className="post-option">
                    <li>
                      <a href="#">
                        0 <i className="far fa-heart"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        0 <i className="far fa-comments"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div
            className="news-block col-lg-4 col-md-6 col-sm-12 wow fadeInUp"
            style={{ visibility: "hidden", animationName: "none" }}
          >
            <div className="inner-box">
              <div className="image-box">
                <figure className="image">
                  <a href="blog-post-image.html">
                    <img src="/images/resource/news-3.jpg" alt="" />
                  </a>
                </figure>
                <a href="#" className="date">
                  Sep 19, 2020
                </a>
              </div>
              <div className="lower-content">
                <h4>
                  <a href="blog-post-image.html">
                    How to help the cardiology <br />
                    department
                  </a>
                </h4>
                <div className="text">
                  Nullam mauris vitae tortor sodales efficitur. Quisque orci
                  ante. Proin amet turpis
                </div>
                <div className="post-info">
                  <div className="post-author">By Admin Rose</div>
                  <ul className="post-option">
                    <li>
                      <a href="#">
                        0 <i className="far fa-heart"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        0 <i className="far fa-comments"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeNews;
