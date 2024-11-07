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
async function getProductById(id) {
  return await axios.get(`${url}/${id}`);
}

export default {
  getCategories,
  getProducts,
  getProductsByCategory,
  getProductById,
};
