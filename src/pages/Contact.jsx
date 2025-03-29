import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_ROOT } from "../utils/constants";

function Contact() {
  const [employees, setEmployee] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/v1/employees/getEmployees`,
          { withCredentials: true }
        );
        console.log(res.data);
        setEmployee(res.data);
      } catch (error) {
        toast.error(error.response?.data?.message || error?.message);
      }
    };
    fetchData();
  }, []);
  if (!employees) {
    console.log(employees);
    return <h1>Thành công test Middleware</h1>;
  } else {
    return (
      <>
        <section className="contact-section" id="contact">
          <div className="small-container">
            <div className="sec-title text-center">
              <span className="sub-title">Contact Now</span>
              <h2>Write us a Message !</h2>
              <span className="divider">
                <svg viewBox="0 0 300.08 300.08">
                  <path d="m293.26 184.14h-82.877l-12.692-76.138c-.546-3.287-3.396-5.701-6.718-5.701-.034 0-.061 0-.089 0-3.369.027-6.199 2.523-6.677 5.845l-12.507 87.602-14.874-148.69c-.355-3.43-3.205-6.056-6.643-6.138-.048 0-.096 0-.143 0-3.39 0-6.274 2.489-6.752 5.852l-19.621 137.368h-9.405l-12.221-42.782c-.866-3.028-3.812-5.149-6.8-4.944-3.13.109-5.777 2.332-6.431 5.395l-8.941 42.332h-73.049c-3.771 0-6.82 3.049-6.82 6.82 0 3.778 3.049 6.82 6.82 6.82h78.566c3.219 0 6.002-2.251 6.67-5.408l4.406-20.856 6.09 21.313c.839 2.939 3.526 4.951 6.568 4.951h20.46c3.396 0 6.274-2.489 6.752-5.845l12.508-87.596 14.874 148.683c.355 3.437 3.205 6.056 6.643 6.138h.143c3.39 0 6.274-2.489 6.752-5.845l14.227-99.599 6.397 38.362c.546 3.287 3.396 5.702 6.725 5.702h88.66c3.771 0 6.82-3.049 6.82-6.82-.001-3.772-3.05-6.821-6.821-6.821z"></path>
                </svg>
              </span>
            </div>

            <div className="contact-box">
              <div className="row">
                <div className="contact-info-block col-lg-4 col-md-6 col-sm-12">
                  <div className="inner">
                    <span className="icon flaticon-worldwide"></span>
                    <h4>
                      <strong>Address</strong>
                    </h4>
                    <p>
                      185, Pickton Near Street, <br />
                      Los Angeles, USA
                    </p>
                  </div>
                </div>

                <div className="contact-info-block col-lg-4 col-md-6 col-sm-12">
                  <div className="inner">
                    <span className="icon flaticon-phone"></span>
                    <h4>
                      <strong>Phone</strong>
                    </h4>
                    <p>
                      <a href="#">(+92) 313 888 000</a>
                    </p>
                    <p>
                      <a href="#">(+92) 313 999 000</a>
                    </p>
                  </div>
                </div>

                <div className="contact-info-block col-lg-4 col-md-6 col-sm-12">
                  <div className="inner">
                    <span className="icon flaticon-email"></span>
                    <h4>
                      <strong>Email</strong>
                    </h4>
                    <p>
                      <a href="mailto:support@example.com">
                        support@example.com
                      </a>
                    </p>
                    <p>
                      <a href="mailto:support@example.com">
                        support@example.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-box">
              <div className="contact-form">
                <form action="#" method="post" id="email-form">
                  <div className="row">
                    <div className="form-group col-lg-12">
                      <div className="response"></div>
                    </div>

                    <div className="col-lg-6 col-md-12">
                      <div className="form-group">
                        <input
                          type="text"
                          name="username"
                          className="username"
                          placeholder="Full Name *"
                        />
                      </div>

                      <div className="form-group">
                        <input
                          type="email"
                          name="email"
                          className="email"
                          placeholder="Email Address *"
                        />
                      </div>

                      <div className="form-group">
                        <input
                          type="text"
                          name="username"
                          className="username"
                          placeholder="Your Phone"
                        />
                      </div>
                    </div>

                    <div className="col-lg-6 col-md-12">
                      <div className="form-group">
                        <textarea
                          name="contact_message"
                          className="message"
                          placeholder="Massage"
                        ></textarea>
                      </div>
                    </div>

                    <div className="form-group col-lg-12 text-center pt-3">
                      <button
                        className="theme-btn btn-style-one"
                        type="button"
                        id="submit"
                        name="submit-form"
                      >
                        <span className="btn-title">Send Message</span>
                        <span></span> <span></span> <span></span> <span></span>{" "}
                        <span></span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
}

export default Contact;
