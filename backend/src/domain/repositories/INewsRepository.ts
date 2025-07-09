import { NewsClass } from "../entities/News.js";

export interface INewsRepository {
    register(data: NewsClass): Promise<NewsClass>;
    modify(id: number, data: any): Promise<NewsClass>;
}