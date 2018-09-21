var Revision = require("../models/revision")
var Loginuser = require("../models/loginuser")
var User = require("../models/users")
var request = require('request');


//用user name和password post function页面
module.exports.showSample=function(req,res){
	userName=req.body.userName;
	password=req.body.password;
	sess = req.session;
	Loginuser.try_login(userName,password, function(err,result){
		if(err){
			console.log("login failed");
		}else{
//			if(result>0){
//				sess.loged=true;				
				res.render("showSample.ejs");
//				}
//			else{res.redirect("/login?wrong=1")}
		}
	})
}

//get function页面
module.exports.showResult=function(req,res){
	sess = req.session;	
	sess.loged=true; //just for test
	if(sess.loged==true){
		if(req.url=="/"){
			if(req.app.locals.admins==0){
				User.get_admin_list(function(err,result){
					if(err){
						console.log("Cannot find admin list!")
					}else{
						res.app.locals.admins=result[0].list;
					}
				})
			}
			if(req.app.locals.bots==0){
				User.get_bot_list(function(err,result){
					if(err){
						console.log("Cannot find bot list!")
					}else{
						res.app.locals.bots=result[0].list;
					}
				})
			}
			res.render("showSample.ejs")
		}

		else if(req.url.indexOf("overall")>-1){		
			o1_result=[]
			o2_result=[]
			o4_result=[]
			o5_result=[]
			o6_result=[]
			o7_result=[]
			anon_result=[]
			admin_result=[]
			bot_result=[]
			regular_result=[]
			results=[]
			Revision.highest_number_of_revisions(function(err,result){
				if (err){
					console.log("Cannot find highest number of revisions!")
				}else{
					console.log(result);
					o1_result=result;									
					Revision.article_edited_by_largest_group_of_registered_users(function(err,result){
						if (err){
							console.log("Cannot find lowest number of revisions!")
						}else{
							console.log(result);
							o4_result=result;
							Revision.article_edited_by_smallest_group_of_registered_users(function(err,result){
								if (err){
									console.log("Cannot find lowest number of revisions!")
								}else{
									console.log(result);
									o5_result=result;
									Revision.articles_with_the_longest_history(function(err,result){
										if (err){
											console.log("Cannot find lowest number of revisions!")
										}else{
											console.log(result);
											o6_result=result;
											Revision.articles_with_the_shortest_history(function(err,result){
												if (err){
													console.log("Cannot find lowest number of revisions!")
												}else{
													console.log(result);
													o7_result=result;
													Revision.anon_by_year(function(err,result){
														if (err){
															console.log("Cannot find lowest number of revisions!")
														}else{
															anon_result=result;
															console.log(anon_result)
															Revision.bot_by_year(req.app.locals.bots,function(err,result){
																if (err){
																	console.log("Cannot find lowest number of revisions!")
																}else{
																	bot_result=result;
																	console.log(bot_result);
																	Revision.admin_by_year(req.app.locals.admins,function(err,result){
																		if (err){
																			console.log("Cannot find lowest number of revisions!")
																		}else{
																			admin_result=result;
																			console.log(admin_result);
																			Revision.regular_by_year(req.app.locals.admins,req.app.locals.bots,function(err,result){
																				if (err){
																					console.log("Cannot find lowest number of revisions!")
																				}else{
																					regular_result=result;
																					console.log(regular_result);
//																					res.json({result:{"r1":o1_result,"r2":o4_result}})
																					results.push(o1_result)
																					results.push(o4_result)
																					results.push(o5_result)
																					results.push(o6_result)
																					results.push(o7_result)
																					results.push(regular_result)
																					results.push(anon_result)
																					results.push(bot_result)
																					results.push(admin_result)
																					res.send(results)
//																					res.send(o1_result,o4_result,o5_result,o6_result,o7_result,regular_result,anon_result,bot_result,admin_result)
																				}	
																			})
																		}	
																	})
																}	
															})
														}	
													})
												}	
											})	
										}	
									})	
								}	
							})			
						}	
					})	
				}	
			})
		}
		else if(req.url.indexOf("getin")>-1){
			console.log(req.url)
			Revision.highest_number_of_revisions(function(err,result){
				if (err){
					console.log("Cannot find lowest number of revisions!")
				}else{
					console.log(result)
					res.send(result)

				}	
			})
		}
		else if(req.url.indexOf("check")>-1){
			title=req.query.check
			Revision.check_latest(title,function(err,result){
				if(err){
					console.log("Cannot check")
				}else{
					now_time=new Date().getTime()
					latest_time=result[0].timestamp.getTime()
					console.log(now_time)
					console.log(result[0].timestamp.getTime())
					days=(now_time-latest_time)*1.0/24/3600/1000
					console.log(days)
					if(days>1){
						console.log("1")
						var wikiEndpoint = "https://en.wikipedia.org/w/api.php",
						parameters=["action=query",
							"prop=revisions",
							"rvprop=user|timestamp|anon",
							"rvstart="+new Date(result[0].timestamp.getTime()+1000).toISOString(),
							"rvdir=newer",
							"format=json",
							"titles="+encodeURI(title),
							"rvlimit=max"]
						console.log("2")
						headers = {
								Accept: 'application/json',
								'Accept-Charset': 'utf-8'
								}
						console.log("3")
						var url = wikiEndpoint + "?" + parameters.join("&")
						console.log("url: " + url)
						var options = {
							url: url,
							'Accept': 'application/json',
							'Accept-Charset': 'utf-8'
						}
						console.log(4)
						request(options, function (err, res1, data){
							console.log(5)
							if (err) {
								console.log('Error:', err);
							} else if (res1.statusCode !== 200) {
								console.log('Status:', res1.statusCode);
							} else {
								json = JSON.parse(data);
								pages = json.query.pages
								revisions = pages[Object.keys(pages)[0]].revisions
								console.log(revisions)
								if(revisions){
									for(var i=0;i<revisions.length;i++){
										if(revisions[i].anon==''){
											var inserted = new Revision({
												title: title, 
												timestamp:revisions[i].timestamp, 
												user:revisions[i].user, 
												anon:''
											})
											//inserted.save();
											console.log("save anon")									
										}
										else{
											var inserted = new Revision({
												title: title, 
												timestamp:revisions[i].timestamp, 
												user:revisions[i].user
											})
											//inserted.save();
											console.log("save anon")	
										}
									}
									results=["updated",revisions.length]
									res.send(results)	
								}
								else{
								results=["updated",0]
								res.send(results)
								}
							}
						})
						
					}else{
						results=["notupdated",0]
						res.send(results)
					}
				}
			})
		}
		else if(req.url.indexOf("individual")>-1){
			results=[]
			users=[]
			title=req.query.individual
			console.log(title)
			bots=req.app.locals.bots
			admins=req.app.locals.admins
			Revision.individual_get_title(admins,bots,title,function(err,result){
				if (err){
					console.log("Cannot find lowest number of revisions!")
				}else{
					console.log(result)
					users.push(result[0]._id)
					users.push(result[1]._id)
					users.push(result[2]._id)
					users.push(result[3]._id)
					users.push(result[4]._id)
					results.push(result)
					Revision.title_anon_by_year(title,function(err,result){
						if (err){
							console.log("Cannot find title_anon_by_year!")
						}else{
							console.log(result)					
							results.push(result)
							Revision.title_bot_by_year(bots,title,function(err,result){
								if (err){
									console.log("Cannot title_bot_by_year!")
								}else{
									console.log(result)					
									results.push(result)
									Revision.title_admin_by_year(admins,title,function(err,result){
										if (err){
											console.log("Cannot find title_admin_by_year!")
										}else{
											console.log(result)					
											results.push(result)
											Revision.title_regular_by_year(admins,bots,title,function(err,result){
												if (err){
													console.log("Cannot find title_regular_by_year!")
												}else{
													console.log(result)					
													results.push(result)
													Revision.title_by_year_user(title,users,function(err,result){
														if (err){
															console.log("Cannot find title_by_year_user!")
														}else{
															console.log(result)					
															results.push(result)
															res.send(results)
														}	
													})
												}	
											})
										}	
									})
								}	
							})
						}	
					})
				}	
			})
		}
		
		else if(req.url.indexOf("author")>-1){
			name=req.query.author
			Revision.author_analytics(name,function(err,result){
				if (err){
					console.log("Cannot find lowest number of revisions!")
				}else{
					console.log(result)					
					res.send(result)
				}
			})
		}
	}else{
		res.redirect("/login")
	}
}

