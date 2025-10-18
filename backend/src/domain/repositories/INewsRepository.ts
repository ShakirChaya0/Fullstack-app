import { SchemaNews } from "../../shared/validators/NewsZod.js";
import { NewsClass } from "../entities/News.js";

export interface INewsRepository {
    actives(): Promise<NewsClass[]>,
    register(data: SchemaNews): Promise<NewsClass>;
    modify(id: number, data: any): Promise<NewsClass>;
    getByTitle(title: string, page: number, status: any): Promise<{News: NewsClass[], pages: number, totalItems: number}>;
    getAll(page: number, status: any): Promise<{News: NewsClass[], pages: number, totalItems: number}>;
    delete(id: number): Promise<void>;
}