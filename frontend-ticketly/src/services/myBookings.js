

const fetchBookings = async () => {
    const API_URL = "http://127.0.0.1:8000/"
    const access_token = localStorage.getItem('access')
    try {
        const res = await fetch(
            `${API_URL}book/bookings/`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );

        const data = await res.json();
        if (res.status === 401) {

            return res.status
        }

        return data

    } catch (err) {
        console.log(err)
    }
};

export default fetchBookings;