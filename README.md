PagSeguro
=========

## Instalação
```sh 
$ meteor add gbit:pagseguro
```
## Testando (caso você queira clonar)
```sh 
$ meteor test-packages ./
```

## Documentação no PagSeguro
- [API de Pagamentos](https://pagseguro.uol.com.br/v3/guia-de-integracao/api-de-pagamentos.html)

## Não implementado ainda neste novíssimo beta
- Consultamento de transações
- Handler dos dados de pagamento
- Respectivos status de pagamentos

# Configurando
### Definindo os dados do vendedor
```js
Meteor.startup(function(){
	PagSeguro.settings({
		email: 'youremail@net.com', 
		token: 'YOUR_TOKEN'
	});

	// A moeda padrão é o Real, mas você pode definir outra: 

	PagSeguro.settings({
		email: 'youremail@net.com',
		token: 'YOUR_TOKEN',
		currency: 'USD'
	});
});
```

### API urls
Defina quais URLs o PagSeguro deve usar para mandar dados das transações.
```js
Meteor.startup(function(){
	PagSeguro.config.callbackUrls({
		// PagSeguro ficará mandando aqui infos
		// sobre o status do pagamento das transações
		notifications: '/pagseguro_notifications',

		// successfulPurchase -> Aqui é para onde seu usuário
		// será redirectionando depois de sair da tela de pagamento do PagSeguro
		successfulPurchase: '/pagseguro_confirmation',
		
		// Depois de chamar `buy.checkout()`, PagSeguro
		// vai redirecionar o seu usuário com o código do pagamento pra cá
		confirmationCode: '/pagseguro_response',
	})
});
```
### Definindo onde as compras serão salvas no seu banco

Este pacote usará uma Mongo Collection padrão se nenhum for informado.
A collection padrão está disponível em `PagSeguro.config._purchasesCollection`.

Mas você pode querer configurar uma collection sua:
```js
Meteor.startup(function(){
	PagSeguro.config.PurchasesCollection(PurchasesCollection);
});
```
Se você quiser usar o SimpleSchema para validar seus docs, tenha certeza de adicionar pelo menos estes campos no seu schema:
```js
	Schemas.Purchases = new SimpleSchema({
		items: {
			type: [Object],
			label: 'Purchase items'
		},
		
		createdAt: {
			type: Date,
		},

		// Esse campo será modificado pelos status do pagamento da compra notificados
		// pelo PagSeguro
		status: {
			type: String
		},
		
		// Dados do comprador 
		sender: {
			type: Object,
			label: 'User'
		},

		// Dados do endereço de entrega
		shippingAddress: {
			type: Object
		}
	});

	PurchasesCollection.attachSchema(Schemas.Purchases);
```
### Manuseando os dados do comprador
Para dizer ao pacote como os dados do seu comprador serão pegos, você DEVE definir um handler.
Assegurando de retornar um objeto com os dados, os disponíveis são (nem todos são requeridos):
*senderName, senderPhone, senderAreaCode, senderEmail*:

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
		senderName: 'Silvio Santos' 
		senderPhone: '9999-9999', 
		senderAreaCode: '99', 
		senderEmail: 'silviosantos@sbt.com.br'	
	}
})
```
O handler será chamado durante o processando do request de pagamento.

### Handling shipping address data
Para dizer ao pacote como os dados de entrega do seu comprador serão pegos, você DEVE definir um handler.
Assegurando de retornar um objeto com os dados, os disponíveis são (nem todos são requeridos):
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
O handler será chamado durante o processando do request de pagamento.

### Usando o carrinho
Os items do seu carrinho são salvos no minimongo local (máquina do client), mas graças ao PersistentMinimongo, seu usuário pode navegar livrement pelo site e eles não serão 
resetados;

Para usar o carrinho de items, apenas crie uma nova instância do PagSeguro no seu client code: 
```js
var buy = new PagSeguro(); 
```

### Adicionando itens ao carrinho
```js
buy.addItems({
	amount: 15.0, // R$ 15,00
	description: 'Very cool stuff',
});
=> { _id: '...', description: 'Very cool stuff', amount: 15.0, weight: 0,  }
```
Você deve informar pelo menos a description e o amount

### Removendo itens do carrinho
```js
buy.removeItem(itemId)

// removing all items
buy.removeAllItems();
```

### Checkout
```js
// Você pode deixar o servidor redirecionar o usuário para o pagamento 
buy.checkout();

// Ou você pode redirecionar o usuário no client code
// apenas passando um callback para buy.checkout
buy.checkout(function(err, response){
	Router.go(response.paymentUrl);	
});
```
Os itens do carrinho serão apagados quando o checkout for disparado, mas você pode dizer pra isso não acontecer:
```js
buy.checkout(false);
// ou
buy.checkout(callback, false);
```