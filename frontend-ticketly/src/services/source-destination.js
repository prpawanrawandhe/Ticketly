import fetchWithAuth from "./api";


const routsApi = (search) => fetchWithAuth({path:`routes/routes/?search=${search}`})

export default routsApi;