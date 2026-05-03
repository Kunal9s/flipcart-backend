// import { products } from "./constants/data.js";
// import Product from './model/product-schema.js';

// const DefaultData = async () => {
//     try {
//         await Product.deleteMany({});
//         await Product.insertMany(products);
//         console.log("Data inserted successfully");
//     } catch (error) {
//         console.log('Error while inserting default data ', error.message);
        
//     }
// }

// export default DefaultData;

import Product from './model/product-schema.js';

const DefaultData = async () => {
  try {
    const count = await Product.countDocuments();

    if (count === 0) {
      await Product.insertMany(products);
      console.log("Data inserted successfully");
    } else {
      console.log("Data already exists, skipping insert");
    }
  } catch (error) {
    console.log("Error while inserting default data", error.message);
  }
};

export default DefaultData;