import mongoose from "mongoose";
import { z } from 'zod';
import Account from "../models/account-model.js";
import User from '../models/user-model.js';
import jwt from "jsonwebtoken";

export const transferFunds = async (req, res) => {
    let session;
    const transferSchema = z.object({
        fromAccountId: z.string(),
        toAccountId: z.string(),
        balance: z.number().int().positive(), 
    });

    try {
        const { fromAccountId, toAccountId, balance } = transferSchema.parse(req.body);
        
        session = await mongoose.startSession();
        session.startTransaction();

        const fromAccount = await Account.findOne({ userId: fromAccountId }).session(session);
        if (!fromAccount) {
            await session.abortTransaction();
            return res.status(404).json({ error: "From account not found." });
        }

        if (fromAccount.balance < balance) {
            await session.abortTransaction();
            return res.status(400).json({ error: "Insufficient funds." });
        }

        fromAccount.balance -= balance;
        await fromAccount.save({ session });

        const toAccount = await Account.findOne({ userId: toAccountId }).session(session);
        if (!toAccount) {
            await session.abortTransaction();
            return res.status(404).json({ error: "To account not found." });
        }

        toAccount.balance += balance;
        await toAccount.save({ session });

        await session.commitTransaction();
        res.status(200).json({ message: "Transfer successful." });
    } catch (error) {
        if (session && session.inTransaction()) {
            await session.abortTransaction();
        }
        res.status(500).json({ error: error.message });
    } finally {
        if (session) session.endSession(); // Ensure session is ended
    }
};


export const getBalance = async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(403).json({ message: 'Forbidden Access' });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded.userId) {
            return res.status(403).json({ message: 'Forbidden Access' });
        }
        
        const account = await Account.findOne({ userId: decoded.userId });
        if (!account) {
            return res.status(404).json({ message: 'Account not found.' });
        }

        res.status(200).json({ balance: account.balance });
    } catch (error) {
        console.error("Error fetching balance:", error); // Log the error
        res.status(500).json({ error: error.message });
    }
};

export const getName = async (req,res) =>{
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(403).json({ message: 'Forbidden Access' });
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded.userId) {
            return res.status(403).json({ message: 'Forbidden Access' });
        }
        const user = await User.findOne({ _id: decoded.userId });
        res.status(200).json({ user});

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
