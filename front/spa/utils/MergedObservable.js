export class MergedObservable {
	func = [];
	valueList = {};

	mergeObservable(name, observable) {
		observable.subscribe((value) => {
			this.valueList[name] = value;
			this.func.forEach((value) => {
				value(this.valueList);
			})
		});
		return this;
	}

	subscribe(newFunc) {
		this.func.push(newFunc);
		newFunc(this.valueList);
	}
}