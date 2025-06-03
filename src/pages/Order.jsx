import React, { useState, useEffect } from "react";
import axios from "axios";
import { handleGetNyOrder } from "../apis";

const Order = () => {
  const [ordersData, setOrdersData] = useState({
    codOrders: [],
    paidOrders: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      await handleGetNyOrder()
        .then((res) => {})
        .catch((error) => {
          setError("Error fetching orders. Please try again later.");
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchOrders();
  }, []);

  const renderOrder = (order, type) => (
    <div
      key={order._id}
      className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">
          Order ID: {order._id}
        </h2>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            order.status === "Processing"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {order.status}
        </span>
      </div>
      <div className="mb-4">
        <h3 className="text-md font-medium text-gray-600">Account Details</h3>
        <p className="text-gray-600">Name: {order.account.name}</p>
        <p className="text-gray-600">Email: {order.account.email}</p>
      </div>
      <div className="mb-4">
        <h3 className="text-md font-medium text-gray-600">Services</h3>
        <div className="space-y-4">
          {order.service.map((service) => (
            <div key={service._id} className="flex items-start space-x-4">
              <img
                src={service.photoService.url}
                alt={service.nameService}
                className="w-16 h-16 object-cover rounded"
                onError={(e) =>
                  (e.target.src = "https://via.placeholder.com/64")
                }
              />
              <div>
                <h4 className="font-semibold text-gray-700">
                  {service.nameService}
                </h4>
                <p className="text-gray-600">{service.summary}</p>
                <p className="text-gray-600">
                  Price: {service.priceDiscount.toLocaleString("vi-VN")} VND
                </p>
                <p className="text-gray-600">Unit: {service.Unit}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-600">
            Total Price: {order.totalPrice.toLocaleString("vi-VN")} VND
          </p>
          <p className="text-gray-600">Payment Method: {order.paymentMethod}</p>
          <p className="text-gray-600">
            Created At: {new Date(order.createAt).toLocaleString("vi-VN")}
          </p>
          {type === "paid" && (
            <p className="text-gray-600 font-medium">Payment Status: Paid</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>
        {`
          @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
        `}
      </style>
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Orders</h1>
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800"></div>
            </div>
          ) : error ? (
            <div className="text-center p-6 bg-white rounded-lg shadow-md border border-gray-200">
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          ) : ordersData.codOrders.length === 0 &&
            ordersData.paidOrders.length === 0 ? (
            <div className="text-center p-8 bg-white rounded-lg shadow-md border border-gray-200">
              <svg
                className="mx-auto h-16 w-16 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h18M3 3l2 18h14l2-18M3 3l6 6m6-6l-6 6m-3 3h6"
                />
              </svg>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                No Orders Found
              </h2>
              <p className="text-gray-600">
                You haven't placed any orders yet. Start exploring our services
                to book your first appointment!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {ordersData.codOrders.length > 0 && (
                <>
                  <h2 className="text-lg font-semibold text-gray-700 mt-4">
                    COD Orders
                  </h2>
                  {ordersData.codOrders.map((order) =>
                    renderOrder(order, "cod")
                  )}
                </>
              )}
              {ordersData.paidOrders.length > 0 && (
                <>
                  <h2 className="text-lg font-semibold text-gray-700 mt-4">
                    Paid Orders
                  </h2>
                  {ordersData.paidOrders.map((order) =>
                    renderOrder(order, "paid")
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Order;
