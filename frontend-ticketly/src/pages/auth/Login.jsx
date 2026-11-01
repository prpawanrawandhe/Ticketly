import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import userlogin from "../../services/auth";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

function Login() {
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()
  const {setUsername,setaccess_token} = useContext(AuthContext)
  const location = useLocation()
  const from = location.state?.from || '/'
  const bookingData = location.state?.bookingData;
  const [loading, setloading] = useState(false)
  const [error, seterror] = useState("")

  return (
    <div
      className="container-fluid min-vh-100 d-flex align-items-center justify-content-center p-3"
      style={{
        background: "linear-gradient(135deg, #fff0f2, #f8e4e9)",
      }}
    >
      <div
        className="row bg-white rounded-4 overflow-hidden shadow-lg w-100"
        style={{ maxWidth: "950px", minHeight: "550px" }}
      >
        {/* Left Branding Section */}
        <div
          className="col-md-5 d-flex flex-column justify-content-center text-white p-5"
          style={{
            background: "linear-gradient(145deg, #36000e, #a00024)",
          }}
        >
          <Link
            to="/"
            className="text-white text-decoration-none fw-bold fs-2 mb-5"
          >
            🚌 Ticketly
          </Link>

          <h1 className="fw-bolder display-5 mb-3">
            Welcome
            <br />
            Back!
          </h1>

          <p className="text-white-50 fs-5">
            Your next journey is just a few clicks away.
            Log in and get ready to travel.
          </p>

          <div className="mt-4 fw-semibold">
            ✓ Easy Bookings
            <br />
            <br />
            ✓ Comfortable Journeys
            <br />
            <br />
            ✓ Secure Payments
          </div>
        </div>

        {/* Login Form */}
        <div className="col-md-7 p-4 p-md-5 d-flex flex-column justify-content-center">
          <h2 className="fw-bolder mb-2" style={{ color: "#430014" }}>
            Login to your account
          </h2>

          <p className="text-secondary mb-4">
            Enter your details to continue.
          </p>

          <form
            onSubmit={async(e) => {
              e.preventDefault();
              setloading(true)
              const res = await userlogin(username,password,setUsername,setaccess_token)
              console.log(res)
              if (res === "Authenticated"){
                navigate(from,{replace:true, state: bookingData})
              } else if(res === 401){
                seterror("Invalid Credentials, Try Again!!!")
              } else{
                seterror("Server Not Found")
              }
              setloading(false)
            }}
          >
            <div className="mb-4">
              <label className="form-label fw-semibold">Username</label>
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Enter Your username"
                value={username}
                onChange={(e) => setusername(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                className="form-control form-control-lg"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="text-end mb-4">
              <Link
                to="/forgot-password"
                className="text-decoration-none fw-semibold"
                style={{ color: "#a00024" }}
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled = {loading}
              className="btn btn-lg w-100 text-white fw-bold py-3"
              style={{ backgroundColor: "#a00024" }}
            >
              Login →
            </button>
          </form>
          <p className="text-center mt-4 mb-0" style={{ color: "#441010" }}>{error}</p>

          <p className="text-center mt-4 mb-0 text-secondary">
            New to Ticketly?{" "}
            <Link
              to="/register"
              className="fw-bold text-decoration-none"
              style={{ color: "#a00024" }}
            >
              Create Account
            </Link>
          </p>

          <div className="text-center mt-4">
            <Link to="/" className="text-secondary text-decoration-none">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
