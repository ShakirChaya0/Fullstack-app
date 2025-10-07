export default async function createQR( apiCall: (url: string, options?: RequestInit) => Promise<Response>, tableNum: Number) {
    const response = await apiCall("qr/", {
        method: "POST",
        body: JSON.stringify({
            tableNumber: tableNum
        })
    });

    if (!response.ok) {
        throw new Error("error")
    }
    
    const data = await response.json();
    
    return data.QrToken;
}