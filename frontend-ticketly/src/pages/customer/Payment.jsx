import { useLocation, useNavigate ,Link} from "react-router-dom";
import "./Payment.css";
import React, { useContext, useEffect, useState } from "react";
import booking_confirm from "../../services/payment";
import { AuthContext } from "../../context/AuthContext";
import booking from "../../services/booking";
import { refreshAccessToken } from "../../services/auth";
import { getBalance } from "../../services/wallet";


const Payment = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const location = useLocation()
    const { access_token } = useContext(AuthContext)
    const { bus, selectedSeats, passengers } = state || {};
    const [walletBalance, setWalletBalance] = React.useState(0);

    useEffect(() => {
        const getbalance = async() => {
            let balance = await getBalance()

            if (balance === 401) {
                const new_access = await refreshAccessToken()

                if (new_access === null) {
                    navigate("/login", {
                        replace: true,
                        state: {
                            from: location
                        }
                    })
                    return
                    
                }
                balance = await getBalance()
            }
            setWalletBalance(balance.balance)

        }
        getbalance()
        }, [])


    const totalAmount = selectedSeats?.reduce((total, seat) => {
        return total + (
            seat.startsWith("U")
                ? Number(bus?.sleeper_price || 0)
                : Number(bus?.seater_price || 0)
        );
    }, 0) || 0;

    const handlePayment = async () => {
        if (walletBalance < totalAmount) {
            alert("Insufficient wallet balance!");
            return;
        }

        const booking_data = {
            seats: selectedSeats,
            passengers: passengers
        };

        let token = access_token;

        let create_booking = await booking(bus.id, booking_data, token);

        if (create_booking === 401) {
            token = await refreshAccessToken();

            if (!token) {
                navigate("/login", {
                    replace: true,
                    state: { from: location }
                });
                return;
            }

            create_booking = await booking(bus.id, booking_data, token);
        }

        if (!create_booking || create_booking === 401) {
            alert("Booking failed!");
            return;
        }

        const booking_confirmation = await booking_confirm(
            create_booking.booking_id,
            token
        );

        if (booking_confirmation === 401) {
            token = await refreshAccessToken();

            if (!token) {
                navigate("/login", {
                    replace: true,
                    state: { from: location }
                });
                return;
            }
        }

        setWalletBalance(prev => prev - totalAmount);

        navigate('/payment-status/', {
            state: { booking_confirmation }
        });
    };


    return (
        <div className="payment-page">
            <div className="payment-container">
                <div className="payment-header">
                    <h2>Complete Payment</h2>
                    <p>Secure payment for your journey</p>
                </div>

                <div className="wallet-card">
                    <div>
                        <p>Available Wallet Balance</p>
                        <h2>₹{walletBalance.toLocaleString("en-IN")}</h2>
                    </div>
                    <span className="wallet-icon">₹</span>
                </div>

                <div className="payment-summary">
                    <h3>Booking Summary</h3>

                    <div className="payment-row">
                        <span>Bus</span>
                        <strong>{bus?.bus?.bus_name}</strong>
                    </div>

                    <div className="payment-row">
                        <span>Journey</span>
                        <strong>
                            {bus?.route?.source} → {bus?.route?.destination}
                        </strong>
                    </div>

                    <div className="payment-row">
                        <span>Selected Seats</span>
                        <strong>{selectedSeats?.join(", ")}</strong>
                    </div>

                    <div className="payment-row">
                        <span>Total Seats</span>
                        <strong>{selectedSeats?.length || 0}</strong>
                    </div>

                    <div className="payment-total">
                        <span>Total Amount</span>
                        <h2>₹{totalAmount.toLocaleString("en-IN")}</h2>
                    </div>

                    <div className="payment-row balance-after">
                        <span>Balance After Payment</span>
                        <strong>
                            ₹{Math.max(0, walletBalance - totalAmount).toLocaleString("en-IN")}
                        </strong>
                    </div>

                    <button
                        className="pay-now-btn"
                        onClick={handlePayment}
                        disabled={totalAmount <= 0 || walletBalance < totalAmount}
                    >
                        {walletBalance < totalAmount
                            ? "Insufficient Balance"
                            : `Pay ₹${totalAmount.toLocaleString("en-IN")}`}
                    </button>

                    {walletBalance < totalAmount && (
                        <p className="wallet-warning">
                            Your wallet balance is insufficient. Please
                            <Link style={{ textDecoration: "none" }} to={"/wallet/"}> Add Money</Link>
                        </p>
                    )}

                    <p className="secure-note">
                        🔒 Your payment is protected
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Payment;
