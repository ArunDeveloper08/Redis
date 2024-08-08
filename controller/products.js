import { client } from "../app.js";

const productPromise = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        products: [
          {
            id: 1,
            price: 500,
            product: "T-Shirt",
          },
          {
            id: 2,
            price: 1000,
            product: "Jean",
          },
          {
            id: 3,
            price: 500,
            product: "T-Shirt",
          },
          {
            id: 4,
            price: 700,
            product: "Shirt",
          },
        ],
      });
    }, 4000);
  });

const getProductDetail = (id) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        products: {
          id: id,
          price: Math.floor(Math.random() * id * 100),
          product: `Product ${id}`,
        },
      });
    }, 4000);
  });

export const getProducts = async (req, res) => {
  const isExist = await client.exists("products");
  if (isExist) {
    const products = await client.get("products");

    return res.json({
      products: JSON.parse(products),
    });
  }
  const products = await productPromise();
  await client.setEx("products", 20, JSON.stringify(products.products));
  res.json({
    products,
  });
};

export const productDetail = async (req, res) => {
  try {
    const id = req.params.id;
    const key = `product:${id}`;
    let product = await client.get(key);
    if (product) {
      console.log("Get From Cache");
      return res.json({
        product: JSON.parse(product),
      });
    }
    product = await getProductDetail(id);
    await client.set(key, JSON.stringify(product));

    res.json({
      product,
    });
  } catch (error) {
    console.log(error);
  }
};

export const placeOrder = async (req, res) => {
  const productId = req.params.id;
  const key = `product:${productId}`;
  // Any mutation in database
  //like creating new order in database
  //reducing the product in database
  await client.del(key);

  return res.json({
    message: `order place successfully, product Id : ${productId}`,
  });
};
