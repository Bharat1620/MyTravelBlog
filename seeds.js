var mongoose=require("mongoose");
var Campground=require("./models/campground");
var Comment=require("./models/comment");

 var data=[{name:"Tent",image:"https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."}]

function seedDB()
{

Campground.remove({},function(err){
	if(err)
		console.log(err);
	else
		data.forEach(function(item)
		{
			Campground.create(item,function(err,item)
			{
               if(err) console.log(err);
               else
               	{
               		Comment.create({
               			text:"This place is great,but I wish there was internet",
               			author:"Homer"
               		},function(err,comment)
               		{
                      if(err) console.log(err);
                      else
                      {
                      	item.comments.push(comment);
                      	item.save();
                      }
               		});
               	}
			});
		})
});
}

module.exports=seedDB;