import mongoose, {Schema,Document} from 'mongoose';

export interface Message extends Document {
    content: string;
    createdAt: Date
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true,
    },
    
        createdAt: {
            type:Date,
            required: true,
            default: Date.now
        }
    
})

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    isAcceptingMessage: boolean;
    messages: Message[]
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        trim: true,
        required: [true, "Username is required"]
    },
    email:{
        type: String,
        required: [true,'Email is required'],
        unique: true,
         match: [/^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/, 'please use a valid email address']
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
  
   
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    messages:[MessageSchema]

})


// exporting - first check model have or not if not have model then create

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema) 
export default UserModel;


