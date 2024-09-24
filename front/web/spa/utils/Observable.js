let generateSubscribeId = 0;

export class Observable {
	value = null;
	func = [];
	mappingFunc = null;

	subscribe(newFunc) {
		let object = {
			func: newFunc,
			id: generateSubscribeId++
		}
		this.func.push(object);
		return object.id;
	}
	
	unsubscribe(id) {
		this.func = this.func.filter(element => element.id !== id);
	}

	next(newValue) {
		if (newValue == this.value) {
			return ;
		}
		this.value = newValue;
		this.func.forEach((value) => {
			this.triggerFunc(value.func);
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
