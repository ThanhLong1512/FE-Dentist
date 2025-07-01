import styled from "styled-components";
import { useState } from "react";
import { HiEye } from "react-icons/hi2";
import Modal from "../../components/admin/Modal";
import Table from "../../components/admin/Table";
import Menus from "../../components/admin/Menus";

const CustomerName = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const OrderInfo = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-grey-500);
`;

const ServiceInfo = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-green-700);
`;

const PriceInfo = styled.div`
  font-family: "Sono";
  font-weight: 600;
  color: var(--color-red-700);
`;

const StatusInfo = styled.div`
  font-family: "Sono";
  font-weight: 600;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  text-align: center;

  ${(props) =>
    props.status === "Successful" &&
    `
    background-color: var(--color-green-100);
    color: var(--color-green-700);
  `}

  ${(props) =>
    props.status === "Cancelled" &&
    `
    background-color: var(--color-red-100);
    color: var(--color-red-700);
  `}
  
  ${(props) =>
    props.status === "Processing" &&
    `
    background-color: var(--color-yellow-100);
    color: var(--color-yellow-700);
  `}
`;

const PaymentInfo = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-blue-700);
`;

function OrderRow({ order }) {
  const {
    _id: orderID,
    account,
    service,
    status,
    totalPrice,
    paymentMethod,
    createAt,
  } = order;

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Get service names
  const getServiceNames = (services) => {
    if (services.length === 1) {
      return services[0].nameService;
    }
    return `${services[0].nameService} +${services.length - 1} more`;
  };

  return (
    <>
      <Table.Row>
        <div>
          <CustomerName>{account.name}</CustomerName>
          <OrderInfo>{account.email}</OrderInfo>
        </div>

        <ServiceInfo>{getServiceNames(service)}</ServiceInfo>

        <StatusInfo status={status}>{status}</StatusInfo>

        <PriceInfo>{formatPrice(totalPrice)}</PriceInfo>

        <PaymentInfo>{paymentMethod}</PaymentInfo>

        <OrderInfo>{formatDate(createAt)}</OrderInfo>

        <div>
          <Modal>
            <Menus.Menu>
              <Menus.Toggle id={orderID} />
              <Menus.List id={orderID}>
                <Modal.Open opens="view-order">
                  <Menus.Button icon={<HiEye />}>View Details</Menus.Button>
                </Modal.Open>
              </Menus.List>
              <Modal.Window name="view-order">
                <div style={{ padding: "2rem", minWidth: "500px" }}>
                  <h3
                    style={{
                      marginBottom: "1.5rem",
                      color: "var(--color-grey-700)",
                    }}
                  >
                    Order Details
                  </h3>

                  <div style={{ marginBottom: "1rem" }}>
                    <strong>Order ID:</strong> {orderID}
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <strong>Customer:</strong> {account.name}
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <strong>Email:</strong> {account.email}
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <strong>Services:</strong>
                    <ul style={{ marginLeft: "1rem", marginTop: "0.5rem" }}>
                      {service.map((srv, index) => (
                        <li key={index} style={{ marginBottom: "0.5rem" }}>
                          <strong>{srv.nameService}</strong> -{" "}
                          {formatPrice(srv.priceDiscount || srv.priceService)}
                          <br />
                          <small style={{ color: "var(--color-grey-500)" }}>
                            {srv.summary}
                          </small>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <strong>Status:</strong>
                    <StatusInfo
                      status={status}
                      style={{ display: "inline-block", marginLeft: "0.5rem" }}
                    >
                      {status}
                    </StatusInfo>
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <strong>Total Price:</strong> {formatPrice(totalPrice)}
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <strong>Payment Method:</strong> {paymentMethod}
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <strong>Order Date:</strong> {formatDate(createAt)}
                  </div>
                </div>
              </Modal.Window>
            </Menus.Menu>
          </Modal>
        </div>
      </Table.Row>
    </>
  );
}

export default OrderRow;
