import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

function Navbar() {
    const { username,setUsername ,setaccess_token} = useContext(AuthContext);


    const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    setaccess_token("")

    setUsername(null);
    };

    return (
        <nav className="navbar navbar-expand-lg bg-white py-3 shadow-sm">
            <div className="container">
                <Link 
                    className="navbar-brand fw-bold fs-2"
                    to="/"
                    style={{ color: "#800020" }}
                >
                    Ticketly
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarContent"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div
                    className="collapse navbar-collapse"
                    id="navbarContent"
                >
                    <div className="navbar-nav mx-auto gap-lg-4">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `nav-link fw-semibold ${isActive ? "active" : ""}`
                            }
                            style={({ isActive }) => ({
                                color: isActive ? "#a00024" : "#333",
                            })}
                        >
                            Home
                        </NavLink>

                        <NavLink className="nav-link fw-semibold" to="/mybookings">
                            My Bookings
                        </NavLink>

                        <NavLink className="nav-link fw-semibold" to="/wallet">
                            Wallet
                        </NavLink>
                    </div>

                    {username ? <>
                        <span
                            className="fw-bold px-3 py-2 rounded-pill"
                            style={{
                                color: "#800020",
                            }}
                        >
                            Hi, {username}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="btn fw-semibold px-4 py-2 rounded-3"
                            style={{
                                color: "#a00024",
                                border: "1px solid #a00024",
                            }}
                        >
                            Logout
                        </button>
                    </> : <>
                        <Link
                            to="/login"
                            className="btn fw-semibold px-4 py-2 rounded-3"
                            style={{
                                color: "#a00024",
                                border: "1px solid #a00024",
                            }}
                        >
                            Login
                        </Link>
                    </>}

                </div>
            </div>
        </nav>
    );
}

export default Navbar;