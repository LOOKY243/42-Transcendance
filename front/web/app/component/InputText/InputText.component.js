import { AComponent } from "../../../spa/component/AComponent.js";
import { Observable } from "../../../spa/utils/Observable.js";

export class InputTextComponent extends AComponent {
	onInit() {
		super.onInit();
		this.generateHtml({});
	}

	getChildComponent() {
		return [];
	}

	generateHtml(calculatedConfig) {
		this.html = `<input type='text'></input>`
	}
}