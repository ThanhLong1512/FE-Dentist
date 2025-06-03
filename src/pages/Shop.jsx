import { useState, useEffect, useContext } from "react";
import { handleGetServices } from "../apis";
import { RecoveryContext } from "../App";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import Chat from "../components/Chat";

function Shop() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setCountCart } = useContext(RecoveryContext);
  const navigate = useNavigate();

  useEffect(() => {
    const cartData = localStorage.getItem("cart");
    const cartItems = cartData ? JSON.parse(cartData) : [];
    setCountCart(cartItems.length);
  }, [setCountCart]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const res = await handleGetServices();
        if (!res) {
          throw new Error("No data received from API");
        }
        setServices(res);
      } catch (err) {
        setError(err.message || "Failed to load services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const addToCart = (service) => {
    const cartData = localStorage.getItem("cart");
    let currentCart = cartData ? JSON.parse(cartData) : [];

    service = { ...service, Unit: "Hour" };

    const existingItemIndex = currentCart.findIndex(
      (item) => item._id === service._id
    );

    if (existingItemIndex > -1) {
      currentCart[existingItemIndex] = {
        ...currentCart[existingItemIndex],
        quantity: (currentCart[existingItemIndex].quantity || 1) + 1,
      };
    } else {
      currentCart.push({ ...service, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(currentCart));
    setCountCart(currentCart.length);
    toast.success("Add successfully service ");
  };

  if (loading) return <Loading />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="sidebar-page-container">
      <div className="auto-container">
        <div className="row clearfix">
          <div className="content-side col-lg-8 col-md-12 col-sm-12">
            <div className="our-shop">
              <div className="shop-upper-box">
                <div className="orderby">
                  <select name="orderby">
                    <option value="default">Default Sorting</option>
                    <option value="popularity">Sort by popularity</option>
                    <option value="rating">Sort by average rating</option>
                    <option value="date">Sort by newness</option>
                    <option value="price">Sort by price: low to high</option>
                    <option value="price-desc">
                      Sort by price: high to low
                    </option>
                  </select>
                </div>
                <div className="items-label">
                  Showing {services.length} results
                </div>
              </div>

              <div className="row">
                {services.map((service) => (
                  <div
                    key={service._id}
                    className="shop-item col-lg-4 col-md-6 col-sm-12"
                  >
                    <div className="inner-box">
                      <div className="image-box">
                        <figure className="image">
                          <a>
                            <img
                              src={service.photoService.url}
                              alt={service.nameService}
                              onClick={() => navigate(`${service._id}`)}
                              style={{ cursor: "pointer" }}
                            />
                          </a>
                        </figure>
                      </div>
                      <div className="lower-content">
                        <h4 className="name">
                          <a href="#">{service.nameService}</a>
                        </h4>
                        <div className="price">
                          {service.priceService.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </div>
                        <div className="description">{service.description}</div>
                        <div className="unit">
                          Đơn vị: {service.Unit || "Hour"}
                        </div>
                        <button
                          onClick={() => addToCart(service)}
                          className="theme-btn add-to-cart text-decoration-none"
                        >
                          Add to cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}

export default Shop;
