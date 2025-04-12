import db from "../config/database.js"

export interface MyCategory {
    id?: string,
    title: string,
    description: string,
    image: string
}

export default class Category {
    static async getAll() : Promise<MyCategory[]> {
        const client = await db.connect();
        let result = (await client.query('SELECT * FROM categorie')).rows;
        client.release()
        return result;
    }

    static async getOne(id: string) : Promise<MyCategory> {
        const client = await db.connect();
        let result = (await client.query('SELECT * FROM categorie WHERE id = $1', [id])).rows[0];
        client.release()
        return result;
    }

    static async create(data: MyCategory) : Promise<MyCategory> {
        const result = await db.query(
        'INSERT INTO categorie (title, description, image) VALUES ($1, $2, $3) RETURNING *',
        [data.title, data.description, data.image]
        );
        return result.rows[0];
    }

    static async update(data: MyCategory) : Promise<MyCategory> {
        console.log(data.image)
        const result = await db.query(
        'UPDATE categorie SET title = $1, description = $2, image = $3 WHERE id = $4 RETURNING *',
        [data.title, data.description, data.image, data.id]
        );
        console.log(result)
        return result.rows[0];
    }

    static async updateExceptImage(data: MyCategory) : Promise<MyCategory> {
        const result = await db.query(
        'UPDATE categorie SET title = $1, description = $2 WHERE id = $3 RETURNING *',
        [data.title, data.description, data.id]
        );
        return result.rows[0];
    }

    static async delete(id: string) : Promise<void>{
        const client = await db.connect();
        await client.query("DELETE FROM categorie WHERE id = $1", [id]);
    }

    static async getCategoriesWithProductCount(): Promise<any[]> {
        const result = await db.query(`
            SELECT 
                c.id, 
                c.title, 
                c.description, 
                c.image, 
                COUNT(p.id) AS product_count
            FROM 
                categorie c
            LEFT JOIN 
                product p ON c.id = p.categorie_id
            GROUP BY 
                c.id, c.title, c.description, c.image
            ORDER BY 
                product_count DESC
        `);
        return result.rows;
    }
}


