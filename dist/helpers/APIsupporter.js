"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TomarImagenesAPIsolutel = void 0;
const axios_1 = __importDefault(require("axios"));
let TomarImagenesAPIsolutel = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const consumerKey = "ck_aaae303d49b4ac57c713472aca2f610d4c99e195";
    const consumerSecret = "cs_646f2fd371adc5d405a5a7bb9a464909e94a0c75";
    try {
        let allProducts = [];
        const perPage = 100; // Número máximo de productos por página
        let page = 1;
        let totalPages = 1; // Inicialmente se establece en 1 para entrar en el bucle
        while (page <= totalPages) {
            const response = yield axios_1.default.get('https://solutelcuba.com/wp-json/wc/v3/products', {
                params: {
                    per_page: perPage,
                    page: page
                },
                auth: {
                    username: consumerKey,
                    password: consumerSecret,
                },
            });
            // Concatenar los productos obtenidos con los productos ya obtenidos
            allProducts = allProducts.concat(response.data);
            // Actualizar el total de páginas si es la primera solicitud
            if (page === 1) {
                totalPages = parseInt(response.headers['x-wp-totalpages'], 10) || 1;
            }
            // Incrementar el número de página para la siguiente solicitud
            page++;
        }
        console.log((_a = allProducts[0]) === null || _a === void 0 ? void 0 : _a.images[0]); // Uso de optional chaining para evitar errores si no hay imágenes
        // Usar un Set para almacenar los SKUs únicos
        let productoCantidadMap = {};
        for (let prod of allProducts) {
            if (!productoCantidadMap[prod.sku]) {
                productoCantidadMap[prod.sku] = {
                    "Sku": prod.sku,
                    "imagenes": prod.images
                };
            }
        }
        // Retornar solo el array de productos únicos
        return Object.values(productoCantidadMap);
    }
    catch (error) {
        console.error('Error al obtener productos:', error);
    }
});
exports.TomarImagenesAPIsolutel = TomarImagenesAPIsolutel;
