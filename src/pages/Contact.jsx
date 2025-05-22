import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_ROOT } from "../utils/constants";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { setHours, setMinutes } from "date-fns";
import "react-toastify/dist/ReactToastify.css";

function Contact() {
  const [services, setServices] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
    selectedServices: [],
    appointmentDate: null,
    shift: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date();
        const days = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const currentDayOfWeek = days[today.getDay()];
        const shiftsRes = await axios.get(
          `${API_ROOT}/api/v1/shifts/${currentDayOfWeek}`,
          { withCredentials: true }
        );
        console.log(shiftsRes.data.data);
        setShifts(shiftsRes.data.data);
      } catch (error) {
        toast.error(error.response?.data?.message || error?.message);
      }
    };
    fetchData();
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleShiftChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      shift: e.target.value,
    }));
  };

  const filterPassedTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);
    return currentDate.getTime() < selectedDate.getTime();
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      appointmentDate: date,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (
        !formData.fullName ||
        !formData.email ||
        !formData.phone ||
        !formData.appointmentDate ||
        !formData.shift
      ) {
        toast.error("Please fill in all required fields", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

      const appointmentData = {
        Date: formData.appointmentDate.toISOString(),
        shift: formData.shift,
        patient: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
        },
      };

      try {
        console.log("Sending appointment data:", appointmentData);
        const response = await axios.post(
          `${API_ROOT}/api/v1/appointments`,
          appointmentData,
          {
            withCredentials: true,
          }
        );

        if (response.data) {
          toast.success("Booking Appointment Successfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });

          setFormData({
            fullName: "",
            email: "",
            phone: "",
            message: "",
            selectedServices: [],
            appointmentDate: null,
            shift: "",
          });
        }
      } catch (error) {
        console.error("Appointment error:", error);
        if (error.response?.status === 401) {
          toast.error("Please login to book an appointment", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          navigate("/login");
          return;
        }
        toast.error("Error booking appointment. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const serviceOptions = services?.map((service) => ({
    value: service._id,
    label: `${service.nameService} - ${new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(service.priceService)}`,
  }));

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: "30px",
      border: "1px solid #e6e6e6",
      minHeight: "50px",
      boxShadow: "none",
      "&:hover": {
        border: "1px solid #2ea3f2",
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#2ea3f2",
      borderRadius: "15px",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "white",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "white",
      "&:hover": {
        backgroundColor: "rgba(0,0,0,0.1)",
        color: "white",
      },
    }),
  };

  return (
    <>
      <section className="contact-section" id="contact">
        <div className="container">
          <div className="sec-title text-center mb-5">
            <h2 className="title">Book Your Appointment</h2>
            <p className="subtitle">
              Schedule a visit with our professional team
            </p>
          </div>

          <div className="appointment-form-container">
            <div className="contact-form">
              <form id="appointment-form">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="form-group">
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Full Name *"
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Email Address *"
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Phone Number *"
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <DatePicker
                        selected={formData.appointmentDate}
                        onChange={handleDateChange}
                        showTimeSelect
                        filterTime={filterPassedTime}
                        dateFormat="MMMM d, yyyy h:mm aa"
                        minDate={new Date()}
                        minTime={setHours(setMinutes(new Date(), 0), 8)}
                        maxTime={setHours(setMinutes(new Date(), 0), 17)}
                        placeholderText="Select Date and Time *"
                        className="form-control"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group">
                      <select
                        name="shift"
                        value={formData.shift}
                        onChange={handleShiftChange}
                        className="form-control"
                        required
                      >
                        <option value="">Select Available Shift *</option>
                        {shifts.map((shift) => (
                          <option key={shift._id} value={shift._id}>
                            {shift.employee?.name || "Unknown Doctor"} -{" "}
                            {shift.StartTime} to {shift.EndTime}(
                            {shift.employee?.service.nameService})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group">
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Additional Notes (Optional)"
                        rows="4"
                      ></textarea>
                    </div>
                  </div>

                  <div className="col-12 text-center">
                    <button
                      className="btn-appointment"
                      type="button"
                      onClick={handleSubmit}
                    >
                      Book Appointment
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

export default Contact;
