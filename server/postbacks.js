Meteor.startup(function(){
	var notificationRoute = Meteor.absoluteUrl(PagSeguro.cbUrls.notification);
	Router.route(notificationRoute, function(){
		
	}, {where: 'server'});
});