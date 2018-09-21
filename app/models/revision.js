/**
 * 
 */
var mongoose = require('./db')

var RevisionSchema = new mongoose.Schema(
		{title: String, 
		 timestamp:Date, 
		 user:String, 
		 anon:String},
		 {
		 	versionKey: false
		})



//overall 1
RevisionSchema.statics.highest_number_of_revisions=function(callback){
	return this.aggregate([
		{$group : {_id : "$title", num_high : {$sum : 1}}},
		{$sort:{num_high:-1}},
//		{$limit:3}
		]).exec(callback)
}

//overall 2
RevisionSchema.statics.lowest_number_of_revisions=function(callback){	
	return this.aggregate([
		{$group : {_id : "$title", num_high : {$sum : 1}}},
		{$sort:{num_high:1}},
//		{$limit:3}
		]).exec(callback)
}

//overall 3.1
RevisionSchema.statics.highest_number_of_revisions_with_number=function(number, callback){	
	return this.aggregate([
		{$group : {_id : "$title", num_high : {$sum : 1}}},
		{$sort:{num_high:-1}},
		{$limit:number}
		]).exec(callback)
}

//overall 3.2
RevisionSchema.statics.lowest_number_of_revisions_with_number=function(number, callback){	
	return this.aggregate([
		{$group : {_id : "$title", num_high : {$sum : 1}}},
		{$sort:{num_high:1}},
		{$limit:number}
		]).exec(callback)
}

//overall 4
RevisionSchema.statics.article_edited_by_largest_group_of_registered_users=function( callback){	
	return this.aggregate([
	    {$match:{anon: { "$exists" : false } }},
	    {$group:{_id:{title:'$title', user:'$user'}, numberOfrevisions:{$sum:1}}}, 
	    {$group:{_id:'$_id.title', numberOfresults:{$sum:'$numberOfrevisions'}}},      
	    {$sort:{numberOfresults:-1}},
	    {$limit:1}
		]).exec(callback)
}

//overall 5
RevisionSchema.statics.article_edited_by_smallest_group_of_registered_users=function( callback){	
	return this.aggregate([
	    {$match:{anon: { "$exists" : false } }},
	    {$group:{_id:{title:'$title', user:'$user'}, numberOfrevisions:{$sum:1}}}, 
	    {$group:{_id:'$_id.title', numberOfresults:{$sum:'$numberOfrevisions'}}},      
	    {$sort:{numberOfresults:1}},
	    {$limit:1}
		]).exec(callback)
}

//overall 6
RevisionSchema.statics.articles_with_the_longest_history=function( callback){	
	return this.aggregate([
	    {$group:{_id:'$title', time:{$last:"$timestamp"}}},      
	    {$sort:{time:1}},
	    {$limit:3}
		]).exec(callback)
}

//overall 7
RevisionSchema.statics.articles_with_the_shortest_history=function( callback){	
	return this.aggregate([
	    {$group:{_id:'$title', time:{$last:"$timestamp"}}},      
	    {$sort:{time:-1}},
	    {$limit:1}
		]).exec(callback)
}

//overall 8 anon
RevisionSchema.statics.anon_by_year=function(callback){	
	return this.aggregate([
	    {$match:{anon: { "$exists" : true }}},
	    {$project:{year:{$year:"$timestamp"}}},
	    {$group:{_id:"$year", numberOfrevisions:{$sum:1}}},
	    {$sort: {_id:1}}
	    ]).exec(callback)
}

//overall 8 bots
RevisionSchema.statics.bot_by_year=function(bots,callback){
	return this.aggregate([    
		{$match: {$and:[{user:{$in:bots}},{anon:{"$exists":false}}]}},
	    {$project:{year:{$year:"$timestamp"}}},
		{$group:{_id:"$year", numberOfrevisions:{$sum:1}}},
		{$sort: {_id:1}}
	    ]).exec(callback)
}

//overall 8 admins
RevisionSchema.statics.admin_by_year=function(admins,callback){
	return this.aggregate([    
		{$match: {$and:[{user:{$in:admins}},{anon:{"$exists":false}}]}},
	    {$project:{year:{$year:"$timestamp"}}},
		{$group:{_id:"$year", numberOfrevisions:{$sum:1}}},
		{$sort: {_id:1}}
	    ]).exec(callback)
}

//overall 8 regular
RevisionSchema.statics.regular_by_year=function(admins,bots,callback){
	return this.aggregate([
		{$match: {$and:[{user:{$nin:admins}},{user:{$nin:bots}},{anon:{"$exists":false}}]}},
	    {$project:{year:{$year:"$timestamp"}}},
		{$group:{_id:"$year", numberOfrevisions:{$sum:1}}},
		{$sort: {_id:1}}
	    ]).exec(callback)
}

//individual get all
RevisionSchema.statics.individual_get_all=function(admins,bots,callback){	
	return this.aggregate([
		{$group:{_id:"$title", numberOfrevisions:{$sum:1}}},
		{$sort: {numberOfrevisions:-1}}
	    ]).exec(callback)
}

//individual get title
RevisionSchema.statics.individual_get_title=function(admins,bots,title,callback){	
	return this.aggregate([
		{$match: {$and:[{user:{$nin:admins}},{user:{$nin:bots}},{anon:{"$exists":false}},{title:title}]}},
		{$group:{_id:"$user", numberOfrevisions:{$sum:1}}},
		{$sort: {numberOfrevisions:-1}},
		{$limit:5}
	    ]).exec(callback)
}

//individual check
RevisionSchema.statics.check_latest=function(title,callback){
	return this.find({title:title})
				.sort({timestamp:-1})
				.limit(1)
				.exec(callback)
}

//individual anon
RevisionSchema.statics.title_anon_by_year=function(title,callback){	
	return this.aggregate([
	    {$match:{$and:[{anon:{"$exists" : true }},{title:title}]}},
	    {$project:{year:{$year:"$timestamp"}}},
	    {$group:{_id:"$year", numberOfrevisions:{$sum:1}}},
	    {$sort: {_id:1}}
	    ]).exec(callback)
}

//individual bots
RevisionSchema.statics.title_bot_by_year=function(bots,title,callback){
	return this.aggregate([    
		{$match:{$and:[{user:{$in:bots}},{title:title}]}},
	    {$project:{year:{$year:"$timestamp"}}},
		{$group:{_id:"$year", numberOfrevisions:{$sum:1}}},
		{$sort: {_id:1}}
	    ]).exec(callback)
}

//individual admins
RevisionSchema.statics.title_admin_by_year=function(admins,title,callback){
	return this.aggregate([    
		{$match:{$and:[{user:{$in:admins}},{title:title}]}},
	    {$project:{year:{$year:"$timestamp"}}},
		{$group:{_id:"$year", numberOfrevisions:{$sum:1}}},
		{$sort: {_id:1}}
	    ]).exec(callback)
}

//individual regular
RevisionSchema.statics.title_regular_by_year=function(admins,bots,title,callback){
	return this.aggregate([
		{$match: {$and:[{user:{$nin:admins}},{user:{$nin:bots}},{anon:{"$exists":false}},{title:title}]}},
	    {$project:{year:{$year:"$timestamp"}}},
		{$group:{_id:"$year", numberOfrevisions:{$sum:1}}},
		{$sort: {_id:1}}
	    ]).exec(callback)
}

//individual 5 users
RevisionSchema.statics.title_by_year_user=function(title,users,callback){
	return this.aggregate([
		{$match: {$and:[{user:{$in:users}},{title:title}]}},
	    {$project:{year:{$year:"$timestamp"},user:'$user'}},
		{$group:{_id:{year:'$year', user:'$user'}, numberOfrevisions:{$sum:1}}},
		{$sort: {_id:1}}
	    ]).exec(callback)
}

//individual insert_anon
RevisionSchema.statics.insert_anon_user=function(u,t,callback){
	return this.insert({user:u,timestamp:t,anon:''}).exec(callback)
}

RevisionSchema.statics.insert_other_user=function(u,t,callback){
	return this.insert({user:u,timestamp:t}).exec(callback)
}



//author
RevisionSchema.statics.author_analytics=function(name,callback){	
	return this.aggregate([
	    {$match:{user: name}},
	    {$group:{_id:"$title", numberOfrevisions:{$sum:1}, timestamps:{$push:"$timestamp"}}},
	    {$sort: {numberOfrevisions:-1}}
	    ]).exec(callback)
}




var Revision = mongoose.model('Revision', RevisionSchema, 'revisions')

module.exports = Revision
