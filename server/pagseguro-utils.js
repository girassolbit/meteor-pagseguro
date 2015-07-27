PagSeguroUtils = {
	serializeItems: function(items){
		var serialized = {};

		_.each(items, function(item, i){
			i+=1;
			serialized['itemId' + i] = item._id;
			serialized['itemDescription' + i] = item.description;
			serialized['itemAmount' + i] = item.amount * 100;
			serialized['itemQuantity' + i] = item.quantity;
			serialized['itemWeight' + i] = item.weight * 1000;
			serialized['itemShippingCost' + i] = item.shippingCost * 1000;
		});

		return serialized;		
	},

	serializeSender: function(sender){
		var fields = _.pick(sender, 
			[
				'senderName', 'senderPhone', 'senderAreaCode', 'senderEmail',
				'senderCPF', 'senderBornDate'
			]
		);
		
		return fields;
	},

	serializeAddress: function(address){
		var fields = _.pick(address, 
			[
			'shippingType', 'shippingAddressStreet', 'shippingAddressNumber', 
	 		'shippingAddressComplement', 'shippingAddressDistrict', 'shippingAddressPostalCode', 
	 		'shippingAddressCity', 'shippingAddressState', 'shippingAddressCountry',
	 		]
	 	);

		return fields;
	},

	/**
	 * Parametize an flat object.
	 * @param  {Object} obj 
	 * @return {String} 
	 */
	parametizer: function(obj){
		var params = [];

		_.each(obj, function(value, key){
			params.push(key + '=' + value);
		});

		return params.join('&');
	},

	serializeRequest: function(purchase){
		var request = {}, sets = PagSeguro._settings;

		request = _.extend(request, this.serializeItems(purchase.items))
		request = _.extend(request, this.serializeSender(purchase.sender))
		request = _.extend(request, this.serializeAddress(purchase.shippingAddress));

		request.reference = purchase.reference;
		request.currency = sets.currency;
		request.email = sets.email;
		request.token = sets.token;

		return request;
	},

	stringifyRequest: function(purchase){
		var request = this.serializeRequest(purchase);
		return this.parametizer(request);
	}
}