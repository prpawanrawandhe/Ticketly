
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Wallet.css";
import wallet_data from "../../services/wallet";
import addMoneyApi from "../../services/add-money-wallet";
import { AuthContext } from "../../context/AuthContext";


const Wallet = () => {
    const navigate = useNavigate();

    const [balance, setBalance] = useState("----");
    const [amount, setAmount] = useState("");
    const [message, setMessage] = useState("");
    const [transactions, setTransactions] = useState([]);
    const { access_token, setaccess_token } = useContext(AuthContext)
    const [loading, setloading] = useState("")
    const [error, seterror] = useState(false)


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
        setloading(true)
        const getData = async () => {
            let wallet = await wallet_data();
            if (wallet.wallet_balance === "error"){
                setloading(false)
                seterror("Server Not Found")
            }else{
                setBalance(wallet.wallet_balance.balance)
                setTransactions(wallet.payments)
            }
        }
        getData()
        setloading(false)
    }, [amount])


    const addMoney = async (value) => {
        const money = Number(value);

        if (!Number.isFinite(money) || money <= 0) {
            setMessage("Please enter a valid amount.");
            return;
        }

        if (money > 10000) {
            setMessage("Demo top-up limit is ₹10,000.");
            return;
        }
        const add_money = await addMoneyApi(amount)
        // setBalance((prev) => prev?

        setAmount("");
        setMessage(`₹${money.toLocaleString("en-IN")} added successfully!`);
    };

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
        <div className="wallet-page">
            <div className="wallet-heading">
                <div>
                    <h1>My Wallet</h1>
                    <p>Manage your money and track transactions.</p>
                </div>
                <span className="wallet-heading-icon">👛</span>
            </div>

            <div className="wallet-layout">
                <div className="wallet-left">
                    <section className="wallet-balance-card">
                        <div className="wallet-card-top">
                            <span>Available Balance</span>
                            <span className="wallet-card-symbol">₹</span>
                        </div>

                        <h2>₹{balance.toLocaleString("en-IN")}</h2>
                        <p>Your Ticketly wallet</p>

                        <div className="wallet-card-bottom">
                            <span>● Demo Wallet</span>
                            <span>INR ₹</span>
                        </div>
                    </section>

                    <section className="wallet-add-card">
                        <h2>Add Money</h2>
                        <p>Choose an amount to top up your wallet.</p>

                        <div className="wallet-quick-amounts">
                            {[100, 200, 500, 1000].map((value) => (
                                <button
                                    type="button"
                                    key={value}
                                    className={
                                        Number(amount) === value
                                            ? "quick-amount active"
                                            : "quick-amount"
                                    }
                                    onClick={() => {
                                        setAmount(String(value));
                                        setMessage("");
                                    }}
                                >
                                    +₹{value}
                                </button>
                            ))}
                        </div>

                        <label htmlFor="wallet-amount">Enter amount</label>

                        <div className="wallet-amount-input">
                            <span>₹</span>
                            <input
                                id="wallet-amount"
                                type="number"
                                min="1"
                                max="10000"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={(e) => {
                                    setAmount(e.target.value);
                                    setMessage("");
                                }}
                            />
                        </div>

                        <button
                            className="wallet-add-btn"
                            onClick={() => addMoney(amount)}
                        >
                            + Add Money
                        </button>

                        {message && (
                            <p className="wallet-message" role="status">
                                {message}
                            </p>
                        )}

                        <p className="wallet-demo-note">
                            Demo mode: no real money will be charged.
                        </p>
                    </section>
                </div>

                <section className="wallet-history-card">
                    <div className="wallet-history-heading">
                        <div>
                            <h2>Transaction History</h2>
                            <p>Your recent wallet activity</p>
                        </div>
                        <span className="wallet-history-count">
                            {transactions.length}
                        </span>
                    </div>

                    {transactions.length === 0 ? (
                        <div className="wallet-empty">
                            <span>📃</span>
                            <h3>No transactions yet</h3>
                            <p>Your wallet activity will appear here.</p>
                        </div>
                    ) : (
                        <div className="wallet-transactions">
                            {transactions.slice().reverse().map((transaction) => (
                                <div
                                    className="wallet-transaction"
                                    key={transaction.id}
                                >
                                    <div
                                        className={
                                            transaction.type === "credit"
                                                ? "transaction-icon credit"
                                                : "transaction-icon debit"
                                        }
                                    >
                                        {transaction.type === "credit"
                                            ? "↓"
                                            : "↑"}
                                    </div>

                                    <div className="transaction-info">
                                        <h3>{transaction.title}</h3>
                                        <p>{transaction.date}</p>
                                        <span className="transaction-status">
                                            ● {transaction.status}
                                        </span>
                                    </div>

                                    <strong
                                        className={
                                            transaction.type === "credit"
                                                ? "transaction-credit"
                                                : "transaction-debit"
                                        }
                                    >
                                        {transaction.type === "credit"
                                            ? "+"
                                            : "−"}
                                        ₹{transaction.amount.toLocaleString("en-IN")}
                                    </strong>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            <button
                className="wallet-back-btn"
                onClick={() => navigate("/")}
            >
                ← Back to Home
            </button>
        </div>
    );
};

export default Wallet;
