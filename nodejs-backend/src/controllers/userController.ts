import User, { MyUser } from '../models/User.js';
import { Request, Response } from 'express';
import { loginUser, registerUser } from '../services/AuthService.js';

export const getAllUsers = async (req: Request, res: Response) => {
    try{
        const users = await User.getAll();
        res.json(users);
    } catch(error){
        console.error("error fetching users: " + error);
        res.status(500).json({error: "error fetching users"});
    }
}

export const getUser = async (req: Request, res: Response) => {
    try{
        const user = await User.getOne(req.params.id);
        if (user === undefined) res.json({error: "no such user with this id"});
        res.json(user);
    } catch(error){
        console.error("error fetching user: " + error);
        res.status(500).json({error: "error fetching user"});
    }
}

export const createUser = async (req: Request, res: Response) => {
    try{
        const {username, email, password} = req.body;
        if (!username || !email || !password){
            res.status(400).json({error: "username, email and password are required"})
        }
        const message = await registerUser(username, email, password);
        res.status(201).json(message);

    } catch(error){
        console.error("error creating user: " + error);
        res.status(500).json({error: "error creating user"});
    }
}

export const updateUser = async (req: Request, res: Response) => {
    try{
        const {username, email, password} = req.body;
        const id = req.params.id;
        if (!username || !email || !password){
            res.status(400).json({error: "username, email and password are required"})
        }
        const user = await User.update({id, username, email, password});
        res.status(200).json({msg: "user updated successfuly", user})
    } catch(error){
        console.error("error updating user: " + error);
        res.status(500).json({error: "error updating user"});
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try{
        const user = await User.delete(req.params.id);
        res.json({msg: "user with id " + req.params.id + " has deleted successfuly"});
    } catch(error){
        // console.error("error deleting user: " + error);
        res.status(500).json({error: "error deleting user"});
    }
}

export const authenticateUser = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;
        const message = await loginUser(email, password);
        res.json(message);
    } catch(error){
        // console.error("error authenticating user: " + error);
        res.status(500).json({error: "error authenticating user: " + error})
    }
}

export const getCurrentUser = async (req: Request, res: Response) => {
    console.log(1);
    res.json({user: (req as any).user});
}