import { NewsClass } from "../entities/News.js";

export interface INewsRepository {
    register(data: NewsClass): Promise<NewsClass>;
    modify(id: number, data: any): Promise<NewsClass>;
    getOne(id: number): Promise<NewsClass | null>;
    getAll(): Promise<NewsClass[]>;
    delete(id: number): Promise<void>;
    getActive(): Promise<NewsClass[]>;
}