const URL = "http://127.0.0.1:8000/"

const availableSeats = async (schedule_id) => {
    const url = `${URL}book/available-seats/${schedule_id}`

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