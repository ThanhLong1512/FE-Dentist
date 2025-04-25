function HomeAbout() {
  return (
    <section className="about-section">
      <div className="auto-container">
        <div className="row">
          <div className="content-column col-lg-6 col-md-12 col-sm-12 order-2">
            <div className="inner-column">
              <div className="sec-title">
                <span className="sub-title">OUR MEDICAL</span>
                <h2>
                  We&apos;re setting Standards in Research what&apos; more,
                  Clinical Care.
                </h2>
                <span className="divider">
                  <svg viewBox="0 0 300.08 300.08">
                    <path d="m293.26 184.14h-82.877l-12.692-76.138c-.546-3.287-3.396-5.701-6.718-5.701-.034 0-.061 0-.089 0-3.369.027-6.199 2.523-6.677 5.845l-12.507 87.602-14.874-148.69c-.355-3.43-3.205-6.056-6.643-6.138-.048 0-.096 0-.143 0-3.39 0-6.274 2.489-6.752 5.852l-19.621 137.368h-9.405l-12.221-42.782c-.866-3.028-3.812-5.149-6.8-4.944-3.13.109-5.777 2.332-6.431 5.395l-8.941 42.332h-73.049c-3.771 0-6.82 3.049-6.82 6.82 0 3.778 3.049 6.82 6.82 6.82h78.566c3.219 0 6.002-2.251 6.67-5.408l4.406-20.856 6.09 21.313c.839 2.939 3.526 4.951 6.568 4.951h20.46c3.396 0 6.274-2.489 6.752-5.845l12.508-87.596 14.874 148.683c.355 3.437 3.205 6.056 6.643 6.138h.143c3.39 0 6.274-2.489 6.752-5.845l14.227-99.599 6.397 38.362c.546 3.287 3.396 5.702 6.725 5.702h88.66c3.771 0 6.82-3.049 6.82-6.82-.001-3.772-3.05-6.821-6.821-6.821z"></path>
                  </svg>
                </span>
                <p>
                  We provide the most full medical services, so every person
                  could have the pportunity o receive qualitative medical help.
                </p>
                <p>
                  {" "}
                  Our Clinic has grown to provide a world className facility for
                  the treatment of tooth loss, dental cosmetics and bore
                  advanced restorative dentistry. We are among the most
                  qualified implant providers in the AUS with over 30 years of
                  uality training and experience.
                </p>
              </div>
              <div className="link-box">
                <figure className="signature">
                  <img src="/images/resource/signature.png" alt="" />
                </figure>
                <a href="#" className="theme-btn btn-style-one">
                  <span className="btn-title">More About</span>
                  <span></span> <span></span> <span></span> <span></span>{" "}
                  <span></span>
                </a>
              </div>
            </div>
          </div>

          <div className="images-column col-lg-6 col-md-12 col-sm-12">
            <div className="inner-column">
              <div className="video-link">
                <a
                  href="https://www.youtube.com/watch?v=4UvS3k8D4rs"
                  className="play-btn lightbox-image"
                  data-fancybox="images"
                >
                  <span className="flaticon-play-button-1"></span>
                </a>
              </div>
              <figure className="image-1">
                <img src="/images/resource/image-1.png" alt="" />
              </figure>
              <figure className="image-2">
                <img src="/images/resource/image-2.png" alt="" />
              </figure>
              <figure className="image-3">
                <span className="hex"></span>
                <img src="/images/resource/image-3.png" alt="" />
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeAbout;
