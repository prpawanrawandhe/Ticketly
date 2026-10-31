import { useLocation, useNavigate } from "react-router-dom";
import "./PaymentStatus.css";

const PaymentStatus = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const success = state?.booking_confirmation.msg === "Booking confirmed";
    const info = state.booking_confirmation
    const amount = info['Journey Details'].total_fare



    return (
        <div className="status-page">
            <div className="status-card">
                <div className={`status-icon ${success ? "success" : "failed"}`}>
                    {success ? "✓" : "✕"}
                </div>

                <h2>{success ? "Payment Successful!" : "Payment Failed!"}</h2>

                <p>
                    {success
                        ? "Your payment has been completed successfully. Happy journey!"
                        : "We couldn't complete your payment. Please try again."}
                </p>
                <p>Transaction Id : {info.transaction_id}</p>


                {success && amount != null && (
                    <div className="status-amount">
                        Amount Paid
                        <h3>₹{Number(amount).toLocaleString("en-IN")}</h3>
                    </div>
                )}

                <button
                    className="status-primary-btn"
                    onClick={() =>
                        navigate("/mybookings")
                    }
                >
                    {success ? "View My Bookings" : "Try Again"}
                </button>

                <button
                    className="status-home-btn"
                    onClick={() => navigate("/")}
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default PaymentStatus;