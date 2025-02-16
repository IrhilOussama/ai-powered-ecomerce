import db from "../config/database.js";
import bcrypt from 'bcrypt';

export interface MyUser {
    id?: string,
    username: string,
    email: string,
    password: string
}

class User {
    static async getAll(): Promise<MyUser[]>{
        const result = await db.query("SELECT id, username, email from profile");
        return result.rows;
    }
    static async getOne(id: string): Promise<MyUser>{
        const result = await db.query("SELECT id, username, email FROM profile WHERE id = $1", [id]);
        return result.rows[0];
    }
    static async create(data: MyUser): Promise<MyUser>{
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const result = await db.query("INSERT INTO profile(username, email, password) VALUES ($1, $2, $3) RETURNING *", 
            [data.username, data.email, hashedPassword]
        );
        return result.rows[0];
    }
    static async update(data: MyUser): Promise<MyUser>{
        const result = await db.query("UPDATE profile SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING *",
            [data.username, data.email, data.password, data.id]
        );
        return result.rows[0];
    }
    static async delete(id: string){
        const result = await db.query("DELETE FROM profile WHERE id = $1 RETURNING *", [id]);
        return result.rows[0];
    }
    static async findUserByEmail(email: string): Promise<MyUser> {
        const result = await db.query("SELECT * FROM profile WHERE email = $1", [email]);
        return result.rows[0];
    };
    
    static validatePassword = async (user: MyUser, password: string): Promise<boolean> => {
        return await bcrypt.compare(password, user.password);
    };
}

export default User;