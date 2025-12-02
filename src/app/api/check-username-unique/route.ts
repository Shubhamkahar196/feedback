import {z} from 'zod'
import UserModel from '@/model/User'
import dbConnect from '@/lib/dbConnect'
import { usernameValidation } from '@/schemas/signUpSchema'


const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request){
     await dbConnect()

     try {
        const {searchParams} = new URL(request.url)
     } catch (error) {
        console.error("Error checking username",error);
        return Response.json({
            success: false,
            message: "Error checking username"
        },{status: 500})
     }
}