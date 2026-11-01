const URL = import.meta.env.VITE_API_BASE_URL

const availableSeats = async (schedule_id) => {
    const url = `${URL}/book/available-seats/${schedule_id}`

    try {
        const res = await fetch(url, {
            headers: {
                "Content-Type": "application/json"
            },
        })

        const result = await res.json()

        return result
    }catch(err){
        console.log(err)
        return null
    }
}

export default availableSeats;
