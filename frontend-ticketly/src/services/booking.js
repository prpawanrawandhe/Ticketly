const URL = import.meta.env.VITE_API_BASE_URL

const booking = async (id,booking_data,access_token) => {
    const url = `${URL}/book/create-booking/${id}`

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization":`Bearer ${access_token} `
            },
            body:JSON.stringify(booking_data),
        })

        if (res.status === 401){
            return res.status
        }

        const result = await res.json()

        return result
    } catch(err){
        console.log(err)
        return err
    }
}

export default booking;
