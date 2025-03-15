function NotFound() {
  return (
    <section className="error-section">
      <div className="auto-container">
        <div className="content-box">
          <figure className="error-image">
            <img src="/images/icons/error.png" alt="" />
          </figure>
          <h2>Page not found</h2>
          <div className="text">Please try one of the following pages:</div>
          <a href="index.html" className="theme-btn btn-style-one">
            <span className="btn-title">Home Page</span>
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span>
          </a>
          <a href="contact.html" className="theme-btn btn-style-one">
            <span className="btn-title">Contact Us</span>
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default NotFound;
