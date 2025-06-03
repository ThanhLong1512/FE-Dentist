import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  Phone,
  MapPin,
  Stethoscope,
  DollarSign,
  Star,
} from "lucide-react";
import { handleGetMyAppointment } from "../apis";

function Appointment() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMyAppointment() {
      try {
        const res = await handleGetMyAppointment();
        setAppointments(res);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setLoading(false);
      }
    }
    fetchMyAppointment();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
        `}
      </style>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Appointments
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {appointments.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
              <div className="flex items-center">
                <User className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Booked</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {appointments.filter((apt) => apt.patient !== null).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {appointments.filter((apt) => apt.patient === null).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          appointment.patient ? "bg-green-500" : "bg-yellow-500"
                        }`}
                      ></div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {appointment.patient
                          ? "Booked Appointment"
                          : "Available Slot"}
                      </h3>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        appointment.patient
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {appointment.patient ? "Confirmed" : "Available"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {/* Date & Time */}
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {formatDate(appointment.Date)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {appointment.shift?.DayOfWeek}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {appointment.shift?.StartTime} -{" "}
                            {appointment.shift?.EndTime}
                          </p>
                          <p className="text-sm text-gray-600">
                            Duration: 1h 30m
                          </p>
                        </div>
                      </div>

                      {/* Patient Info */}
                      {appointment.patient && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">
                            Patient Information
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-700">
                                {appointment.patient.name}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-700">
                                {appointment.patient.phoneNumber}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-700">
                                {appointment.patient.address}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-700">
                                Born: {appointment.patient.yearOfBirth} (
                                {new Date().getFullYear() -
                                  appointment.patient.yearOfBirth}{" "}
                                years old)
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Column - Doctor & Service Info */}
                    <div className="space-y-4">
                      {/* Doctor Info */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">
                          Doctor Information
                        </h4>
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Stethoscope className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {appointment.shift?.employee?.name || "N/A"}
                            </p>
                            <p className="text-sm text-gray-600">
                              {appointment.shift?.employee?.experience || "N/A"}
                            </p>
                            <p className="text-sm text-blue-600">
                              {appointment.shift?.employee?.email || "N/A"}
                            </p>
                            <p className="text-sm text-gray-600">
                              {appointment.shift?.employee?.phoneNumber ||
                                "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Service Info */}
                      <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">
                          Service Details
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <p className="font-medium text-gray-900">
                              {appointment.shift?.employee?.service
                                ?.nameService || "N/A"}
                            </p>
                            <p className="text-sm text-gray-600">
                              {appointment.shift?.employee?.service?.summary ||
                                "N/A"}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                Price:
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-green-600">
                                {formatPrice(
                                  appointment.shift?.employee?.service
                                    ?.priceDiscount || 0
                                )}
                              </p>
                              <p className="text-xs text-gray-500 line-through">
                                {formatPrice(
                                  appointment.shift?.employee?.service
                                    ?.priceService || 0
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-700">
                              {appointment.shift?.employee?.service
                                ?.ratingsAverage || 0}{" "}
                              / 5.0
                            </span>
                            <span className="text-xs text-gray-500">
                              (
                              {appointment.shift?.employee?.service
                                ?.ratingsQuantity || 0}{" "}
                              reviews)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex justify-end space-x-3">
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      View Details
                    </button>
                    {appointment.patient ? (
                      <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        Cancel Appointment
                      </button>
                    ) : (
                      <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Book Appointment
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {appointments.length === 0 && !loading && (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No appointments
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new appointment.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Appointment;
