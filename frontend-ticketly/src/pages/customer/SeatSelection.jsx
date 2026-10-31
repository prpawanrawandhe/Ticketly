
import React, { useEffect, useMemo, useState } from 'react'
import './SeatSelection.css'
import { useLocation, useNavigate } from 'react-router-dom'
import availableSeats from '../../services/available-seats'


const SeatSelection = () => {
    const { state } = useLocation()
    const navigate = useNavigate()
    const bus = state?.bus
    const schedule_id = state?.schedule_id
    const seater = Number(bus.bus.seater)
    const sleeper = seater - 1
    const total_seats = Number(bus.bus.sleeper) + seater
    const [selectedSeats, setSelectedSeat] = useState([]);
    const [sleeper_price, setsleeper_price] = useState(bus.sleeper_price)
    const [seater_price, setseater_price] = useState(bus.seater_price)
    const [total_amount, settotal_amount] = useState(0)
    const [available_Seats, setavailable_Seats] = useState([])

    useEffect(() => {
        const fechData = async () => {
            const available_Seats = await availableSeats(schedule_id)

            setavailable_Seats(available_Seats.available_seats)
        }
        fechData()
    }, [])


    const seats = Array.from({ length: total_seats }, (_, i) =>
        i < seater ? `S${i + 1}` : `U${i - (sleeper)}`

    );

    const Show_columns = ({ columns, row }) => {
        return (
            <div className="seat-column">
                {columns[row].map(seat => (
                    <button className={`${seat.startsWith("U") ? "sleeper-seat" : ""} ${selectedSeats.includes(seat) ? "selected" : ""
                        }`} disabled={!available_Seats.includes(seat)} key={seat}
                        onClick={() => {
                            setSelectedSeat(prev =>
                                prev.includes(seat)
                                    ? prev.filter(s => s !== seat)
                                    : [...prev, seat]
                            );
                            settotal_amount(prev =>
                                prev + (
                                    selectedSeats.includes(seat)
                                        ? -Number(seat.startsWith("U") ? sleeper_price : seater_price)
                                        : Number(seat.startsWith("U") ? sleeper_price : seater_price)
                                )
                            );
                        }}>{!available_Seats.includes(seat) ? <><p>booked</p>{seat}</> : seat}</button>
                ))}
            </div>
        )
    }


    const SeatLayout = () => {

        const columns = useMemo(() => {
            return seats.reduce((result, seat) => {
                const rows = seat.startsWith("S") ? 10 : 5;
                const lastColumn = result[result.length - 1];

                if (
                    !lastColumn ||
                    lastColumn.length >= rows ||
                    lastColumn[0][0] !== seat[0]
                ) {
                    result.push([seat]);
                } else {
                    lastColumn.push(seat);
                }
                return result;
            }, []);
        }, [seats]);
        return (<>
            <div className="decks">
                <div className="deck-card">
                    <div className="left-seats">
                        <Show_columns columns={columns} row={0} />
                        <Show_columns columns={columns} row={1} />
                    </div>
                    <div className="right-seats">
                        <Show_columns columns={columns} row={2} />
                        <Show_columns columns={columns} row={3} />
                    </div>
                </div>

                {sleeper < 20 ? <>
                    <div className="deck-card">
                        <div className="left-seats">

                            <Show_columns columns={columns} row={4} />
                            <Show_columns columns={columns} row={5} />
                        </div>
                        <div className="right-seats">
                            <Show_columns columns={columns} row={6} />
                            <Show_columns columns={columns} row={7} />
                        </div>

                    </div>
                </> : <></>}

            </div>
        </>)
    }


    return (
        <div className="ticketly-page">

            <header className="ticketly-header">

                <button className="ticketly-back" onClick={() => navigate(-1)}>
                    ← &nbsp; Back to Buses
                </button>
            </header>

            <main className="ticketly-content">
                <div className="ticketly-layout">
                    <section>
                        <h1>Choose Your Seats</h1>

                        <div className="journey-info">
                            <div className="info-item">
                                <div className="info-label">🚌 Bus Name</div>
                                <div className="info-value">
                                    {bus?.bus?.bus_name || 'Bus Name'}
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-label">▣ Bus Number</div>
                                <div className="info-value">
                                    {bus?.bus?.bus_number || 'Bus Number'}
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-label">🚌 Bus Type</div>
                                <div className="info-value">
                                    {bus?.bus?.bus_type || 'Bus Type'}
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-label">📍 Route</div>
                                <div className="info-value">
                                    {bus?.route
                                        ? `${bus.route.source} → ${bus.route.destination}`
                                        : 'Source → Destination'}
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-label">▦ Departure</div>
                                <div className="info-value">
                                    {bus?.departure_time
                                        ? new Date(bus.departure_time).toLocaleDateString()
                                        : 'Journey Date'}
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-label">◷ Time</div>
                                <div className="info-value">
                                    {bus?.estimated_time || 'Duration'}
                                </div>
                            </div>
                        </div>

                        <div className="decks-container">
                            <SeatLayout />
                        </div>
                    </section>

                    <aside className="booking-summary">
                        <h2>Booking Summary</h2>

                        <div className="summary-row">
                            <span>Selected Seats</span>
                            <strong>-</strong>
                        </div>
                        <div>
                            <ul className="selected-seats-list">
                                {selectedSeats.map((seat) => (
                                    <li key={seat}>
                                        <span>{seat}</span>
                                        <span>{seat.startsWith("U") ? sleeper_price : seater_price}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="summary-row summary-total">
                            <span>Total Price</span>
                            <span>₹{total_amount}</span>
                        </div>

                        <button className="continue-button" disabled={selectedSeats.length === 0} onClick={() => navigate("/booking-process/", { state: { bus, selectedSeats } })}>
                            Continue &nbsp; →
                        </button>
                    </aside>
                </div>
            </main>
        </div>
    )
}

export default SeatSelection
