import { useState, useEffect } from "react";
import { handleGetService } from "../apis";
import { useContext } from "react";
import { RecoveryContext } from "../App";

function Shop() {
  const [services, setServices] = useState([]);
  const [store, setStore] = useState(() => {
    const cartData = localStorage.getItem("cart");
    return cartData ? JSON.parse(cartData) : [];
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setCountCart } = useContext(RecoveryContext);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(store));
    const totalQuantity = store.reduce(
      (total, item) => total + item.quantity,
      0
    );
    setCountCart(totalQuantity);
  }, [store, setCountCart]);
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await handleGetService();
        setServices(res);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const addToCart = (service) => {
    setStore((prevStore) => {
      const existingItemIndex = prevStore.findIndex(
        (item) => item._id === service._id
      );

      if (existingItemIndex > -1) {
        const updatedStore = [...prevStore];
        updatedStore[existingItemIndex] = {
          ...updatedStore[existingItemIndex],
          quantity: (updatedStore[existingItemIndex].quantity || 1) + 1,
        };
        return updatedStore;
      } else {
        return [...prevStore, { ...service, quantity: 1 }];
      }
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="sidebar-page-container">
      <div className="auto-container">
        <div className="row clearfix">
          <div className="content-side col-lg-8 col-md-12 col-sm-12">
            <div className="our-shop">
              <div className="shop-upper-box">
                <div className="orderby">
                  <select name="orderby">
                    <option defaultValue="default">Default Sorting</option>
                    <option defaultValue="popularity">
                      Sort by popularity
                    </option>
                    <option defaultValue="rating">
                      Sort by average rating
                    </option>
                    <option defaultValue="date">Sort by newness</option>
                    <option defaultValue="price">
                      Sort by price: low to high
                    </option>
                    <option defaultValue="price-desc">
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
                          <a href="#">
                            <img
                              src={service.photoService.url}
                              alt={service.nameService}
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
                        <div className="unit">Đơn vị: {service.Unit}</div>
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
