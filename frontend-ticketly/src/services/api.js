import { refreshAccessToken } from "./auth"

const URL = "http://127.0.0.1:8000/"

const fetchWithAuth = async ({path, method = "GET", auth = false, body = null, tryed = 0}) => {
    const access_token = localStorage.getItem("access")
    const retry_limit = 2

    const url = URL + path

    if (tryed>retry_limit) {
        window.location.href = "/login";
        return
    }

    try {
        const res = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                ...(auth && { "Authorization": `Bearer ${access_token}` })
            },
            ...(body && { body: JSON.stringify(body) })

        })

        if (res.status === 401) {
            const new_token = await refreshAccessToken()
            if (!new_token) {
                window.location.href = "/login";
                return
            }
            tryed += 1
            return fetchWithAuth({path, method, auth, body,tryed})
        }
        const data = await res.json()
        return data

    } catch (err) {
        console.log(err)
    }

}

export default fetchWithAuth;