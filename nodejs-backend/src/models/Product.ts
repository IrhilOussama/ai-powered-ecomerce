import db from "../config/database.js"

export interface MyProduct {
    id?: string,
    title: string,
    description: string,
    price: number,
    image?: string,
    value?: number,
    category_id: string,
    category_title?: string,
    similar_products_ids?: string[]
}

export interface user_product_recommandation {
    user_id: string,
    product_id: string,
    score?: number
}


class Product {
    
    static async getAll(){
        const result = (await db.query('SELECT p.id, p.title, p.categorie_id, p.description, price, p.image, value, c.title AS category_title FROM product AS p, categorie as c WHERE p.categorie_id = c.id'));
        return result.rows;
    }
    static async getOne(id: string): Promise<MyProduct> {
        const result = (await db.query("SELECT p.id, p.title, p.categorie_id, p.description, price, p.image, value, c.title AS category_title " +
            "FROM product AS p, categorie as c WHERE (p.categorie_id = c.id) AND (p.id = $1)", [id]));
        return result.rows[0];
    }
    static async getOneByImage(image: string): Promise<MyProduct> {
        const result = (await db.query("SELECT p.id, p.title, p.categorie_id, p.description, price, image, value, c.title AS category_title " +
            "FROM product AS p, categorie as c WHERE (p.categorie_id = c.id) AND (p.image = $1)", [image]));
        return result.rows[0];
    }
    static async getOneByImageFilename(filename: string): Promise<MyProduct> {
        const result = await db.query(
            `SELECT p.id, p.title, p.categorie_id, p.description, price, p.image, value, c.title AS category_title 
             FROM product AS p
             JOIN categorie AS c ON p.categorie_id = c.id
             WHERE SPLIT_PART(SPLIT_PART(p.image, '/', array_length(string_to_array(p.image, '/'), 1)), '.', 1) = $1`, 
            [filename]
        );
        return result.rows[0];
    }
    
    static async create(data: MyProduct){
        let { title, description, category_id, price, image } = data;
        const result = (await db.query(
            'INSERT INTO product (title, description, categorie_id, price, image) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, description, category_id, price, image] 
        ));
        return result.rows[0];
    }
    static async update(data: MyProduct){
        let { id, title, description, category_id, price, image } = data;
        const result = (await db.query(
            'UPDATE product set title = $1, description = $2, categorie_id = $3, price = $4, image = $5 WHERE id = $6 RETURNING *',
            [title, description, category_id, price, image, id] 
        ))
        return result.rows[0];
    }
    static async updateExceptImage(data: MyProduct){
        let { id, title, description, category_id, price } = data;
        const result = (await db.query(
            'UPDATE product set title = $1, description = $2, categorie_id = $3, price = $4 WHERE id = $5 RETURNING *',
            [title, description, category_id, price, id] 
        ))
        // console.log(result);
        return result.rows[0];
    }
    static async delete(id: string){
        const result = (await db.query("DELETE FROM product WHERE id = $1", [id]));
        return result.rows[0];
    }
    static async addSimilarProduct(product_id: string, similar_product_id: string, rank: number){
        const result = (await db.query("INSERT INTO similar_products values ($1, $2, $3)", [product_id, similar_product_id, rank]));
        return result.rows[0];
    }
    static async truncuateSimilarProducts(){
        const result = (await db.query("TRUNCATE similar_products"));
        return result.rows[0];
    }
    static async getSimilars(id: string){
        const result = (await db.query("SELECT * FROM similar_products WHERE product_id = $1", [id]));
        return result.rows;
    }
    static async getRecommanded(user_id: string): Promise<user_product_recommandation[]> {
        const result = (await db.query("SELECT * FROM recommanded_products WHERE user_id = $1", [user_id]));
        // console.log(result.rows);
        return result.rows;
    }

    static async getFiltered(options: {
        category?: number, 
        limit?: number, 
        page?: number
    } = {}): Promise<any[]> {
        try {
            const { 
                category, 
                limit = 10, 
                page = 1 
            } = options;
            let query = `
                SELECT p.* FROM product p WHERE p.categorie_id = $1 
            `; 

            const queryParams: any[] = [];

            // Add pagination and limit
            query += ` LIMIT $2 OFFSET $3`;
            queryParams.push(
                category,
                limit, 
                (page - 1) * limit
            );

            const result = await db.query(query, queryParams);
            return result.rows;
        } catch (error) {
            console.error('Error filtering products:', error);
            throw error;
        }
    }
}


export default Product;