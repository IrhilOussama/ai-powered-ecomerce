require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
// const path = require('path');
// const fs = require('fs').promises;
// const { v4: uuidv4 } = require('uuid');
// const db = require('./config/database');

const app = express();
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(morgan('dev'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// // Ensure images directory exists
// const ensureImagesDir = async () => {
//   const imagesDir = path.join(__dirname, 'images');
//   try {
//     await fs.access(imagesDir);
//   } catch {
//     await fs.mkdir(imagesDir);
//   }
// };

// ensureImagesDir();

// // Function to save base64 image
// async function saveBase64Image(base64Data) {
//   // Remove data:image/[type];base64, prefix if present
//   const base64Image = base64Data.split(';base64,').pop();
  
//   // Get file extension from base64 header or default to jpg
//   let fileExtension = 'jpg';
//   if (base64Data.includes('data:image/')) {
//     fileExtension = base64Data.split(';')[0].split('/')[1];
//   }
  
//   // Generate unique filename
//   const fileName = `${uuidv4()}.${fileExtension}`;
//   const filePath = path.join(__dirname, 'images', fileName);
  
//   // Save the file
//   await fs.writeFile(filePath, base64Image, { encoding: 'base64' });
  
//   return fileName;
// }

// // Create products table if it doesn't exist
// const initDB = async () => {
//   try {
//     await db.query(`
//       CREATE TABLE IF NOT EXISTS products (
//         id int AUTO_INCREMENT,
//         title VARCHAR(255) NOT NULL,
//         description TEXT,
//         categorie VARCHAR(100),
//         price DECIMAL(10, 2) NOT NULL,
//         image VARCHAR(255),
//         PRIMARY KEY (id)
//       )
//     `);
//     console.log('Database initialized successfully');
//   } catch (error) {
//     console.error('Database initialization error:', error);
//   }
// };

// // initDB();

// // POST endpoint to create a new product
// app.post('/api/products', async (req, res) => {
//   console.log('Received product data');
//   try {
//     const { title, description, categorie, price, image } = req.body;
    
//     // Validate required fields
//     if (!title || !price || !image) {
//       return res.status(400).json({ error: 'title, image and price are required fields' });
//     }

//     // Save the base64 image and get the filename
//     const fileName = await saveBase64Image(image);
//     console.log('Image saved as:', fileName);

//     // Insert product with the new image filename
//     const [result] = await db.query(
//       'INSERT INTO products (id, title, description, categorie, price, image) VALUES (?, ?, ?, ?, ?, ?)',
//       [ fileName.split('.')[0] ,title, description, categorie, price, fileName]
//     );

//     res.status(201).json({
//       message: 'Product created successfully',
//       image: fileName
//     });
//   } catch (error) {
//     console.error('Error creating product:', error);
//     res.status(500).json({ error: 'Failed to create product' });
//   }
// });

// // Test database connection
// app.get('/api/db-test', async (req, res) => {
//   try {
//     const [result] = await db.query('SELECT 1');
//     res.json({ status: 'ok', message: 'Database connected successfully' });
//   } catch (error) {
//     console.error('Database connection error:', error);
//     res.status(500).json({ error: 'Database connection failed' });
//   }
// });

// // Serve static images from the images directory
// app.use('/api/images', express.static(path.join(__dirname, 'images')));

// // Handle 404 errors for images
// app.use('/images/*', (req, res) => {
//   res.status(404).json({ error: 'Image not found' });
// });

// // GET endpoint for similar products
// app.get('/api/similar_product/:product_image_name', async (req, res) => {
//   try {
//     const productImage = req.params.product_image_name;
    
//     // Read the similarities.json file
//     let similaritiesData = await fs.readFile(path.join(__dirname, 'similarities.json'), 'utf8');
//     similaritiesData = Object.values(JSON.parse(similaritiesData));
//     console.log(similaritiesData)
//     const similaritiesObject = similaritiesData.find(s => s['image_name'] == productImage)
    
//     if (!similaritiesObject['similar_images']) {
//       return res.status(404).json({ error: 'No similar products found for this ID' });
//     }
    
//     // Get the similar products from the database based on the image URLs
//     const similarImages = similaritiesObject.similar_images;
//     // const imageNames = similarImages.map(url => url.split('/').pop());
    
//     // // Get products with matching image names
//     // const [similarProducts] = await db.query(
//     //   'SELECT * FROM products WHERE image IN (?)',
//     //   [imageNames]
//     // );
    
//     res.json({
//       'image_name': productImage,
//       'similar_images': similarImages
//     });
    
//   } catch (error) {
//     console.error('Error finding similar products:', error);
//     res.status(500).json({ error: 'Failed to fetch similar products' });
//   }
// });

// // GET endpoint to retrieve all products 
// app.get('/api/products', async (req, res) => {
//   try {
//     const [products] = await db.query('SELECT * FROM products');
//     const [categories] = await db.query('SELECT * FROM categories');
//     // console.log(categories)
//     products.forEach(product => {
//       product['categorie'] = (categories.find(cat => cat.id === product.categorie))['title'];
//     })
//     res.json(products);
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     res.status(500).json({ error: 'Failed to fetch products' });
//   }
// });

// app.get("/api/products/:product_id", async (req, res) => {
//   try {
//     const product_id = req.params.product_id;
//     const [product] = await db.query("SELECT * FROM products where id = ?", [product_id]);
//     res.json(product[0]);
//   } catch(e) {
//     console.error("error: ", e);
//     res.status(500).json({msg: "error fetching product"})
//   }
// })



// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: 'Something went wrong!' });
// });



// app.get('/api/categories', async (req, res) => {
//   try {
//     const [categories] = await db.query('SELECT * FROM categories');
//     res.json(categories);
//   } catch (error) {
//     console.error('Error fetching categories:', error);
//     res.status(500).json({ error: 'Failed to fetch categories' });
//   }
// })

// app.get('/api/categories/:categorie_id', async (req, res) => {
//   try {
//     const [categories] = await db.query('SELECT * FROM categories');
//     const categorie_id = parseInt(req.params.categorie_id);
//     const myCategorie = categories.find(cat => cat.id == categorie_id);
//     res.json(myCategorie);
//   } catch (error) {
//     console.error('Error fetching categorie:', error);
//     res.status(500).json({ error: 'Failed to fetch categorie' });
//   }
// })

// app.post('/api/categories', async (req, res) => {
//   try {
//     const {title, description} = req.body;

//     if (!title){
//       return res.status(400).json({error: "title is required"})
//     }

//     const [result] = await db.query(
//       'INSERT INTO categories (title, description) VALUES (?, ?)',
//       [title, description]
//     )
//     res.json({msg: "categorie " + title + " added succesfuly"});
//   } catch (error) {
//     console.error('Error fetching categories:', error);
//     res.status(500).json({ error: 'Failed to fetch categories' });
//   }
// })

// app.get("/api/users", async (req, res) => {
//   try{
//     const [users] = await db.query("SELECT * FROM users");
//     res.json(users); 
//   } catch (error) {
//   console.error('Error fetching categories:', error);
//   res.status(500).json({ error: 'Failed to fetch categories' });}
// })

// app.post("/api/users", async (req, res) => {
//   try {
//     const {username, email, password} = req.body;

//     if (!username || !email || !password){
//       return res.status(400).json({error: "user, email and password are required"});
//     }

//     const [result] = await db.query("INSERT INTO users(username, email, password) VALUES (?, ?, ?)",
//       [username, email, password]
//     )
//     res.json({"msg": "user added successfuly"});

//   }  catch (error) {
//     console.error('Error adding user:', error);
//     res.status(500).json({ error: 'Failed to add user' });
//   }
// })

// // Search products endpoint
// app.get('/api/search', async (req, res) => {
//   try {
//     const { q } = req.query;
    
//     if (!q) {
//       return res.status(400).json({ error: 'Search query is required' });
//     }

//     // Use LIKE for partial matches and make it case insensitive
//     const searchQuery = `%${q}%`;
//     const [products] = await db.query(
//       'SELECT * FROM products WHERE LOWER(title) LIKE LOWER(?) ORDER BY CASE ' +
//       'WHEN LOWER(title) LIKE LOWER(?) THEN 1 ' +  // Exact match
//       'WHEN LOWER(title) LIKE LOWER(?) THEN 2 ' +  // Starts with
//       'WHEN LOWER(title) LIKE LOWER(?) THEN 3 ' +  // Contains
//       'ELSE 4 END, title ASC',
//       [searchQuery, q, `${q}%`, `%${q}%`]
//     );

//     // // Add image URLs to products
//     // const productsWithImages = products.map(product => ({
//     //   ...product,
//     //   image: `/images/${product.image}`
//     // }));

//     res.json(products);
//   } catch (error) {
//     console.error('Search error:', error);
//     res.status(500).json({ error: 'Error searching products' });
//   }
// });
