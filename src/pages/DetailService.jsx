import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { handleGetService } from "../apis";
import Loading from "../components/Loading";
import { RecoveryContext } from "../App";
import {
  handlePostReview,
  handleDeleteReview,
  handleUpdateReview,
} from "../apis";
import { toast } from "react-toastify";

function DetailService() {
  const { ServiceID } = useParams();
  const [service, setService] = useState(null);
  const [review, setReview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("description");
  const [activeStar, setActiveStar] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { setCountCart } = useContext(RecoveryContext);
  const [error, setError] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [editReviewId, setEditReviewId] = useState(null);
  const [editReviewText, setEditReviewText] = useState("");
  const [editReviewRating, setEditReviewRating] = useState(0);

  const userID = JSON.parse(localStorage.getItem("userInfo"))?.id;
  const userEmail = JSON.parse(localStorage.getItem("userInfo"))?.email;

  useEffect(() => {
    async function callGetService() {
      try {
        setLoading(true);
        const res = await handleGetService(ServiceID);
        if (!res) {
          throw new Error("No data received from API");
        }
        setReview(res.reviews);
        setService(res);
      } catch (err) {
        setError(err.message || "Failed to load service details");
      } finally {
        setLoading(false);
      }
    }

    if (ServiceID) {
      callGetService();
    } else {
      setError("Missing Service ID");
      setLoading(false);
    }
  }, [ServiceID]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleStarClick = (rating) => {
    setActiveStar(rating);
  };

  const handleEditStarClick = (rating) => {
    setEditReviewRating(rating);
  };

  const hasReviewed = review.some(
    (r) => r.account._id === userID && r.service === service?._id
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    });
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const addToCart = () => {
    if (!service) return;

    const cartItem = {
      id: service._id,
      nameService: service.nameService,
      photoService: service.photoService,
      priceDiscount: service.priceDiscount,
      priceService: service.priceService,
      quantity: quantity,
      unit: "Hour",
      summary: service.summary,
    };

    let currentCart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItemIndex = currentCart.findIndex(
      (item) => item.id === service._id
    );

    if (existingItemIndex !== -1) {
      currentCart[existingItemIndex].quantity += quantity;
    } else {
      currentCart.push(cartItem);
      setCountCart(currentCart.length);
    }

    localStorage.setItem("cart", JSON.stringify(currentCart));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const data = {
      rating: activeStar,
      review: reviewText,
      service: service._id,
    };

    try {
      const response = await handlePostReview(data);
      toast.success("Post review successfully");

      const newReview = {
        _id: response.data.data._id || Date.now().toString(),
        rating: activeStar,
        review: reviewText,
        service: service._id,
        createdAt: new Date().toISOString(),
        account: {
          _id: userID,
          email: userEmail,
        },
      };

      setReview((prevReviews) => [...prevReviews, newReview]);

      setService((prevService) => ({
        ...prevService,
        ratingsQuantity: prevService.ratingsQuantity + 1,
      }));

      setReviewText("");
      setActiveStar(0);
      setActiveTab("review");
    } catch (err) {
      toast.error("Failed to post review. Please try again.");
      console.error("Error posting review:", err);
    }
  };

  const handleDeleteReviewClick = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await handleDeleteReview(reviewId);

        setReview((prevReviews) =>
          prevReviews.filter((r) => r._id !== reviewId)
        );

        setService((prevService) => ({
          ...prevService,
          ratingsQuantity: prevService.ratingsQuantity - 1,
        }));

        toast.success("Review deleted successfully");
      } catch (err) {
        toast.error("Failed to delete review. Please try again.");
        console.error("Error deleting review:", err);
      }
    }
  };

  const handleEditReviewClick = (r) => {
    setEditReviewId(r._id);
    setEditReviewText(r.review);
    setEditReviewRating(r.rating);
  };

  const handleCancelEdit = () => {
    setEditReviewId(null);
    setEditReviewText("");
    setEditReviewRating(0);
  };

  const handleUpdateReviewSubmit = async (e) => {
    e.preventDefault();

    const data = {
      rating: editReviewRating,
      review: editReviewText,
    };

    try {
      await handleUpdateReview(editReviewId, data);

      setReview((prevReviews) =>
        prevReviews.map((r) =>
          r._id === editReviewId
            ? {
                ...r,
                review: editReviewText,
                updatedAt: new Date().toISOString(),
              }
            : r
        )
      );

      toast.success("Review updated successfully");
      setEditReviewId(null);
      setEditReviewText("");
      setEditReviewRating(0);
    } catch (err) {
      toast.error("Failed to update review. Please try again.");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="sidebar-page-container">
      <div className="auto-container">
        <div className="row clearfix">
          <div className="content-side col-lg-8 col-md-12 col-sm-12">
            <div className="shop-single">
              <div className="product-details">
                <div className="basic-details">
                  <div className="row clearfix">
                    <div className="image-column col-md-6 col-sm-12">
                      <figure className="image-box">
                        <img
                          src={
                            service?.photoService?.url ||
                            "/placeholder-image.jpg"
                          }
                          alt={service?.nameService || "Service image"}
                        />
                      </figure>
                    </div>
                    <div className="info-column col-md-6 col-sm-12">
                      <div className="details-header">
                        <h4>{service?.nameService || "Unnamed Service"}</h4>
                        <div className="rating">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`fa fa-star ${
                                i < service.ratingsAverage
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            ></span>
                          ))}
                        </div>
                        <a className="reviews" href="#">
                          {`( ${
                            service?.ratingsQuantity || 0
                          } Customer Reviews )`}
                        </a>
                        <div className="item-price">
                          {service?.priceDiscount?.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }) || "N/A"}
                          {service?.priceService && (
                            <del>
                              {service.priceService.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </del>
                          )}
                        </div>
                      </div>
                      <div className="text">{service.summary}</div>
                      <div className="other-options clearfix">
                        <div className="item-quantity">
                          <div className="input-group bootstrap-touchspin">
                            <span
                              className="input-group-addon bootstrap-touchspin-prefix"
                              style={{ display: "none" }}
                            ></span>
                            <input
                              className="quantity-spinner form-control"
                              type="text"
                              value={quantity}
                              name="quantity"
                              style={{ display: "block" }}
                              readOnly
                            />
                            <span
                              className="input-group-addon bootstrap-touchspin-postfix"
                              style={{ display: "none" }}
                            ></span>
                            <span className="input-group-btn-vertical">
                              <button
                                className="btn btn-default bootstrap-touchspin-up"
                                type="button"
                                onClick={incrementQuantity}
                              >
                                <i className="fa fa-chevron-up"></i>
                              </button>
                              <button
                                className="btn btn-default bootstrap-touchspin-down"
                                type="button"
                                onClick={decrementQuantity}
                              >
                                <i className="fa fa-chevron-down"></i>
                              </button>
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="theme-btn btn-style-one add-to-cart"
                          onClick={addToCart}
                        >
                          <span className="btn-title">Add To Cart</span>
                          <span></span> <span></span> <span></span>{" "}
                          <span></span> <span></span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="product-info-tabs">
                  <div className="prod-tabs tabs-box">
                    <ul className="tab-btns tab-buttons clearfix">
                      <li
                        data-tab="#prod-details"
                        className={`tab-btn ${
                          activeTab === "description" ? "active-btn" : ""
                        } `}
                        onClick={() => handleTabClick("description")}
                      >
                        Descripton
                      </li>
                      <li
                        data-tab="#prod-reviews"
                        className={`tab-btn ${
                          activeTab === "review" ? "active-btn" : ""
                        } `}
                        onClick={() => handleTabClick("review")}
                      >
                        {`Review (${service.ratingsQuantity})`}
                      </li>
                    </ul>

                    <div className="tabs-content">
                      <div
                        className={`tab ${
                          activeTab === "description" ? "active-tab" : ""
                        }`}
                        id="prod-details"
                      >
                        <div className="content">
                          <h3>Product Descripton</h3>
                          <p>{service.description}</p>
                          <p>
                            Excepteur sint occaecat cupidatat non proident, sunt
                            in culpa qui officia deserunt mollit anim id est
                            laborum consectetur adipiscing elit, sed do eiusmod
                            tempor incididunt ut labore et dolore magna aliqua.
                            Ut enim ad minim veniam, quis nostrud exercitation
                            ullamco laboris nisi ut aliquip ex ea commodo
                            consequat. sunt in culpa qui officia deserunt mollit
                          </p>
                        </div>
                      </div>

                      <div
                        className={`tab ${
                          activeTab === "review" ? "active-tab" : ""
                        }`}
                        id="prod-reviews"
                      >
                        <h2 className="title">{`${service.ratingsQuantity} Reviews For ${service.nameService}`}</h2>

                        <div className="comments-area style-two">
                          <div className="comment-box">
                            {review.length > 0 ? (
                              review.map((r) => (
                                <div className="comment" key={r._id}>
                                  <div className="author-thumb">
                                    <img
                                      src="/images/resource/avatar-1.jpg"
                                      alt=""
                                    />
                                  </div>

                                  <div className="comment-inner">
                                    <div
                                      className="comment-info"
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                      }}
                                    >
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <div className="name">
                                          {r.account.email}
                                        </div>
                                        <div
                                          className="date"
                                          style={{ marginLeft: "10px" }}
                                        >
                                          {formatDate(r.createdAt)}
                                        </div>
                                      </div>

                                      {/* Edit and Delete icons - Only visible to the review owner */}
                                      {r.account._id === userID && (
                                        <div className="review-actions">
                                          <button
                                            onClick={() =>
                                              handleEditReviewClick(r)
                                            }
                                            className="edit-review-btn"
                                            style={{
                                              background: "none",
                                              border: "none",
                                              cursor: "pointer",
                                              marginRight: "10px",
                                              color: "#3498db",
                                            }}
                                          >
                                            <i className="fa fa-edit"></i>
                                          </button>
                                          <button
                                            onClick={() =>
                                              handleDeleteReviewClick(r._id)
                                            }
                                            className="delete-review-btn"
                                            style={{
                                              background: "none",
                                              border: "none",
                                              cursor: "pointer",
                                              color: "#e74c3c",
                                            }}
                                          >
                                            <i className="fa fa-trash"></i>
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                    <div className="rating">
                                      {[...Array(5)].map((_, i) => (
                                        <span
                                          key={i}
                                          className={`fa fa-star ${
                                            i < r.rating
                                              ? "text-yellow-400"
                                              : "text-gray-300"
                                          }`}
                                        ></span>
                                      ))}
                                    </div>

                                    {/* Show edit form if this review is being edited */}
                                    {editReviewId === r._id ? (
                                      <form
                                        onSubmit={handleUpdateReviewSubmit}
                                        className="edit-review-form"
                                      >
                                        <div className="form-group">
                                          <textarea
                                            value={editReviewText}
                                            onChange={(e) =>
                                              setEditReviewText(e.target.value)
                                            }
                                            placeholder="Edit your review..."
                                            required
                                            style={{ marginTop: "10px" }}
                                          ></textarea>
                                        </div>
                                        <div
                                          className="form-group"
                                          style={{
                                            display: "flex",
                                            gap: "10px",
                                          }}
                                        >
                                          <button
                                            type="submit"
                                            className="theme-btn btn-style-one"
                                          >
                                            <span className="btn-title">
                                              Update
                                            </span>
                                          </button>
                                          <button
                                            type="button"
                                            onClick={handleCancelEdit}
                                            className="theme-btn btn-style-two"
                                          >
                                            <span className="btn-title">
                                              Cancel
                                            </span>
                                          </button>
                                        </div>
                                      </form>
                                    ) : (
                                      <div className="text">{r.review}</div>
                                    )}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <span>No review for this service</span>
                            )}
                          </div>
                        </div>

                        {!hasReviewed && (
                          <div className="shop-comment-form">
                            <h2>Add a Review</h2>
                            <div className="rating-box">
                              <div className="text"> Your Rating:</div>
                              <div className="star-ratings">
                                <div className="rating">
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleStarClick(1);
                                    }}
                                    className={activeStar >= 1 ? "active" : ""}
                                  >
                                    <span className="fa fa-star"></span>
                                  </a>
                                </div>
                                <div className="rating">
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleStarClick(2);
                                    }}
                                    className={activeStar >= 2 ? "active" : ""}
                                  >
                                    <span className="fa fa-star"></span>
                                    <span className="fa fa-star"></span>
                                  </a>
                                </div>
                                <div className="rating">
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleStarClick(3);
                                    }}
                                    className={activeStar >= 3 ? "active" : ""}
                                  >
                                    <span className="fa fa-star"></span>
                                    <span className="fa fa-star"></span>
                                    <span className="fa fa-star"></span>
                                  </a>
                                </div>
                                <div className="rating">
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleStarClick(4);
                                    }}
                                    className={activeStar >= 4 ? "active" : ""}
                                  >
                                    <span className="fa fa-star"></span>
                                    <span className="fa fa-star"></span>
                                    <span className="fa fa-star"></span>
                                    <span className="fa fa-star"></span>
                                  </a>
                                </div>
                                <div className="rating">
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleStarClick(5);
                                    }}
                                    className={activeStar >= 5 ? "active" : ""}
                                  >
                                    <span className="fa fa-star"></span>
                                    <span className="fa fa-star"></span>
                                    <span className="fa fa-star"></span>
                                    <span className="fa fa-star"></span>
                                    <span className="fa fa-star"></span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <form method="post" onSubmit={handleReviewSubmit}>
                              <div className="form-group">
                                <textarea
                                  name="message"
                                  placeholder="Your Review*"
                                  value={reviewText}
                                  onChange={(e) =>
                                    setReviewText(e.target.value)
                                  }
                                  required
                                ></textarea>
                              </div>
                              <div className="form-group">
                                <button
                                  className="theme-btn btn-style-one"
                                  type="submit"
                                  name="submit-form"
                                >
                                  <span className="btn-title">SUBMIT</span>
                                </button>
                              </div>
                            </form>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="sidebar-side col-lg-4 col-md-12 col-sm-12">
            <aside className="sidebar">
              <div className="sidebar-widget search-box">
                <form
                  method="post"
                  action="https://skyethemes.com/html/2022/medicoz/blog.html"
                >
                  <div className="form-group">
                    <input
                      type="search"
                      name="search-field"
                      defaultValue=""
                      placeholder="Search....."
                      required=""
                    />
                    <button type="submit">
                      <span className="icon fa fa-search"></span>
                    </button>
                  </div>
                </form>
              </div>

              <div className="sidebar-widget category-list">
                <div className="sidebar-title">
                  <h3>Categories</h3>
                </div>
                <ul className="cat-list">
                  <li>
                    <a href="#">
                      Procedures <span>(06)</span>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      Transplantation <span>(02)</span>
                    </a>
                  </li>
                  <li className="active">
                    <a href="#">
                      Management <span>(05)</span>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      Healthcare Tips <span>(25)</span>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      Uncategorized <span>(04)</span>
                    </a>
                  </li>
                </ul>
              </div>

              <div className="sidebar-widget latest-news">
                <div className="sidebar-title">
                  <h3>Popular Products</h3>
                </div>
                <div className="widget-content">
                  <article className="post">
                    <div className="post-thumb">
                      <a href="shop-single.html">
                        <img
                          src="/images/resource/products/product-thumb-1.jpg"
                          alt=""
                        />
                      </a>
                    </div>
                    <h5>
                      <a href="shop-single.html">First Aid Kit</a>
                    </h5>
                    <div className="price">$9.00</div>
                    <div className="rating">
                      <span className="fa fa-star"></span>
                      <span className="fa fa-star"></span>
                      <span className="fa fa-star"></span>
                      <span className="fa fa-star"></span>
                      <span className="fa fa-star"></span>
                    </div>
                  </article>

                  <article className="post">
                    <div className="post-thumb">
                      <a href="shop-single.html">
                        <img
                          src="/images/resource/products/product-thumb-2.jpg"
                          alt=""
                        />
                      </a>
                    </div>
                    <h5>
                      <a href="shop-single.html">Vitamin C+</a>
                    </h5>
                    <div className="price">$20.00</div>
                    <div className="rating">
                      <span className="fa fa-star"></span>
                      <span className="fa fa-star"></span>
                      <span className="fa fa-star"></span>
                      <span className="fa fa-star"></span>
                      <span className="fa fa-star"></span>
                    </div>
                  </article>

                  <article className="post">
                    <div className="post-thumb">
                      <a href="shop-single.html">
                        <img
                          src="/images/resource/products/product-thumb-3.jpg"
                          alt=""
                        />
                      </a>
                    </div>
                    <h5>
                      <a href="shop-single.html">Zinc Tablet</a>
                    </h5>
                    <div className="price">$ 18.00</div>
                    <div className="rating">
                      <span className="fa fa-star"></span>
                      <span className="fa fa-star"></span>
                      <span className="fa fa-star"></span>
                      <span className="fa fa-star"></span>
                      <span className="fa fa-star"></span>
                    </div>
                  </article>
                </div>
              </div>

              <div className="sidebar-widget newslatters">
                <div className="sidebar-title">
                  <h3>
                    <span className="icon flaticon-rss-symbol"></span>Newsletter
                  </h3>
                </div>
                <div className="text">
                  Enter your email address below to subscribe to our newsletter
                </div>
                <form
                  method="post"
                  action="https://skyethemes.com/html/2022/medicoz/blog-sidebar.html"
                >
                  <div className="form-group">
                    <input
                      type="text"
                      name="input"
                      defaultValue=""
                      placeholder="Your email address..."
                      required=""
                    />
                    <button type="submit" className="theme-btn">
                      <span className="btn-title">Subscribe</span>
                    </button>
                  </div>
                </form>
              </div>

              <div className="sidebar-widget tags">
                <div className="sidebar-title">
                  <h3>Tag Cloud</h3>
                </div>
                <ul className="popular-tags clearfix">
                  <li>
                    <a href="#">Ideas</a>
                  </li>
                  <li>
                    <a href="#">Doctor</a>
                  </li>
                  <li>
                    <a href="#">Health</a>
                  </li>
                  <li>
                    <a href="#">Department</a>
                  </li>
                  <li>
                    <a href="#">Nurse</a>
                  </li>
                  <li>
                    <a href="#">Growth</a>
                  </li>
                  <li>
                    <a href="#">Expert</a>
                  </li>
                  <li>
                    <a href="#">Tips</a>
                  </li>
                  <li>
                    <a href="#">Service</a>
                  </li>
                  <li>
                    <a href="#">Medical</a>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailService;
