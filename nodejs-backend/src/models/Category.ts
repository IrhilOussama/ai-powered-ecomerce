import db from "../config/database.js"

export interface MyCategory {
    id?: string,
    title: string,
    description: string
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
        'INSERT INTO categorie (title, description) VALUES ($1, $2) RETURNING *',
        [data.title, data.description]
        );
        return result.rows[0];
    }

    static async update(data: MyCategory) : Promise<MyCategory> {
        const result = await db.query(
        'UPDATE categorie SET title = $1, description = $2  WHERE id = $3 RETURNING *',
        [data.title, data.description, data.id]
        );
        return result.rows[0];
    }

    static async delete(id: string) : Promise<void>{
        const client = await db.connect();
        await client.query("DELETE FROM categorie WHERE id = $1", [id]);
    }
}


