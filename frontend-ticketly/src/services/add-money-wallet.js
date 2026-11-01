const URL = import.meta.env.VITE_API_BASE_URL


const addMoneyApi = async (amount) => {
    const access_token = localStorage.getItem("access")
    const url = `${URL}/payments/add-money/`

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token} `
            },
            body:JSON.stringify({amount:amount})

        })

        const result = await res.json()
        return result
    } catch (err) {
        console.log(err)
        return err
    }
}

export default addMoneyApi;
