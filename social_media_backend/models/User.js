 const mongoose =require("mongoose");
 const userSchema =new mongoose.Schema({
   username:{type:String,required:true,unique:true},
   email:{type:String,required:true,unique:true},
   password:{type:String,required:true}
,profileImage:{type:String,default:"https://tse1.mm.bing.net/th?id=OIP.y-nGyqT5AwES8oqp344z4gHaHa&pid=Api&rs=1&c=1&qlt=95&w=123&h=123"}
,followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
 },{timestamps:true,versionKey:false})

 const User =mongoose.model("User",userSchema)

 module.exports =User;