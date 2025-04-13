const HOSTNAME = "https://ai-powered-website-backend.onrender.com/api";
// const HOSTNAME = "http://localhost:5000/api"

// const HOSTNAME = process.env.NEXT_PUBLIC_API_URL;


export const API_ENDPOINTS = {
    HOSTNAME,
    PRODUCTS: {
      BASE: HOSTNAME+"/products",
      POPULAR: HOSTNAME+"/products/popular",
      BY_ID: (id: string) => HOSTNAME+`/products/${id}`,
    },
    CATEGORIES: {
        BASE: HOSTNAME+"/categories",
        POPULAR: HOSTNAME+"/categories/popular",
        BY_ID: (id: string) => HOSTNAME+`/categories/${id}`,
      },
    AUTH: {
      LOGIN: HOSTNAME+"/users/login",
      REGISTER: HOSTNAME+"/users/register",
    },
    USER: {
      PROFILE: HOSTNAME+"/users/profile",
      ORDERS: HOSTNAME+"/users/orders",
    },
  };