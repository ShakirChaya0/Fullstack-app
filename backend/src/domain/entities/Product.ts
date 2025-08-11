export type FoodType = "Entrada" | "Plato_Principal" | "Postre";
type ProductState = "Disponible" | "No_Disponible";


export abstract class Product {
    constructor (
        protected readonly _productId: number,
        protected _name: string,
        protected _description: string,
        protected _state: ProductState,
        protected _price: number
    ) {}

    public get productId() { return this._productId }
    public get name() { return this._name }
    public get description() { return this._description }
    public get state() { return this._state }
    public get price() { return this._price }

    public set name(name: string) { 
        if (name.length < 3) {
            throw new Error("El nombre del producto debe tener al menos 3 caracteres");
        } 
        this._name = name;
    }

    public set description(description: string) { 
        if (description.length < 10) {
            throw new Error("La descripción del producto debe tener al menos 10 caracteres");
        } 
        this._description = description;
    }

    public set state(state: ProductState) { 
        if (state !== "Disponible" && state !== "No_Disponible") {
            throw new Error("El estado del producto debe ser 'Disponible' o 'No Disponible'");
        }
        this._state = state;
    }

    public set price(price: number) { this._price = price}
}

export class Food extends Product {
    constructor(
        productId: number,
        name: string,
        description: string,
        state: ProductState,
        price: number,
        private _isVegetarian: boolean,
        private _isVegan: boolean,
        private _isGlutenFree: boolean,
        private _type: FoodType
    ) {
        super(productId, name, description, state, price);
    }

    public get type() { return this._type }
    public get isVegetarian() { return this._isVegetarian }
    public get isVegan() { return this._isVegan }
    public get isGlutenFree() { return this._isGlutenFree }

    public set isVegetarian(isVegetarian: boolean) {
        if (typeof isVegetarian !== "boolean") {
            throw new Error("El atributo 'isVegetarian' debe ser un valor booleano");
        }
        this._isVegetarian = isVegetarian;
    }

    public set isVegan(isVegan: boolean) {
        if (typeof isVegan !== "boolean") {
            throw new Error("El atributo 'isVegan' debe ser un valor booleano");
        }
        this._isVegan = isVegan;
    }

    public set isGlutenFree(isGlutenFree: boolean) {
        if (typeof isGlutenFree !== "boolean") {
            throw new Error("El atributo 'isGlutenFree' debe ser un valor booleano");
        }
        this._isGlutenFree = isGlutenFree;
    }

    public set type(type: FoodType) {
        if (type !== "Entrada" && type !== "Plato_Principal" && type !== "Postre") {
            throw new Error("El tipo de comida debe ser 'Entrada', 'Plato Principal' o 'Postre'");
        }
        this._type = type;
    }
}

export class Drink extends Product {
    constructor(
        productId: number,
        name: string,
        description: string,
        state: ProductState,
        price: number,
        private _isAlcoholic: boolean
    ) {
        super(productId, name, description, state, price);
    }

    public get isAlcoholic() { return this._isAlcoholic }

    public set isAlcoholic(alcoholic: boolean) {
        if (typeof alcoholic !== "boolean") {
            throw new Error("El atributo 'alcoholic' debe ser un valor booleano");
        }
        this._isAlcoholic = alcoholic;
    }
} 