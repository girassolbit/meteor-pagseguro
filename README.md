PagSeguro
=========

## Installation
```sh 
$ meteor add gbit:pagseguro
```

## Testing (if you clone the package)
```sh 
$ meteor test-packages ./
```
## PagSeguro documentation
- [API de Pagamentos](https://pagseguro.uol.com.br/v3/guia-de-integracao/api-de-pagamentos.html)

## Not implemented yet in this early beta
- Transactions consultation
- Payment info handlers
- Proper payment status infos

# Setting up
### Initializing seller data
```js
Meteor.startup(function(){
	PagSeguro.settings({
		email: 'youremail@net.com', 
		token: 'YOUR_TOKEN'
	});

	// Default currency is BRL, but you can set another: 

	PagSeguro.settings({
		email: 'youremail@net.com',
		token: 'YOUR_TOKEN',
		currency: 'USD'
	});
});
```

### API urls
Define which URLs PagSeguro should use to send purchases data.
```js
Meteor.startup(function(){
	PagSeguro.config.callbackUrls({
		// PagSeguro are going to sending here infos
		// concerning your purchase's payment status
		notifications: '/pagseguro_notifications',
		
		// successfulPurchase -> Here is to where your user 
		// will be redirected after leaving PagSeguro's 
		// payment panel
		successfulPurchase: '/pagseguro_confirmation',
		
		// After calling `buy.checkout()`, PagSeguro's
		// will redirect your user with payment's code to here
		confirmationCode: '/pagseguro_response',
	})
});
```
### Setting Purchases Mongo Collection
This package will use a default Mongo Collection if none was informed.
The default Mongo Collection are available at `PagSeguro.config._purchasesCollection`. 

But you if want to set a collection of your own:
```js
Meteor.startup(function(){
	PagSeguro.config.PurchasesCollection(PurchasesCollection);
});
```
If you want to use SimpleSchema to validade your docs, be sure to add at least this 
fields in your schema:
```js
	Schemas.Purchases = new SimpleSchema({
		// Created automatically while processing the request
		// with Random.id
		reference: {
			type: String
		},

		items: {
			type: [Object],
			label: 'Purchase items'
		},
		
		createdAt: {
			type: Date,
		},

		// This field are modified by the respective purchase payment
		// status notified by PagSeguro 
		status: {
			type: String
		},
		
		// Here goes your client data 
		sender: {
			type: Object,
			label: 'User'
		},

		// Here goes infos about shipping address 
		shippingAddress: {
			type: Object
		}
	});

	PurchasesCollection.attachSchema(Schemas.Purchases);
```
### Handling sender data
To say how your sender data will be got, you must define a handler. 
Ensuring to return an object with the data, available fields are (not all are required):
*senderName, senderPhone, senderAreaCode, senderEmail, senderCPF, senderBornDate*:

```js
// Server code!

PagSeguro.config.SenderHandler(function(){
	// Code of yours here
	// Doing some amazing stuff
	// and...

	return {
		// You can define others fields that will be saved
		// in purchase doc but won't go in the request
		someOtherField: 'I love you',
		senderName: 'John Doe' 
		senderPhone: '9999-9999', 
		senderAreaCode: '99', 
		senderEmail: 'johndoe@example.net'	
	}
})
```
That handler will be called while processing your request.

### Handling shipping address data
To say how your shipping address data will be got, you must define a handler. 
Ensuring to return an object with with the data, available fields are (not all are required):
*shippingType, shippingAddressStreet, shippingAddressNumber, 
shippingAddressComplement, shippingAddressDistrict, shippingAddressPostalCode, 
shippingAddressCity, shippingAddressState', shippingAddressCountry*:

```js
// Server code!

PagSeguro.config.ShippingHandler(function(){
	// Code of yours here
	// Doing some amazing stuff
	// and...

	return {
		shippingType:, 
		shippingAddressStreet: 'St. Blue', 
		shippingAddressNumber: '123', 
		shippingAddressComplement: 'CS1', 
		shippingAddressDistrict: '13', 
		shippingAddressPostalCode: '4444-666', 
		shippingAddressCity: 'City', 
		shippingAddressState: 'State', 
		shippingAddressCountry: 'Country'	
	}
})
```
That handler will be called while processing your request.

### Using the cart
Cart items are saved in local minimongo, but thanks to PersistentMinimongo, your user can
navigate freely through your site and it won't be reseted.

To use the items cart just initialize in your CLIENT CODE a new PagSeguro instance.
```js
var buy = new PagSeguro(); 


```

### Adding items to Cart
```js
buy.addItems({
	quantity: 1,
	weight: 0.263, // kg
	amount: 15.0, // R$ 15,00
	description: 'Very cool stuff',
	shippingCost: 0,
});
=> { _id: '...', description: 'Very cool stuff', amount: 15.0, weight: 0,  }
```
You should pass at least amount and description

### Removing items from Cart
```js
buy.removeItem(itemId)

// removing all items
buy.removeAllItems();
```

### Checkout
```js
// You can let the server redirect the user to purchase's payment 
buy.checkout();

// Or you can do the user redirecting in client side
// just passing a callback to buy.checkout
buy.checkout(function(err, response){
	Router.go(response.paymentUrl);	
});
```
The items cart will be erased when checkout is fired, but you can say to not:
```js
buy.checkout(false);
// or
buy.checkout(callback, false);
```