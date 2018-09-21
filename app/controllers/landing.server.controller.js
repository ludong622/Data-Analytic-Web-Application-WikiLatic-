var Loginuser = require("../models/loginuser")


module.exports.showLandingPage=function(req,res){
	if(req.url.indexOf('logout')>-1){
		req.session.loged=false;
	}
	if(req.url.indexOf('wrong')>-1){
		res.render("landing.ejs",{wrong:1,repeatUsername:0,repeatEmail:0})
	}else{
		res.render("landing.ejs",{wrong:0,repeatUsername:0,repeatEmail:0})
	}
	
}

module.exports.register=function(req,res){
	console.log(req.body);
	var firstName=req.body.firstName;
	var lastName=req.body.lastName;
	var email=req.body.email;
	var userName=req.body.userName;
	var password=req.body.password;
	var repeatUsername=0;
	var repeatEmail=0;
	
	function function1(){
	Loginuser.try_register_username(userName,function(err,result){
		if (err){
			console.log("Cannot find article_edited_by_smallest_group_of_registered_users!")
		}else{
			repeatUsername=result;	
			console.log("first"+repeatUsername);
		}	
	});
	Loginuser.try_register_email(email,function(err,result){
		if (err){
			console.log("Cannot find article_edited_by_smallest_group_of_registered_users!")
		}else{
			repeatEmail=result;
			console.log(repeatEmail);
		}	
	});
	}
	
	function function2(){
	if(repeatUsername==0 & repeatEmail==0){
		console.log("second"+repeatUsername);
		console.log(repeatEmail);
		Loginuser.create({firstName:firstName,lastName:lastName,email:email,userName:userName,password:password}, function(err,result){
			if(err){
				console.log("register failed!")
			}
		})
	}
	}
	
	
	
	function function3(){
	res.render("landing.ejs",{wrong:0,repeatUsername:repeatUsername,repeatEmail:repeatEmail})
	}
	
	function1();
	setTimeout(function2, 500);
	setTimeout(function3,500);
}
