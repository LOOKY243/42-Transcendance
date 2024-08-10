import { Observable } from "./Observable.js"

export class ReplayObservable extends Observable {
	subscribe(newFunc) {
		super.subscribe(newFunc);
		newFunc(this.value);
	}
}