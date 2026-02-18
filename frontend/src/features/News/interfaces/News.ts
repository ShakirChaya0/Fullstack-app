export default interface News {
    _newsId?: number,
    _title: string,
    _description: string,
    _startDate: string,
    _endDate: string
}

export interface BackResults {
    News: News[],
    pages: number,
    totalItems: number
}