
const URL = "http://localhost:8000/"

const userlogin = async(username,password,setUsername,setaccess_token)=>{
    const credentials = {"username":username,"password":password}
    const url = URL+"account/token/"

    try {const res = await fetch(url,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(credentials),
    })

    const result = await res.json()


    if (res.ok){
        const access_token = result.access
        localStorage.setItem("access",access_token)
        localStorage.setItem("refresh",result.refresh)
        localStorage.setItem("username",username)
        setUsername(username);
        setaccess_token(access_token)
        return "Authenticated"
    }

    if(res.status === 401){
        return 401
    }


    } catch(err){
        console.log(err)
        return "server error"

    }
    return "server error"

}

export const refreshAccessToken = async () => {
    const refresh = localStorage.getItem("refresh");

    const response = await fetch("http://127.0.0.1:8000/account/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh:refresh })
    });

    if (!response.ok) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        return null;
    }

    const data = await response.json();
    localStorage.setItem("access", data.access);

    if (data.refresh) {
        localStorage.setItem("refresh", data.refresh);
    }

    return data.access;
};

export default userlogin;
