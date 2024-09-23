export class Observable {
	value = null;
	func = [];
	mappingFunc = null;

	subscribe(newFunc) {
		this.func.push(newFunc);
	}
	
	next(newValue) {
		if (newValue == this.value) {
			return ;
		}
		this.value = newValue;
		this.func.forEach((value) => {
			this.triggerFunc(value);
		});
	}

	setMappingFunc(func) {
		this.mappingFunc = func;
	}

	triggerFunc(func) {
		let ret = this.value != undefined ? JSON.parse(JSON.stringify(this.value)) : undefined;
		if (this.mappingFunc)
			ret = this.mappingFunc(this.value);
		func(ret);
	}

	isEmpty() {
		return !this.value;
	}
}
