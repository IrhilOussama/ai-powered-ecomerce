import db from "../config/database.js";
export default class Category {
    static async getAll() {
        const client = await db.connect();
        let result = (await client.query('SELECT * FROM categorie')).rows;
        client.release();
        return result;
    }
    static async getOne(id) {
        const client = await db.connect();
        let result = (await client.query('SELECT * FROM categorie WHERE id = $1', [id])).rows[0];
        client.release();
        return result;
    }
    static async create(data) {
        const result = await db.query('INSERT INTO categorie (title, description) VALUES ($1, $2) RETURNING *', [data.title, data.description]);
        return result.rows[0];
    }
    static async update(data) {
        const result = await db.query('UPDATE categorie SET title = $1, description = $2  WHERE id = $3 RETURNING *', [data.title, data.description, data.id]);
        return result.rows[0];
    }
    static async delete(id) {
        const client = await db.connect();
        await client.query("DELETE FROM categorie WHERE id = $1", [id]);
    }
}
