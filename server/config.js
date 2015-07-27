PagSeguro.config = {
	encoding: 'UTF-8',
	developerMode: function(status){
		if(status){
			this.API_URL += '/pagseguro_developer'
		}
	},

	API_URL: 'https://ws.pagseguro.uol.com.br/v2/checkout',
	API_HEADER: 'application/x-www-form-urlencoded; charset=UTF-8',
	API_PAYMENT_URL: 'https://pagseguro.uol.com.br/v2/checkout/payment.html?code=',
	
	cbUrls: {
		/**
		 * Define here the redir url you configured on PagSeguro
		 * PagSeguro will send the confirmation code, the code will be stored
		 * in purchase doc in the collection automatically.
		 * @type {String}
		 */
		confirmationCode: '/pagseguro_purchase_code',

		/**
		 * After getting the purchase code, the user will be redirected to here
		 * @type {String}
		 */
		successfulPurchase: '/pagseguro_confirmation/',

		/**
		 * PagSeguro will be sending to here changes in purchase status
		 * @type {String}
		 */
		notifications: '/pagseguro_notifications'
	},

	callbackUrls: function(urls){
		this.cbUrls = _.extend(this.cbUrls, urls);
	},

	/**
	 * Specifies the collection to save purchases.
	 * @param {Mongo.Collection} collection
	 */
	PurchaseCollection: function(collection){
		PagSeguro.config._purchaseCollection = collection;
	},

	/**
	 * Ensure that there is a collection to save purchases.
	 */
	ensureCollection: function(){
		if(!this._purchaseCollection){
			this.PurchaseCollection(new Mongo.Collection('pagseguroPurchases'));
		}
	},

	/**
	 * Here you can say how sender data will be defined
	 * Pay attention that you callback must return an object with at least:
	 * senderName, senderPhone, senderAreaCode, senderPhone, senderEmail.
	 * Additional fields you be salved in PurchaseCollection as well.
	 * Jokes with method's name and Adam Sandler's name won't be tolerated.
	 * @param {Function} callback
	 */
	
	_senderHandler: undefined,
	SenderHandler: function(callback){
		this._senderHandler = callback;
	},

	/**
	 * Here you can say how shipping address data will be defined
	 * Pay attention that you callback must return an object with at least:
	 * shippingType (can be EN [PAC] or SD [Sedex]), shippingAddressStreet, shippingAddressNumber, 
	 * shippingAddressComplement, shippingAddressDistrict, shippingAddressPostalCode, 
	 * shippingAddressCity, shippingAddressState, shippingAddressCountry.
	 * 
	 * Additional fields you be salved in PurchaseCollection as well.
	 * @param {Function} callback [description]
	 */
	_shippingHandler: undefined,
	ShippingHandler: function(callback){
		this._shippingHandler = callback;
	},

	/**
	 * Holds checkout callbacks
	 * @type {Array}
	 */
	_checkoutCallbacks: [],

	/**
	 * Set callbacks to be called when checkout is over
	 * @param  {Function} callback
	 */
	checkoutCallback: function(callback){
		this._checkoutCallbacks.push(callback);
	}
}