
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./MyBookings.css";
import { refreshAccessToken } from "../../services/auth";
import fetchBookings from "../../services/myBookings";



const MyBookings = () => {
    const { access_token } = useContext(AuthContext);
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [activeBooking, setActiveBooking] = useState(null);
    const location = useLocation();

    useEffect(() => {
        if (!access_token) {
            navigate("/login", {
                replace: true,
                state: {
                    from: location
                }
            });
        }
    }, [access_token, navigate]);

    useEffect(() => {
        const getData = async () => {
            setLoading(true)
            let data = await fetchBookings()

            if (data === 401) {
                const new_access = await refreshAccessToken()

                if (new_access === null) {
                    navigate("/login", {
                        replace: true,
                        state: {
                            from: location
                        }
                    })
                }
                data = await fetchBookings()
            }
                setBookings(data)
                setLoading(false)
        }
        getData()
    }, [access_token]);

    const getStatus = (booking) => {
        const status = String(
            booking.status || booking.booking_status || "confirmed"
        ).toLowerCase();

        if (status.includes("cancel")) return "cancelled";
        if (status.includes("pending")) return "pending";
        return "confirmed";
    };

    const formatDate = (value) => {
        if (!value) return "Date unavailable";

        return new Date(value).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getPassengers = (booking) =>
        booking.booked_seats || booking.passengers || booking.seats || [];

    if (loading) {
        return <div className="mybookings-message">Loading your bookings...</div>;
    }

    if (error) {
        return (
            <div className="mybookings-message">
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="mybookings-page">
            <section className="mybookings-hero">
                <div className="mybookings-hero-inner">
                    <div className="mybookings-hero-icon">🎟</div>
                    <div>
                        <h1>My Bookings</h1>
                        <p>View and manage your bus journeys</p>
                    </div>
                </div>
            </section>

            <main className="mybookings-content">
                <div className="mybookings-topline">
                    <h2>Your Journeys</h2>
                    <span>{bookings.length} booking(s)</span>
                </div>

                {bookings.length === 0 ? (
                    <div className="mybookings-empty">
                        <div className="empty-bus">🚌</div>
                        <h2>No bookings found</h2>
                        <p>Your next journey is just a few clicks away.</p>
                        <button onClick={() => navigate("/")}>
                            Book a Bus
                        </button>
                    </div>
                ) : (
                    <div className="mybookings-list">
                        {bookings.slice().reverse().map((booking) => {
                            const schedule = booking.schedule || booking;
                            const bus = schedule.bus || {};
                            const route = schedule.route || {};
                            const passengers = getPassengers(booking);
                            const status = getStatus(booking);
                            const bookingId = booking.id;

                            const seats = passengers.map((p) =>
                                typeof p === "string"
                                    ? p
                                    : p.seat_number || p.seat || ""
                            ).filter(Boolean);

                            return (
                                <article
                                    className="mybooking-card"
                                    key={bookingId}
                                >
                                    <div className="mybooking-main">
                                        <div className="mybooking-bus-icon">
                                            🚌
                                        </div>

                                        <div className="mybooking-route">
                                            <h3>
                                                {bus.bus_name || "Bus booking"}
                                            </h3>
                                            <p className="mybooking-bus-type">
                                                {bus.bus_type || "Bus journey"}
                                            </p>

                                            <div className="route-line">
                                                <span className="route-dot from-dot" />
                                                <strong>
                                                    {route.source || "Source"}
                                                </strong>
                                                <span className="route-arrow">→</span>
                                                <span className="route-dot to-dot" />
                                                <strong>
                                                    {route.destination || "Destination"}
                                                </strong>
                                            </div>

                                            <div className="journey-meta">
                                                <span>▦ {formatDate(schedule.departure_time)}</span>
                                                <span>
                                                    ◷{" "}
                                                    {schedule.departure_time
                                                        ? new Date(
                                                            schedule.departure_time
                                                        ).toLocaleTimeString(
                                                            "en-IN",
                                                            {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            }
                                                        )
                                                        : "Time unavailable"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mybooking-passenger-info">
                                            <div>
                                                <span className="info-icon">💺</span>
                                                <section>
                                                    <small>Seats</small>
                                                    <strong>
                                                        {seats.length
                                                            ? seats.join(", ")
                                                            : "Not available"}
                                                    </strong>
                                                </section>
                                            </div>

                                            <div>
                                                <span className="info-icon">👤</span>
                                                <section>
                                                    <small>Passengers</small>
                                                    <strong>
                                                        {passengers.length
                                                            ? passengers
                                                                .map((p) =>
                                                                    typeof p === "string"
                                                                        ? p
                                                                        : p.passenger_name ||
                                                                        p.name ||
                                                                        "Passenger"
                                                                )
                                                                .join(", ")
                                                            : "Details unavailable"}
                                                    </strong>
                                                </section>
                                            </div>
                                        </div>

                                        <div className="mybooking-actions">
                                            <span
                                                className={`booking-status ${status}`}
                                            >
                                                ●{" "}
                                                {status === "confirmed"
                                                    ? "Confirmed"
                                                    : status === "cancelled"
                                                        ? "Cancelled"
                                                        : "Pending"}
                                            </span>

                                            <p className="booking-reference">
                                                Booking ID: {bookingId ?? "—"}
                                            </p>

                                            <h3 className="booking-fare">
                                                ₹{Number(
                                                    booking.total_fare || 0
                                                ).toLocaleString("en-IN")}
                                            </h3>

                                            <button
                                                className="view-booking-btn"
                                                onClick={() =>
                                                    setActiveBooking(
                                                        activeBooking === bookingId
                                                            ? null
                                                            : bookingId
                                                    )
                                                }
                                            >
                                                {activeBooking === bookingId
                                                    ? "Hide Details"
                                                    : "View Details"}
                                            </button>
                                        </div>
                                    </div>

                                    {activeBooking === bookingId && (
                                        <div className="mybooking-expanded">
                                            <h4>Passenger Details</h4>

                                            {passengers.length ? (
                                                passengers.map((p, index) => (
                                                    <div
                                                        className="expanded-passenger"
                                                        key={p.id || p.seat_number || index}
                                                    >
                                                        <span>
                                                            {p.passenger_name ||
                                                                p.name ||
                                                                "Passenger"}
                                                        </span>
                                                        <span>
                                                            Age: {p.passenger_age ?? p.age ?? "—"}
                                                        </span>
                                                        <span>
                                                            Seat: {p.seat_number || p.seat || "—"}
                                                        </span>
                                                    </div>
                                                ))
                                            ) : (
                                                <p>Passenger details unavailable.</p>
                                            )}

                                            <p className="expanded-total">
                                                Total paid/charged: ₹
                                                {Number(
                                                    booking.total_fare || 0
                                                ).toLocaleString("en-IN")}
                                            </p>
                                        </div>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyBookings;
