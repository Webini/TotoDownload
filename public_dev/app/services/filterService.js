angular.module('services')
	   .service('FilterService', [function(){
		   
	var filters = {
		filters: {},
		enabled: {},
		//le nombre de clées a trouver pour que la recherche soit une réussite
		foundSuccess: 0,

		setDefault: function(data){
			for(var i = 0; i < data.length; i++){
				if(!this.filters[data[i].name])
					this.add(data[i].name, data[i].data, true);
			}
		},
		
		add: function(name, data, defaultData){				
			if(!data)
				data = {};
				
			if(!data['enabled'])
				data['enabled'] = false;
			else
				this.enabled[name] = data;
			
			if(!data['removable'])
				data['removable'] = false;
				
			if(defaultData)
				data['default'] = true;
				
			this.filters[name] = data;	
			
			this._saveInLocalStorage();
			this._calculateFoundSuccess();
		}, 
		
		remove: function(name){
			if(this.filters[name]){
				delete this.filters[name];
				if(this.enabled[name])
					delete this.enabled[name];
					
				this._saveInLocalStorage();
				this._calculateFoundSuccess();
			}
		},
		
		enable: function(name){
			if(this.filters[name]){
				this.filters[name].enabled = true;
				this.enabled[name] = this.filters[name];
				this._calculateFoundSuccess();
			}
		},
		
		disable: function(name){
			if(this.filters[name]){
				this.filters[name].enabled = false;
				delete this.enabled[name];
				this._calculateFoundSuccess();
			}
		},
		
		_saveInLocalStorage: function(){
			var cfilters = {};
			for(var key in this.filters){
				if(!this.filters[key].default){
					cfilters[key] = this.filters[key];
				}
			}
			
			window.localStorage.setItem('_filters', angular.toJson(cfilters));	
		},
		
		_calculateFoundSuccess: function(){
			var keys = {};
			for(var key in this.enabled){
				keys[this.enabled[key].key] = true;
			}
			
			this.foundSuccess = 0;
			
			for(var key in keys){
				this.foundSuccess++;
			}
		}
	};
	
	filters.comparator = function(element){
		var comp = filters.enabled;
		var found = {};
		
		for(var key in comp){
			if(element[comp[key].key] === comp[key].value)
				found[comp[key].key] = true; 
		}
		
		var foundNumber = 0;
		for(var key in found){
			foundNumber++;
		}
		
		return (foundNumber == filters.foundSuccess);
	};
	
	//load from localStorage
	try{
		var localFilters = JSON.parse(window.localStorage.getItem('_filters'));
		for(var key in localFilters){
			if(localFilters[key].enabled)
				localFilters[key].enabled = false;
			
			filters.add(key, localFilters[key]);
		}	
	}
	catch(e){}
	
	return filters;
	
}]).filter('orderDefault', function () {
	return function(items, reverse){
		var filtered = [];
		
		for(var key in items){
			items[key].name = key;
			filtered.push(items[key]);
		};
		
		filtered.sort(function (a, b) {
			return (a['default'] === true ? -1 : 1);
		});
		
		if(reverse) 
			filtered.reverse();
		
		return filtered;
	};
});