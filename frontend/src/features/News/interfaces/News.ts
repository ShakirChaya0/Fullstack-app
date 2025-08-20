export default interface News {
    _newsId: number,
    _title: string,
    _description: string,
    _startDate: string,
    _endDate: string
}

export default interface NewsWithOutID {
    _title: string,
    _description: string,
    _startDate: string,
    _endDate: string
}