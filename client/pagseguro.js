var CartItems = new Mongo.Collection('cart-items', {connection: null}),
	CartItemsPersistent = new PersistentMinimongo(CartItems);

PagSeguro.API = function(settings){
	if(!settings || !settings.token || !settings.email ){
		throw new Error('You must set your token and email');
	}

	this.token = settings.token;
	this.email = settings.token;

	return this;
}

PagSeguro.API.prototype = {
	constructor: PagSeguro.API,

	CartItems: CartItems,

	// { description, amount, quantity, weight }
	addItem: function(item){
		if(!item.amount || !item.description){
			throw new Error('Must have at least amount and description');
		}

		item = _.extend({
			quantity: 1,
			weight: 0
		}, item);

		return CartItems.insert(item);
	},

	removeItem: function(id){
		return CartItems.remove(id);
	},

	removeAllItems: function(){
		_.each(CartItems.find({}).fetch(), function(item){
			CartItems.remove(item._id);
		})
	},
	
	fetchItems: function(){
		return CartItems.find({}).fetch();
	},

	checkout: function(callback, dontClearCart){
		if(_.isBoolean(callback)){ 
			dontClearCart = callback;
			callback = undefined; 
		}

		if(!dontClearCart){
			this.removeAllItems();
		}

		Meteor.call('pagSeguroCheckout', this.fetchItems(), !!callback,function(err, res){
			if(!callback) window.location = res.paymentUrl;
			else callback(err, res);
		});
	}
}