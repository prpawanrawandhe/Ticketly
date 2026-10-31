
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import listBuses from "../../services/buses";
import routsApi from "../../services/source-destination";

function Home() {
    const today = new Date().toLocaleDateString("en-CA");
    const tomorrow = new Date(Date.now() + 86400000).toLocaleDateString("en-CA");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [date, setDate] = useState(today);
    const navigate = useNavigate()
    const [sources, setsources] = useState([])
    const [destinations, setdestinations] = useState([])
    const [source_dropdown, setsource_dropdown] = useState(false)
    const [destination_dropdown, setdestination_dropdown] = useState(false)


    useEffect(() => {
        const getData = async () => {
            if (from) {

                const routes = await routsApi(from)
                if (routes.length === 0) {
                    return
                }
                const sources = [...new Set(routes.map(route => route.source))]
                const destination = [...new Set(routes.map(route => route.destination))]
                setsources(sources)
                setdestinations(destination)


            }
            else {
                setsources([])
                setdestinations([])
            }

        }
        getData()

    }, [from])



    return (
        <div style={{ backgroundColor: "#fffafa", minHeight: "100vh" }}>
            {/* Hero Banner */}
            <section
                className="text-white d-flex align-items-center"
                style={{
                    minHeight: "400px",
                    background:
                        "linear-gradient(90deg, #24000b 0%, #65001b 55%, #a00024 100%)",
                }}
            >
                <div className="container py-5">
                    <div className="row align-items-center">
                        <div className="col-lg-7">
                            <p className="fw-bold text-uppercase mb-3"
                                style={{ letterSpacing: "3px", color: "#ffb3c1" }}>
                                Safe · Comfortable · On Time
                            </p>

                            <h1 className="display-3 fw-bolder mb-3">
                                Your Journey
                                <br />
                                <span style={{ color: "#ff526b" }}>Starts Here.</span>
                            </h1>

                            <p className="fs-5 text-white-50">
                                Book your bus tickets easily, travel comfortably,
                                <br className="d-none d-md-block" />
                                and reach your destination with Ticketly.
                            </p>

                            <div className="d-flex gap-4 mt-4">
                                <span>✓ Easy Booking</span>
                                <span>✓ Secure Payments</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bus Search */}
            <section className="container" style={{ marginTop: "-35px", position: "relative" }}>
                <div className="card border-0 shadow-lg rounded-4 p-4">
                    <h4 className="fw-bold mb-4" style={{ color: "#65001b" }}>
                        Find Your Bus
                    </h4>
                    <form onSubmit={async (e) => {
                        e.preventDefault();
 
                        navigate('/buslist/', { state: { from, to, date } });
                    }}>

                        <div className="row g-3 align-items-end">
                            <div className="col-lg-3 col-md-6">
                                <label className="form-label fw-bold">From</label>
                                <div className="position-relative">

                                    <input
                                        required
                                        className="form-control form-control-lg"
                                        placeholder="Departure city"
                                        type="text"
                                        value={from}
                                        onClick={()=>setdestination_dropdown(false)}
                                        onChange={(e) => { setFrom(e.target.value); setsource_dropdown(true) }}
                                    />

                                    {source_dropdown && sources.length > 0 && (
                                        <div className="dropdown-menu show w-100">
                                            {sources.map((source, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    className="dropdown-item"
                                                    
                                                    onClick={() => { setFrom(source); setsource_dropdown(false) }}
                                                >
                                                    {source}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                </div>
                            </div>

                            <div className="col-lg-3 col-md-6">
                                <label className="form-label fw-bold">To</label>
                                {/* <input
                                    className="form-control form-control-lg"
                                    placeholder="Destination city"
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                    required
                                /> */}
                                <div className="position-relative">

                                    <input
                                        required
                                        className="form-control form-control-lg"
                                        placeholder="Destination city"
                                        type="text"
                                        value={to}
                                        onClick={()=>setsource_dropdown(false)}
                                        onChange={(e) => {setTo(e.target.value);setdestination_dropdown(true)}}
                                    />

                                    {destination_dropdown && destinations.length > 0 && (
                                        <div className="dropdown-menu show w-100">
                                            {destinations.map((destination, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    className="dropdown-item"
                                                    onClick={() => {setTo(destination); setdestination_dropdown(false)}}
                                                >
                                                    {destination}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                </div>

                            </div>

                            <div className="col-lg-3 col-md-6">
                                <label className="form-label fw-bold">Travel Date</label>

                                <div className="d-flex gap-2 mb-2">
                                    <button
                                        className={`btn flex-fill ${date === today ? "text-white" : "btn-outline-danger"}`}
                                        style={date === today ? { backgroundColor: "#a00024" } : {}}
                                        onClick={() => setDate(today)}
                                    >
                                        Today
                                    </button>

                                    <button
                                        className={`btn flex-fill ${date === tomorrow ? "text-white" : "btn-outline-danger"}`}
                                        style={date === tomorrow ? { backgroundColor: "#a00024" } : {}}
                                        onClick={() => setDate(tomorrow)}
                                    >
                                        Tomorrow
                                    </button>
                                </div>

                                <input
                                    name="date-field"
                                    type="date"
                                    className="form-control"
                                    min={today}
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="col-lg-3 col-md-6">
                                <button
                                    type="submit"
                                    className="btn btn-lg w-100 fw-bold text-white"
                                    style={{ backgroundColor: "#a00024" }}
                                >
                                    Search Buses
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </section>

            {/* Benefits */}
            <section className="container py-5">
                <div className="row text-center g-4">
                    <div className="col-md-4">
                        <div className="fs-1">🚌</div>
                        <h5 className="fw-bold mt-2" style={{ color: "#800020" }}>
                            Wide Range of Buses
                        </h5>
                        <p className="text-secondary">From AC Seaters to Sleeper Coaches</p>
                    </div>

                    <div className="col-md-4">
                        <div className="fs-1">🛡️</div>
                        <h5 className="fw-bold mt-2" style={{ color: "#800020" }}>
                            Secure Payments
                        </h5>
                        <p className="text-secondary">Safe and trusted transactions</p>
                    </div>

                    <div className="col-md-4">
                        <div className="fs-1">🎧</div>
                        <h5 className="fw-bold mt-2" style={{ color: "#800020" }}>
                            24/7 Support
                        </h5>
                        <p className="text-secondary">We're always here to help</p>
                    </div>
                </div>
                <section className="container py-5">
                    <div
                        className="rounded-4 p-4 p-md-5 text-white shadow"
                        style={{
                            background: "linear-gradient(120deg, #430014, #a00024)",
                        }}
                    >
                        <div className="row align-items-center g-4">
                            <div className="col-lg-8">
                                <span className="badge bg-white text-danger mb-3 px-3 py-2">
                                    WHAT'S NEW
                                </span>

                                <h2 className="fw-bolder display-6">
                                    Your Next Adventure Starts Here!
                                </h2>

                                <p className="fs-5 mb-0 text-white-50">
                                    Explore new destinations, find your perfect bus
                                    and make every journey comfortable with Ticketly.
                                </p>
                            </div>

                            <div className="col-lg-4 text-lg-end">
                                <a href="/search" className="btn btn-light btn-lg fw-bold px-4"
                                    style={{ color: "#800020" }}>
                                    Explore Buses →
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Popular Destinations */}
                <section className="container pb-5">
                    <div className="mb-4">
                        <h2 className="fw-bolder" style={{ color: "#430014" }}>
                            Popular Destinations
                        </h2>
                        <p className="text-secondary">
                            Discover some of India's favourite travel routes.
                        </p>
                    </div>

                    <div className="row g-4">
                        {[
                            { city: "Jaipur", route: "Delhi → Jaipur", emoji: "🏰" },
                            { city: "Manali", route: "Chandigarh → Manali", emoji: "🏔️" },
                            { city: "Goa", route: "Mumbai → Goa", emoji: "🏖️" },
                            { city: "Udaipur", route: "Jaipur → Udaipur", emoji: "🏞️" },
                        ].map((destination) => (
                            <div className="col-6 col-lg-3" key={destination.city}>
                                <div className="card h-100 border-0 shadow-sm rounded-4 p-3">
                                    <div
                                        className="rounded-3 text-center py-4 mb-3"
                                        style={{ backgroundColor: "#fff0f2" }}
                                    >
                                        <span style={{ fontSize: "48px" }}>
                                            {destination.emoji}
                                        </span>
                                    </div>

                                    <h5 className="fw-bold mb-1" style={{ color: "#800020" }}>
                                        {destination.city}
                                    </h5>

                                    <p className="text-secondary small mb-3">
                                        {destination.route}
                                    </p>

                                    <a
                                        href="/search"
                                        className="btn btn-outline-danger mt-auto fw-semibold"
                                    >
                                        Explore Route →
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </section>

            <footer
                className="text-white mt-4 pt-5 pb-3"
                style={{ backgroundColor: "#30000d" }}
            >
                <div className="container">
                    <div className="row g-4 pb-4">

                        <div className="col-lg-4 col-md-6">
                            <h3 className="fw-bold mb-3" style={{ color: "#ff526b" }}>
                                Ticketly
                            </h3>
                            <p className="text-white-50">
                                Your journey, our priority. Book your bus tickets
                                easily and travel comfortably to your destination.
                            </p>
                        </div>

                        <div className="col-lg-2 col-md-6">
                            <h5 className="fw-bold mb-3">Quick Links</h5>
                            <div className="d-flex flex-column gap-2">
                                <a href="/" className="text-white-50 text-decoration-none">Home</a>
                                <a href="/search" className="text-white-50 text-decoration-none">Search Buses</a>
                                <a href="/bookings" className="text-white-50 text-decoration-none">My Bookings</a>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6">
                            <h5 className="fw-bold mb-3">Support</h5>
                            <div className="d-flex flex-column gap-2">
                                <a href="/help" className="text-white-50 text-decoration-none">Help Center</a>
                                <a href="/contact" className="text-white-50 text-decoration-none">Contact Us</a>
                                <a href="/privacy" className="text-white-50 text-decoration-none">Privacy Policy</a>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6">
                            <h5 className="fw-bold mb-3">Travel With Us</h5>
                            <p className="text-white-50">
                                Discover new destinations and make every journey memorable.
                            </p>
                            <a href="/login" className="btn btn-outline-light px-4">
                                Get Started →
                            </a>
                        </div>

                    </div>

                    <hr style={{ borderColor: "#78404d" }} />

                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
                        <p className="text-white-50 mb-0">
                            © {new Date().getFullYear()} Ticketly. All rights reserved.
                        </p>
                        <p className="text-white-50 mb-0">
                            Made for better journeys ❤️
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Home;
