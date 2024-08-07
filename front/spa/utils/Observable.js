export class Observable {
	value = null;
	func = [];
	
	subscribe(newFunc) {
		this.func.push(newFunc);
		newFunc(this.value);
	}
	
	next(newValue) {
		this.value = newValue;
		this.func.forEach((value) => {
			value(this.value);
		});
	}
}
