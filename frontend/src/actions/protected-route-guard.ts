'use server'

import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

const SECRET = process.env.JWT_SECRET || "";

export async function protectRoute() {
    
    const token = await cookies().then(cookies => cookies.get("token")?.value || "")
    if (!token) {
        return false;
    }
    return validToken(token);

}

export async function validToken(token: string) {
    if (!token) {
        return false;
    }
    try {
        jwt.verify(token, SECRET);
        return true;

    } catch (error) {
        console.error(error);
        return false;
    }

}