import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/products`);
    setProducts(response.data);
  };

  const createProduct = async () => {
    const newProduct = { name, price: parseFloat(price), stock: parseInt(stock) };
    await axios.post(`${process.env.REACT_APP_API_URL}/products`, newProduct);
    fetchProducts();
    setName('');
    setPrice('');
    setStock('');
  };

  const deleteProduct = async (id) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/products/${id}`);
    fetchProducts();
  };

  return (
    <div>
      <h1>Product List</h1>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            {product.name} - ${product.price} - Stock: {product.stock}
            <button onClick={() => deleteProduct(product.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div>
        <h2>Create Product</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Price"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />
        <input
          type="text"
          placeholder="Stock"
          value={stock}
          onChange={e => setStock(e.target.value)}
        />
        <button onClick={createProduct}>Create</button>
      </div>
    </div>
  );
};

export default ProductList;
