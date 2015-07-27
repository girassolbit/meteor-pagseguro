var buy = new PagSeguro();
buy.removeAllItems();

Tinytest.add('Cart - Should add items', function (test){
	buy.addItem({
		amount: 15,
		description: 'Very cool book'
	});

	var item = _.omit(buy.fetchItems()[0], ['_id']);

	test.equal(item, {
		quantity: 1,
		amount: 15,
		weight: 0,
		description: 'Very cool book'
	});
});

Tinytest.add('Cart - Should remove item', function(test){
	var item = buy.addItem({
		amount: 15,
		description: 'Very cool book'
	});

	test.equal(buy.removeItem(item._id), 1);
});

Tinytest.addAsync('PagSeguro checkout - Should receive purchase code', function(test, next){
	buy.checkout(function(err, res){
		test.equal(res.statusCode, 200);
		next();
	});
});
