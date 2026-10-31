import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div
      className="container-fluid min-vh-100 d-flex align-items-center justify-content-center p-3"
      style={{ background: "linear-gradient(135deg, #fff0f2, #f8e4e9)" }}
    >
      <div
        className="row bg-white rounded-4 overflow-hidden shadow-lg w-100"
        style={{ maxWidth: "1000px" }}
      >
        {/* Left Branding */}
        <div
          className="col-lg-5 d-flex flex-column justify-content-center text-white p-5"
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

          <h1 className="display-5 fw-bolder mb-3">
            Start Your
            <br />
            Journey!
          </h1>

          <p className="fs-5 text-white-50">
            Create your account and discover a better way to travel.
          </p>

          <div className="mt-4">
            <p className="fw-semibold">✓ Quick & Easy Booking</p>
            <p className="fw-semibold">✓ Explore New Destinations</p>
            <p className="fw-semibold">✓ Hassle-Free Travel</p>
          </div>

          <div
            className="rounded-4 p-3 mt-3"
            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          >
            <p className="mb-1 fw-bold">Your next adventure awaits.</p>
            <small className="text-white-50">
              One account. Countless journeys.
            </small>
          </div>
        </div>

        {/* Registration Form */}
        <div className="col-lg-7 p-4 p-md-5">
          <h2 className="fw-bolder mb-2" style={{ color: "#430014" }}>
            Create Account
          </h2>

          <p className="text-secondary mb-4">
            Join Ticketly and travel your way.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log(formData);
            }}
          >
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  className="form-control form-control-lg"
                  placeholder="Your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Username</label>
                <input
                  type="text"
                  name="username"
                  className="form-control form-control-lg"
                  placeholder="Choose username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-control form-control-lg"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control form-control-lg"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control form-control-lg"
                  placeholder="Repeat password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-lg w-100 text-white fw-bold py-3 mt-4"
              style={{ backgroundColor: "#a00024" }}
            >
              Create Account →
            </button>
          </form>

          <p className="text-center text-secondary mt-4 mb-2">
            Already have an account?{" "}
            <Link
              to="/login"
              className="fw-bold text-decoration-none"
              style={{ color: "#a00024" }}
            >
              Login
            </Link>
          </p>

          <div className="text-center mt-3">
            <Link to="/" className="text-secondary text-decoration-none">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;