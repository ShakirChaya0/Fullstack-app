export function getCurrentDate() {
    return new Date().toISOString().split('T')[0]
}