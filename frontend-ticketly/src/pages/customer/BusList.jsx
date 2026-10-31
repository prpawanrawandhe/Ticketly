import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import availableSeats from '../../services/available-seats'
import listBuses from '../../services/buses'

const BusList = () => {
    const { state } = useLocation()
    const [buses, setbuses] = useState("")
    const navigate = useNavigate()
    const [error, seterror] = useState()
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      const getData=async()=>{
        const buses = await listBuses(state.from, state.to, state.date)
        if (buses === "error"){
            seterror("Something is Wrong")
            setLoading(true)
        }

        setbuses(buses)
      }
      getData()
    
    }, [])

    if (error) {
        return (
            <div className="mybookings-message">
                <p>{error}</p>
                <button onClick={() => navigate("/")}>
                    Try Again
                </button>
            </div>
        );
    }

    if (loading) {
        return <div className="mybookings-message">Loading Buses...</div>;
    }
    
    return (
        <div className="container py-4">


            {buses.length !== 0 ? <>
                <h2 className="mb-4" style={{ color: '#800020' }}>
                    Available Buses
                </h2>
                {buses.map((item) => (
                    <div className="card mb-3 p-3 shadow-sm" key={item.id}>
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <h5 style={{ color: '#800020' }}>
                                    {item.bus.bus_name}
                                </h5>
                                <p className="text-muted mb-2">
                                    {item.bus.bus_number} · {item.bus.bus_type}
                                </p>
                            </div>

                            <span className="badge text-bg-light">
                                {item.route.distance_km} km
                            </span>
                        </div>

                        <div className="row align-items-center my-3">
                            <div className="col">
                                <h6>{new Date(item.departure_time).toLocaleTimeString([], {
                                    hour: '2-digit', minute: '2-digit'
                                })}</h6>
                                <p className="mb-0">{item.route.source}</p>
                            </div>

                            <div className="col text-center text-muted">
                                {item.estimated_time}
                            </div>

                            <div className="col text-end">
                                <h6>{new Date(item.arrival_time).toLocaleTimeString([], {
                                    hour: '2-digit', minute: '2-digit'
                                })}</h6>
                                <p className="mb-0">{item.route.destination}</p>
                            </div>
                        </div>

                        <hr />

                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                            <div>
                                <span className="me-3">
                                    Seater: <strong>₹{item.seater_price}</strong>
                                </span>
                                <span>
                                    Sleeper: <strong>₹{item.sleeper_price}</strong>
                                </span>
                            </div>

                            <button
                                onClick={async()=>{
                                    navigate('/seat-selection/',{state:{bus:item,schedule_id:item.id}})
                                }}
                                className="btn text-white"
                                style={{ backgroundColor: '#800020' }}
                            >
                                View Seats
                            </button>
                        </div>
                    </div>
                ))}
            </> : <>
                <h2 className="mb-4" style={{ color: '#800020' }}>
                    No Buses Available
                </h2>
            </>}
        </div>
    )
}

export default BusList