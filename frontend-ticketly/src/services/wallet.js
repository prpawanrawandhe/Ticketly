import fetchWithAuth from "./api"

const getPayments = () => fetchWithAuth({path:"payments/payments/",auth:true});
export const getBalance = () => fetchWithAuth({path:"payments/wallet-balance/",auth:true})

const wallet_data = async () => {
    const wallet_balance = await getBalance()
    const payments = await getPayments()
    return { wallet_balance, payments };
}

export default wallet_data;