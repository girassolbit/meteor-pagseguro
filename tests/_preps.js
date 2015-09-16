faker.locale = 'pt_BR';

PagSeguro.settings({
	email: 'grsabreu@gmail.com',
	token: 'A3FBC72C2B3945878696C65D0977D551',
});

Router.route('/', { action: function(){ this.render(''); } });
if(Meteor.isServer){
	var fakeApiUrl = 'fake.pagseguro.com/api/v2/';
	HttpInterceptor = Package['xolvio:http-interceptor'].HttpInterceptor;
	HttpInterceptor.registerInterceptor(PagSeguro.config.API_URL, Meteor.absoluteUrl(fakeApiUrl));

	Router.route(fakeApiUrl, function(){
		this.response.writeHead(200, {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		});

		this.response.end(
			'<?xml version="1.0" encoding="ISO-8859-1"?><checkout>' +
	    	'<code>8CF4BE7DCECEF0F004A6DFA0A8243412</code>' +
	    	'<date>2010-12-02T10:11:28.000-02:00</date>' + 
			'</checkout>'
		);
	}, {where: 'server'});

	PagSeguro.config.SenderHandler(function(userId){
		return {
			senderName: faker.name.findName(),
			senderEmail: faker.internet.email(),
			senderPhone: faker.phone.phoneNumber(),
			senderAreaCode: '35'
		}
	});

	PagSeguro.config.ShippingHandler(function(userId){
		return {
			shippingType: 1,
			shippingAddressStreet: faker.address.streetName(),
			shippingAddressNumber: 182,
			shippingComplement: faker.address.secondaryAddress(),
			shippingAddressDistrict: 'Jardem Noronha',
			shippingAddressPostalCode: faker.address.zipCode(),
			shippingAddressCity: faker.address.city(),
			shippingAddressState: faker.address.state(),
			shippingAddressCountry: 'Brasel'
		};
	});
}