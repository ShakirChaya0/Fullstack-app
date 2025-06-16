import { ProductModel } from '../models/productModel.js';
import { ValidateProduct, ValidateProductPartial } from '../utils/validate.js';
import { productUpdateValidation } from '../utils/updateValidate.js';
export class ProductController {
}
ProductController.getAll = () => {
    const productos = ProductModel.getAll();
    return productos;
};
ProductController.getById = (id) => {
    const producto = ProductModel.getById(id);
    return producto;
};
ProductController.getByName = (name) => {
    const draft = name.replace(/_/g, ' ');
    const producto = ProductModel.getByName(draft);
    return producto;
};
ProductController.getByType = (tipo) => {
    const draft = tipo.replace(/_/g, ' ');
    const producto = ProductModel.getByType(draft);
    return producto;
};
ProductController.create = (data) => {
    const ProductData = ValidateProduct(data);
    if (!ProductData.success)
        return ProductData.error;
    const draft = ProductModel.create(ProductData.data);
    return draft;
};
ProductController.update = (data, id) => {
    const resultData = productUpdateValidation(data, id);
    if (!resultData)
        return { message: "Datos inválidos" };
    const ProductData = ValidateProductPartial(data.datos);
    if (!ProductData.success)
        return ProductData.error;
    const draft = ProductModel.update(ProductData.data, id);
    return draft;
};
ProductController.delete = (id) => {
    const producto = ProductModel.delete(id);
    return producto;
};
