export default async function fetchQR (apiCall: (url: string, options?: RequestInit) => Promise<Response>, qrToken: string, tableNum: number) {
    const response = await apiCall(`qr?qrToken=${qrToken}&mesa=${tableNum}`);

    if (!response.ok){
        if (response.status == 404) throw new Error("No se encontro el qr o la mesa respectiva, comuníquese con el personal");
        if (response.status == 422) throw new Error("El QR no es válido, comuníquese con el personal");
    } else {
        return true
    }
}