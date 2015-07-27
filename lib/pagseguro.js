PagSeguro = function(settings){
	PagSeguro.settings(settings);

	return new PagSeguro.API(PagSeguro._settings);
}

// Used by API instances
PagSeguro.settings = function(settings){
	if(!PagSeguro._settings)
		PagSeguro._settings = _.extend({
			currency: 'BRL'
		}, settings);
	else
		PagSeguro._settings = _.extend(PagSeguro._settings, settings);
}