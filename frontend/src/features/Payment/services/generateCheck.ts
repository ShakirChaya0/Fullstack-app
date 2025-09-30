export async function generateCheck(orderId: number, apiCall: (url: string, options?: RequestInit) => Promise<Response>) {
    const response = await apiCall(`pagos/cuenta/${orderId}`);

    const content = await response.json();
    if (!response.ok) throw new Error(content.message);
    
    return content;
}