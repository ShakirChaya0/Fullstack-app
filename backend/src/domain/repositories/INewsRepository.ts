import { SchemaNews } from "../../shared/validators/NewsZod.js";
import { NewsClass } from "../entities/News.js";

export interface INewsRepository {
    register(data: SchemaNews): Promise<NewsClass>;
    modify(id: number, data: any): Promise<NewsClass>;
    getOne(id: number): Promise<NewsClass | null>;
    getAll(page: number): Promise<{News: NewsClass[], pages: number, totalItems: number}>;
    delete(id: number): Promise<void>;
    getActive(): Promise<NewsClass[]>;
}