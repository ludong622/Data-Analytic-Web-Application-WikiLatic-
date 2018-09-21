/**
 * 
 */
var mongoose = require('./db')

var LoginSchema = new mongoose.Schema(
		{firstName: String, 
		 lastName:String, 
		 email:String, 
		 userName:String,
		 password:String},
		 {
		 	versionKey: false
		})

//查看是否是重复的用户名
LoginSchema.statics.try_register_username=function(userName,callback){	
	return this.find({"userName":userName}).count()
	.exec(callback)
}

//查看是否是重复的邮箱
LoginSchema.statics.try_register_email=function(email,callback){	
	return this.find({"email":email}).count()
	.exec(callback)
}


//注册插入
LoginSchema.statics.register=function(firstName,lastName,email,userName,password,callback){	
	return this.insert({
		"first_name":firstName,
		"last_name":lastName,
		"e-mail":email,
		"user_name":userName,
		"password":password		
	})
	.exec(callback)
}

//查看是否是正确的用户名或密码
LoginSchema.statics.try_login=function(userName,password,callback){
	return this.find({$and:[{"userName":userName},{"password":password}]}).count()
	.exec(callback)
}

var Loginuser = mongoose.model('Loginuser',LoginSchema,'loginusers')
module.exports = Loginuser