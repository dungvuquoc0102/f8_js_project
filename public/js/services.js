const url = "https://dummyjson.com/products";
async function getCategories() {
  return await axios.get(`${url}/categories`);
}
async function getProducts() {
  return await axios.get(`${url}?limit=0`);
}
async function getProductsByCategory(category) {
  return await axios.get(`${url}/category/${category}`);
}

export default { getCategories, getProducts, getProductsByCategory };
