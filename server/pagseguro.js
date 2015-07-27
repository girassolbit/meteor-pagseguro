Meteor.methods({
	pagSeguroCheckout: function(items, clientRedir){
		this.unblock();
		
		PagSeguro.config.ensureCollection();

		var purchase = {
			reference: Random.id(),
			items: items,
			createdAt: new Date(),
			status: 'waiting',
			sender: PagSeguro.config._senderHandler(),
			shippingAddress: PagSeguro.config._shippingHandler() 
		};

		var request = PagSeguroUtils.serializeRequest(purchase);

		var response = HTTP.post(PagSeguro.config.API_URL, {
			params: _.extend(request, {
				redirectURL: PagSeguro.config.cbUrls.confirmationCode,
				notificationURL: PagSeguro.config.cbUrls.notifications
			}),
			headers: {
				'Accept-Charset': PagSeguro.config.encoding
			}
		});

		var checkoutCode;
		if(response.error)
			return response.error
		else {
			purchase.purchaseCode = checkoutCode = xml2js.parseStringSync(response.content).checkout.code;
			PagSeguro.config._purchaseCollection.insert(purchase);			
		}

		var paymentUrl = PagSeguro.config.API_PAYMENT_URL + checkoutCode;
		if(clientRedir){
			response.paymentUrl = paymentUrl;
			return response;
		} else {
			return response;
		}
	}
});