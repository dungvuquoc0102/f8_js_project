async function getCategories() {
  return await axios.get("https://dummyjson.com/products/categories");
}
async function getProducts() {
  return await axios.get("https://dummyjson.com/products?limit=0");
}

export default { getCategories, getProducts };
