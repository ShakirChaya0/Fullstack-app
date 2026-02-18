// Función helper para convertir "hh:mm" a timestamp, manejando medianoche
export default function parseTimeToTimestamp(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    
    const now = new Date();
    let timestamp = date.getTime();
    
    // Si el timestamp es en el futuro, asumimos que es de ayer (cruzó medianoche)
    if (timestamp > now.getTime()) {
        timestamp -= 24 * 60 * 60 * 1000; // Restar 24 horas
    }
    
    return timestamp;
}