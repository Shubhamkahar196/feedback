import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function POST(request: Request){
    await dbConnect();

    try {
        const {username,code} = await request.json()

       const decodedUsername =  decodeURIComponent(username)
       const user = await UserModel.findOne({username: decodedUsername})
       if(!user){
        return Response.json({
            success: false,
            message: "User not found"
        },
    {status: 500})
       }

    //    checking code

    const isCodeValid = user.verifyCode === code
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

    if(isCodeValid && isCodeNotExpired){
        user.isVerified = true
        await user.save()
    }else if(!isCodeNotExpired){
        return Response.json({
            success: false,
            message: "Verification code has expired. please signup again to get a new code"
        },{status:400})
    }else {
        return Response.json({
            success: false,
            message: "Incorrect Verification Code"
        },{status: 400})
    }

    return Response.json({
        success: true,
        message: 'Account verified successfully'

    },{status:200})

    } catch (error) {
        console.error("Error verifying user", error)
        return Response.json(
            {
                success: false,
                message: "Error verifying user"
            }
        )
    }
}