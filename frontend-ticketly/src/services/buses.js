
const URL = "http://127.0.0.1:8000/"

const listBuses=async(source,destination,date)=>{
    const params = new URLSearchParams({
        source:source,
        destination:destination,
        date:date
    })
    const url = `${URL}routes/available-schedules/?${params}`
    try{
        const res = await fetch(url)
        const result = await res.json()
        return result
    } catch(err){
        console.log(err)
        return "error"
    }

}

export default listBuses;