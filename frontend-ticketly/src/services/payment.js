const URL = "http://127.0.0.1:8000/"

const booking_confirm = async (id,access_token) => {
    const url = `${URL}payments/payment-confirmation/${id}`

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization":`Bearer ${access_token} `
            },
        })

        const result = await res.json()

        return result
    } catch(err){
        console.log(err)
        return err
    }
}

export default booking_confirm;