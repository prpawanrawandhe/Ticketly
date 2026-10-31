
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import "./BookingProcess.css";
import { AuthContext } from "../../context/AuthContext";



const BookingProcess = () => {
    const { state } = useLocation();
    const { access_token } = useContext(AuthContext)

    const location = useLocation();
    const navigate = useNavigate();
    const bus = state?.bus;
    const selectedSeats = state?.selectedSeats || [];
    const seater_price = Number(bus.seater_price || 0);
    const sleeper_price = Number(bus.sleeper_price || 0);

    const seaterSeats = selectedSeats.filter(seat => seat.startsWith("S"));
    const sleeperSeats = selectedSeats.filter(seat => seat.startsWith("U"));

    const seaterTotal = seaterSeats.length * seater_price;
    const sleeperTotal = sleeperSeats.length * sleeper_price;
    const totalAmount = seaterTotal + sleeperTotal;


    useEffect(() => {
        if (!access_token) {
            navigate("/login", {
                replace: true,
                state: {
                    from: location.pathname,
                    bookingData: location.state
                }
            });
        }
    }, [access_token, navigate]);


    const [passengers, setPassengers] = useState(
        selectedSeats.map((seat) => ({
            seat,
            name: "",
            age: ""
        }))
    );

    if (!bus || selectedSeats.length === 0) {
        return (
            <div className="booking-error">
                Booking details nahi mili.
                <button onClick={() => navigate("/")}>Go Home</button>
            </div>
        );
    }

    const updatePassenger = (index, field, value) => {
        setPassengers((prev) =>
            prev.map((passenger, i) =>
                i === index
                    ? { ...passenger, [field]: value }
                    : passenger
            )
        );
    };

    const handleContinue = (e) => {
        e.preventDefault();

        navigate("/payment", {
            state: { bus, selectedSeats,passengers }
        });
    };

    return (
        <div className="booking-page">
            <div className="booking-container">
                <div className="booking-heading">
                    <h2>Complete Your Booking</h2>
                    <p>Enter passenger details for your journey.</p>
                </div>

                <div className="booking-bus-card">
                    <div>
                        <h3>{bus.bus?.bus_name}</h3>
                        <p>{bus.route?.source} → {bus.route?.destination}</p>
                    </div>

                    <div className="booking-seat-count">
                        {selectedSeats.length} Seats
                    </div>
                </div>

                <form onSubmit={handleContinue}>
                    <h3 className="passenger-heading">
                        Passenger Details
                    </h3>

                    {passengers.map((passenger, index) => (
                        <div className="passenger-card" key={passenger.seat}>
                            <div className="passenger-card-heading">
                                <h4>Passenger {index + 1}</h4>
                                <span>Seat {passenger.seat}</span>
                            </div>

                            <div className="passenger-fields">
                                <div className="form-field">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter passenger name"
                                        value={passenger.name}
                                        onChange={(e) =>
                                            updatePassenger(
                                                index,
                                                "name",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </div>

                                <div className="form-field">
                                    <label>Age</label>
                                    <input
                                        type="number"
                                        placeholder="Age"
                                        min="1"
                                        max="120"
                                        value={passenger.age}
                                        onChange={(e) =>
                                            updatePassenger(
                                                index,
                                                "age",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="price-breakdown">
                        <h3>Price Breakdown</h3>
                        {seaterSeats.length > 0 ? <>
                            <div className="price-row">
                                <span>Seater ({seaterSeats.length} seats)</span>
                                <span>₹{seaterTotal}</span>
                            </div>
                        </> : <></>}

                        {sleeperSeats.length > 0 ? <>
                            <div className="price-row">
                                <span>Sleeper ({sleeperSeats.length} seats)</span>
                                <span>₹{sleeperTotal}</span>
                            </div>
                        </> : <></>}

                        {selectedSeats.length > 0 ? <>
                            <div className="price-row">
                                <span>Total Seats</span>
                                <span>{selectedSeats.length}</span>
                            </div>
                        </> : <></>}
                        <div className="price-total">
                            <span>Total Amount</span>
                            <span>₹{totalAmount}</span>
                        </div>
                    </div>
                    <button className="booking-continue-btn" type="submit">
                        Continue to Payment →
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookingProcess;
