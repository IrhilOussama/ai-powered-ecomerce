import db from "../config/database.js";
import bcrypt from 'bcrypt';

export interface MyUser {
    id?: string,
    username: string,
    email: string,
    password: string
}

export interface MyUserInfo{
    id: string,
    username: string
}

class User {
    static async getAll(): Promise<MyUser[]>{
        const result = await db.query("SELECT id, username, email from profile");
        return result.rows;
    }
    static async getOne(id: string): Promise<MyUserInfo>{
        const result: {
            id: string,
            username: string,
            email: string,
            purchases_number: number,
            favorite_category: string,
            register_date: string,
            favorite_category_title: string
        } = (await db.query("SELECT p.id, username, email, purchases_number, favorite_category, created_at as register_date FROM profile p WHERE p.id = $1", [id])
        ).rows[0];
        if (result.favorite_category != null) {
            result.favorite_category_title = (await db.query("SELECT title FROM categorie WHERE id = $1", [result['favorite_category']])).rows[0]
        }
        result.register_date = result.register_date.toString().split(" ").slice(1, 4).join(" ");
        return result;
    }
    static async create(data: MyUser): Promise<MyUser>{
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const result = await db.query("INSERT INTO profile(username, email, password) VALUES ($1, $2, $3) RETURNING *", 
            [data.username, data.email, hashedPassword]
        );
        return result.rows[0];
    }
    static async update(data: MyUserInfo): Promise<MyUser>{
        const result = await db.query("UPDATE profile SET username = $1 WHERE id = $2 RETURNING *",
            [data.username, data.id]
        );
        return result.rows[0];
    }
    static async updateEmail(id: string, email: string): Promise<MyUser>{
        const result = await db.query("UPDATE profile SET email = $1 WHERE id = $2 RETURNING *",
            [email, id]
        );
        return result.rows[0];
    }
    static async updatePassword(id: string, password: string): Promise<MyUser>{
        const result = await db.query("UPDATE profile SET password = $1 WHERE id = $2 RETURNING *",
            [password, id]
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