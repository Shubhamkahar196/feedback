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
        const queryParam = {
            username: searchParams.get('username')
        }
        // validate with zod

        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log(result); //checking and remove it 

        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: "Invalid query parameters"
            },{status: 400})
        }

        const {username} = result.data;

        const  existingVerifiedUser =await UserModel.find({username,isVerified:true})

        if(existingVerifiedUser){
            return Response.json({
                success: false,
                message: 'Username is already taken',
            },{status:400})
        }

        return Response.json({
            success: true,
            message: 'Username is available',
        },{status:201})
         

     } catch (error) {
        console.error("Error checking username",error);
        return Response.json({
            success: false,
            message: "Error checking username"
        },{status: 500})
     }
}