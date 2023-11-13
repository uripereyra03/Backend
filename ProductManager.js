const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
    }

    addProduct(product) {
        const products = this.getProducts();
        product.id = products.length + 1;
        products.push(product);
        this.saveProducts(products);
    }

    getProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    getProductById(id) {
        const products = this.getProducts();
        return products.find(product => product.id === id);
    }

    updateProduct(id, updatedProduct) {
        const products = this.getProducts();
        const index = products.findIndex(product => product.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...updatedProduct };
            this.saveProducts(products);
        }
    }

    deleteProduct(id) {
        const products = this.getProducts();
        const updatedProducts = products.filter(product => product.id !== id);
        this.saveProducts(updatedProducts);
    }

    saveProducts(products) {
        const data = JSON.stringify(products, null, 2);
        fs.writeFileSync(this.path, data, 'utf8');
    }
}

module.exports = ProductManager;
