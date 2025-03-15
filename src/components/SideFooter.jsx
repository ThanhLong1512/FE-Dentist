function SideFooter() {
  const clientImages = [
    "images/clients/1.png",
    "images/clients/2.png",
    "images/clients/3.png",
    "images/clients/4.png",
    "images/clients/5.png",
  ];

  return (
    <section className="clients-section alternate">
      <div className="auto-container">
        <div className="sponsors-outer">
          <ul className="clients-carousel owl-carousel owl-theme">
            {clientImages.concat(clientImages).map((image, index) => (
              <li className="slide-item" key={index}>
                <a href="#">
                  <img src={image} alt="Client Logo" />
                </a>
              </li>
            ))}
          </ul>
          <div className="owl-nav disabled">
            <div className="owl-prev">
              <span className="flaticon-left"></span>
            </div>
            <div className="owl-next">
              <span className="flaticon-right"></span>
            </div>
          </div>
          <div className="owl-dots disabled">
            <div className="owl-dot active">
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SideFooter;
