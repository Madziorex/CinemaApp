import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import PopupForm from "./PopupForm";
import api from "../services/api";
import ScreeningSeatMap from "./ScreeningSeatMap";
import "../css/Screening.css";
import { useAuth } from "../services/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaypal, faGooglePay } from "@fortawesome/free-brands-svg-icons";
import {
  faCreditCard,
  faMoneyBillWave,
} from "@fortawesome/free-solid-svg-icons";
import LoadingIcon from "./LoadingIcon";

interface Screening {
  id: string;
  movieId: string;
  hallId: string;
  screeningTime: string;
  endTime: string;
  is3D: boolean;
  isSubtitled: boolean;
  price: number;
  tickets: Ticket[];
  reservations: Reservation[];
}

interface Seat {
  id: string;
  rowNumber: string;
  seatNumber: number;
  hallId: string;
}

interface Movie {
  id: string;
  title: string;
  imageUrl: string;
  backgroundImageUrl: string;
  duration: number;
}

interface Hall {
  id: string;
  name: string;
  seats: Seat[];
}

interface Ticket {
  id: string;
  screeningId: string;
  seatId: string;
  couponId: string;
}

interface Reservation {
  id: string;
  screeningId: string;
  userId: string;
  email: string;
  seats: Seat[];
}

interface Coupon {
  id: string;
  code: string;
  discountAmount: number;
  discountPercent: number;
  isActive: boolean;
  expiryDate: string;
}

interface ListQuery {
  pageIndex: number;
  pageSize: number;
  searchBy: string;
  searchFor: string;
  orderBy: string;
  ascending: boolean;
}

interface ResponseMovie {
  items: Ticket[];
  pageIndex: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

const Screening: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, isEmployee, email: contextEmail, nameidentifier } = useAuth();
  const [email, setEmail] = useState<string>(contextEmail || "");
  const [screening, setScreening] = useState<Screening | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [hall, setHall] = useState<Hall | null>(null);
  const [reservedSeats, setReservedSeats] = useState<string[]>([]);
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const [showQRCodePopup, setShowQRCodePopup] = useState(false);
  const [qrData, setQrData] = useState("");
  const [selectedSeats, setSelectedSeats] = useState<
    { id: string; rowNumber: string; seatNumber: number; price: number }[]
  >([]);
  const [activeTab, setActiveTab] = useState<
    "seatMap" | "ticketDetails" | "payment"
  >("seatMap");
  const [couponCode, setCouponCode] = useState("");
  const [couponId, setCouponId] = useState("");
  const [discount, setDiscount] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "creditCard" | "paypal" | "googlepay" | "cash" | ""
  >("");

  useEffect(() => {
    const fetchScreeningAndRelatedData = async () => {
      try {
        const screeningResponse = await api.get<Screening>(`/Screening/${id}`);
        const screeningData = screeningResponse.data;

        const now = new Date();
        const screeningStartTime = new Date(screeningData.screeningTime);

        if (now >= screeningStartTime && !isAdmin && !isEmployee) {
          alert("This screening has already started. Redirecting to schedule...");
          navigate("/schedule");
          return;
        }

        setScreening(screeningData);

        const movieResponse = await api.get<Movie>(
          `/Movie/${screeningData.movieId}`
        );
        setMovie(movieResponse.data);

        const hallResponse = await api.get<Hall>(
          `/Hall/${screeningData.hallId}`
        );
        setHall(hallResponse.data);

        const ticketReservedSeats = screeningData.tickets.map(
          (ticket) => ticket.seatId
        );

        const reservationReservedSeats = screeningData.reservations.flatMap(
          (reservation) => {
            return reservation.seats.map((seat) => {
              return seat.id;
            });
          }
        );

        const allReservedSeats = [
          ...ticketReservedSeats,
          ...reservationReservedSeats,
        ];

        setReservedSeats(allReservedSeats);
      } catch (error) {
        console.error("Error fetching screening or related data:", error);
      }
    };
    fetchScreeningAndRelatedData();
  }, [id]);

  const handleRemoveSeat = async (seatId: string) => {
    const confirmRemoval = window.confirm(
      `Are you sure you want to remove the reservation or ticket for this seat?`
    );
  
    if (!confirmRemoval) {
      setSelectedSeats((prevSelected) =>
        prevSelected.filter((seat) => seat.id !== seatId)
      );
      return;
    }
  
    try {
      const ticket = screening?.tickets.find((ticket) => ticket.seatId === seatId);
  
      if (ticket) {
        await api.delete(`/Ticket/${ticket.id}`);
        alert("The ticket has been removed.");
  
        setReservedSeats((prev) => prev.filter((reservedSeatId) => reservedSeatId !== seatId));
        setSelectedSeats((prevSelected) =>
          prevSelected.filter((seat) => seat.id !== seatId)
        );
        const updatedScreening = await api.get<Screening>(`/Screening/${id}`);
        setScreening(updatedScreening.data);
        return;
      }
  
      const reservation = screening?.reservations.find(
        (res) =>
          res.screeningId === screening.id &&
          res.seats.some((seat) => seat.id === seatId)
      );
  
      if (reservation) {
        await api.delete(`/Reservation/${reservation.id}`);
        alert("The reservation has been removed.");
  
        const reservationSeats = reservation.seats.map((seat) => seat.id);
        setReservedSeats((prev) =>
          prev.filter((reservedSeatId) => !reservationSeats.includes(reservedSeatId))
        );
        setSelectedSeats((prevSelected) =>
          prevSelected.filter((seat) => !reservationSeats.includes(seat.id))
        );
  
        const updatedScreening = await api.get<Screening>(`/Screening/${id}`);
        setScreening(updatedScreening.data);
        return;
      }
  
      alert("No ticket or reservation was found for this seat.");
    } catch (error) {
      console.error("Error removing seat:", error);
      alert("Failed to remove the seat. Please try again.");
    }
  };  
  
  const handleSeatSelectionChange = (updatedSeats: {
    id: string;
    rowNumber: string;
    seatNumber: number;
    price: number;
  }[]) => {
    setSelectedSeats(updatedSeats);
  
    if (isAdmin || isEmployee) {
      const newlySelected = updatedSeats.find(
        (seat) => reservedSeats.includes(seat.id)
      );
      if (newlySelected) {
        handleRemoveSeat(newlySelected.id);
      }
    }
  };

  const handleReserve = () => {
    if (!screening || !movie || selectedSeats.length === 0) {
      alert("Please select seats to reserve.");
      return;
    }

    const now = new Date();
    const screeningStartTime = new Date(screening.screeningTime);
  
    if (now >= screeningStartTime && !isAdmin && !isEmployee) {
      alert("This screening has already started. Redirecting to schedule...");
      navigate("/schedule");
      return;
    }

    const formattedSeats = selectedSeats.map(
      (seat) => `Row: ${seat.rowNumber}, Seat: ${seat.seatNumber}`
    );

    const data = `
      Reservation for: ${movie.title}
      Date: ${new Date(screening.screeningTime).toLocaleDateString()}
      Seats: ${formattedSeats.join(", ")}
    `;

    setQrData(data);
    setShowQRCodePopup(true);
  };

  const handleBuy = () => {
    if (!screening || !movie || selectedSeats.length === 0) {
      alert("Please select seats to buy.");
      return;
    }

    const now = new Date();
    const screeningStartTime = new Date(screening.screeningTime);
  
    if (now >= screeningStartTime && !isAdmin && !isEmployee) {
      alert("This screening has already started. Redirecting to schedule...");
      navigate("/schedule");
      return;
    }

    const formattedSeats = selectedSeats.map(
      (seat) => `Row: ${seat.rowNumber}, Seat: ${seat.seatNumber}`
    );

    const data = `
      Ticket for: ${movie.title}
      Date: ${new Date(screening.screeningTime).toLocaleDateString()}
      Seats: ${formattedSeats.join(", ")}
    `;

    setQrData(data);
    setShowQRCodePopup(true);
  };

  useEffect(() => {
    if (isAuthenticated && contextEmail) {
      setEmail(contextEmail);
    }
  }, [isAuthenticated, contextEmail]);

  const totalPrice = selectedSeats.reduce((acc, seat) => acc + seat.price, 0);
  const discountedPrice = totalPrice - discount;

  const handlePaymentMethodChange = (method: string) => {
    setSelectedPaymentMethod(method as typeof selectedPaymentMethod);
  };

  useEffect(() => {
    if (activeTab === "payment") {
      if (selectedPaymentMethod === "cash") {
        setPaymentMessage(
          "You must buy your ticket at least 30 minutes before the screening starts. Otherwise, your reservation will expire."
        );
      } else if (selectedPaymentMethod) {
        setPaymentMessage("Proceeding to buy the ticket.");
      } else {
        setPaymentMessage(null);
      }
    } else {
      setPaymentMessage(null);
    }
  }, [activeTab, selectedPaymentMethod]);

  const buttonText =
    activeTab === "payment"
      ? selectedPaymentMethod === "cash"
        ? "Reserve"
        : "Buy"
      : "Next";

  const createTickets = async () => {
    if (!screening || !selectedSeats.length) return;

    try {
      const requests = selectedSeats.map((seat) => {
        const ticketData = {
          ScreeningId: screening.id,
          UserId: isAuthenticated ? nameidentifier : null,
          Email: email,
          SeatId: seat.id,
          CouponId: couponId || null,
        };

        return api.post("/Ticket", ticketData);
      });

      await Promise.all(requests);

      handleBuy();
    } catch (error) {
      console.error("Error details:", error);
      alert(`Failed to create tickets. Error: ${error}`);
    }
  };

  const applyCoupon = async () => {
    try {
      const response = await api.get<Coupon[]>("/Coupon/all");
      const coupon = response.data.find(
        (c) =>
          c.code === couponCode &&
          c.isActive &&
          new Date(c.expiryDate) > new Date()
      );
  
      if (coupon) {
        setCouponId(coupon.id);
        if (coupon.discountAmount > 0) {
          setDiscount(coupon.discountAmount);
        } else if (coupon.discountPercent > 0) {
          setDiscount((totalPrice * coupon.discountPercent) / 100);
        }
        alert("Coupon applied successfully!");
      } else {
        alert("Invalid or expired coupon!");
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      alert("An error occurred while applying the coupon.");
    }
  };

  const isValidEmail = email.includes("@") && email.includes(".");
  const canProceedToTicketDetails = selectedSeats.length > 0;
  const canProceedToPayment = canProceedToTicketDetails && isValidEmail;

  const handleNext = async () => {
    if (activeTab === "seatMap" && selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }

    if (
      activeTab === "ticketDetails" &&
      !isAuthenticated &&
      (!email.includes("@") || !email.includes("."))
    ) {
      alert("Please enter a valid email address.");
      return;
    }

    if (activeTab === "payment") {
      if (selectedPaymentMethod === "cash") {
        setPaymentMessage(
          "You must buy your ticket at least 30 minutes before the screening starts. Otherwise, your reservation will expire."
        );

        if (!screening || !selectedSeats.length) return;

        try {
          const reservationData = {
            ScreeningId: screening.id,
            UserId: isAuthenticated ? nameidentifier : null,
            Email: email,
            Seats: selectedSeats.map((seat) => ({
              id: seat.id,
              rowNumber: seat.rowNumber,
              seatNumber: seat.seatNumber,
            })),
          };

          await api.post("/Reservation", reservationData);
          handleReserve();
        } catch (error) {
          console.error("Error creating reservation:", error);
          alert(`Failed to create reservation. Error: ${error}`);
        }
      } else {
        await createTickets();
      }
    } else {
      if (activeTab === "seatMap") {
        setActiveTab("ticketDetails");
      } else if (activeTab === "ticketDetails") {
        setActiveTab("payment");
      }
    }
  };

  if (!screening || !movie || !hall) {
    return <div className="loading-container"><LoadingIcon /></div>;
  }

  return (
    <div className="screening-container">
      <div className="screening-header">
        <div
          className="background-image"
          style={{
            backgroundImage: `url(${movie.backgroundImageUrl})`,
          }}
        />
        <img
          src={movie.imageUrl}
          alt={`${movie.title} Poster`}
          className="screening-poster"
        />
        <div className="screening-title">{movie.title}</div>
      </div>
      <div className="screening-content">
        <div className="selected-seats-section">
          {selectedSeats.length > 0 ? (
            <ul>
              {selectedSeats.map((seat) => (
                <li key={`${seat.rowNumber}-${seat.seatNumber}`}>
                  <span className="row-number">{seat.rowNumber}</span>
                  <span className="after-row">row</span>
                  <span className="seat-number">{seat.seatNumber}</span>
                  <span className="after-row">th</span>
                  <span className="seat-price">${seat.price}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="select-seats">Select Seats</p>
          )}
          <div className="seats-total-price">
            {discount > 0 && (
              <div className="discount-applied">-${discount.toFixed(2)}</div>
            )}
            <span className="total">Total:</span>
            <span className="total-price">${discountedPrice.toFixed(2)}</span>
          </div>
          <div className="action-buttons">
            <button
              className="cancel-button"
              onClick={() => navigate("/schedule")}
            >
              Cancel
            </button>
            <button
              className="buy-button"
              onClick={handleNext}
              disabled={
                activeTab === "payment" &&
                (!selectedPaymentMethod || selectedSeats.length === 0)
              }
            >
              {buttonText}
            </button>
          </div>
          {paymentMessage && (
            <p className="payment-message">{paymentMessage}</p>
          )}
        </div>
        <div className="screening-seat-map-container">
          <div className="tab-buttons">
            <button
              className={activeTab === "seatMap" ? "active" : ""}
              onClick={() => setActiveTab("seatMap")}
            >
              Seat Map
            </button>
            <button
              className={activeTab === "ticketDetails" ? "active" : ""}
              onClick={() => setActiveTab("ticketDetails")}
              disabled={!canProceedToTicketDetails}
            >
              Ticket Details
            </button>
            <button
              className={activeTab === "payment" ? "active" : ""}
              onClick={() => setActiveTab("payment")}
              disabled={!canProceedToPayment}
            >
              Payment
            </button>
          </div>
          {activeTab === "seatMap" && (
            <>
              <div className="screen-container">
                <div className="screen">Screen</div>
              </div>
              <ScreeningSeatMap
                seats={hall.seats.map((seat) => ({
                  id: seat.id,
                  rowNumber: seat.rowNumber,
                  seatNumber: seat.seatNumber,
                  hallId: seat.hallId,
                }))}
                pricePerSeat={screening.price}
                selectedSeats={selectedSeats}
                onSeatSelectionChange={handleSeatSelectionChange}
                reservedSeats={reservedSeats}
              />
            </>
          )}
          {activeTab === "ticketDetails" && (
            <div className="ticket-details">
              <h5>Apply Coupon</h5>
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button onClick={applyCoupon}>Apply</button>
              <div className="email-container">
                <h2>Enter Your Email</h2>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {!isAuthenticated &&
                  (!email.includes("@") || !email.includes(".")) && (
                    <p className="error-message">
                      Please enter a valid email address.
                    </p>
                  )}
              </div>
            </div>
          )}
          {activeTab === "payment" && (
            <div className="payment-options">
              <div className="payment-header">Select Payment Method</div>
              <div className="payment-option">
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="creditCard"
                    className="radio-input"
                    checked={selectedPaymentMethod === "creditCard"}
                    onChange={() => handlePaymentMethodChange("creditCard")}
                  />
                  <FontAwesomeIcon
                    icon={faCreditCard}
                    className="payment-icon"
                  />
                  Credit Card
                </label>
              </div>
              <div className="payment-option">
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    className="radio-input"
                    checked={selectedPaymentMethod === "paypal"}
                    onChange={() => handlePaymentMethodChange("paypal")}
                  />
                  <FontAwesomeIcon icon={faPaypal} className="payment-icon" />
                  PayPal
                </label>
              </div>
              <div className="payment-option">
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="googlepay"
                    className="radio-input"
                    checked={selectedPaymentMethod === "googlepay"}
                    onChange={() => handlePaymentMethodChange("googlepay")}
                  />
                  <FontAwesomeIcon
                    icon={faGooglePay}
                    className="payment-icon"
                  />
                  GOOGLE PAY
                </label>
              </div>
              <div className="payment-option">
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    className="radio-input"
                    checked={selectedPaymentMethod === "cash"}
                    onChange={() => handlePaymentMethodChange("cash")}
                  />
                  <FontAwesomeIcon
                    icon={faMoneyBillWave}
                    className="payment-icon"
                  />
                  Cash at Register
                </label>
              </div>
            </div>
          )}
        </div>
        <div className="screening-date-details">
          <span className="date">Date:</span>
          <div className="screening-date">
            <span className="day">
              {new Date(screening.screeningTime).getDate()}
            </span>
            <span className="month">
              {new Date(screening.screeningTime)
                .toLocaleString("en-US", { month: "short" })
                .toLowerCase()}
            </span>
          </div>
          <span className="date">Duration:</span>
          <div className="screening-times">
            {new Date(screening.screeningTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            -{" "}
            {new Date(
              new Date(screening.screeningTime).getTime() +
                movie.duration * 60000
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <span className="date">Details:</span>
          <div className="screening-details">
            {screening.is3D ? "3D" : "2D"}
            {screening.isSubtitled ? "/SUBTITLED" : ""}
          </div>
        </div>
      </div>
      <PopupForm
        isOpen={showQRCodePopup}
        onClose={() => {
          setShowQRCodePopup(false);
          navigate("/schedule");
        }}
        title="Your QR Code"
      >
        <div style={{ background: "white", padding: "16px", color: "black" }}>
          <div>Save and show to cashier</div>
          <QRCodeCanvas value={qrData} size={256} />
          <div style={{ color: "black", padding: "16px" }}>{qrData}</div>
        </div>
      </PopupForm>
    </div>
  );
};

export default Screening;
