import fetchWithAuth from "./api";


const register = (username,password) => fetchWithAuth({path:"account/register/",method:"POST",body:{username:username,password:password}})

export default register;
