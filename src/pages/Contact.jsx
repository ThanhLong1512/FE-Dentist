import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_ROOT } from "../utils/constants";
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { setHours, setMinutes } from 'date-fns';
import 'react-toastify/dist/ReactToastify.css';

function Contact() {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: '',
    selectedServices: [],
    appointmentDate: null
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${API_ROOT}/api/v1/services` 
        );
        setServices(res.data);
      } catch (error) {
        toast.error(error.response?.data?.message || error?.message);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServicesChange = (selectedOptions) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: selectedOptions
    }));
  };

  const filterPassedTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);
    return currentDate.getTime() < selectedDate.getTime();
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      appointmentDate: date
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.fullName || !formData.email || !formData.phone || formData.selectedServices.length === 0 || !formData.appointmentDate) {
        toast.error('Please fill in all required fields', {
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
        service: formData.selectedServices.map(service => service.value)
      };

      try {
        console.log('Sending appointment data:', appointmentData);
        const response = await axios.post(`${API_ROOT}/api/v1/appointments`, appointmentData, {
          withCredentials: true,
        });
        
        if (response.data) {
          toast.success('Booking Appointment Successfully!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          });

          setFormData({
            fullName: '',
            email: '',
            phone: '',
            message: '',
            selectedServices: [],
            appointmentDate: null
          });
        }
      } catch (error) {
        console.error('Appointment error:', error);
        if (error.response?.status === 401) {
          toast.error('Please login to book an appointment', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          navigate('/login');
          return;
        }
        toast.error('Error booking appointment. Please try again.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const serviceOptions = services?.map(service => ({
    value: service._id,
    label: `${service.nameService} - ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.priceService)}`,
  }));

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: '30px',
      border: '1px solid #e6e6e6',
      minHeight: '50px',
      boxShadow: 'none',
      '&:hover': {
        border: '1px solid #2ea3f2'
      }
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#2ea3f2',
      borderRadius: '15px',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: 'white',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: 'white',
      '&:hover': {
        backgroundColor: 'rgba(0,0,0,0.1)',
        color: 'white',
      },
    })
  };

  return (
    <>
      <section className="contact-section" id="contact">
        <div className="container">
          <div className="sec-title text-center mb-5">
            <h2 className="title">Book Your Appointment</h2>
            <p className="subtitle">Schedule a visit with our professional team</p>
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
                      <Select
                        isMulti
                        name="services"
                        options={serviceOptions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        value={formData.selectedServices}
                        onChange={handleServicesChange}
                        placeholder="Select Services *"
                        styles={customSelectStyles}
                      />
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
