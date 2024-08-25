import { AComponent } from "../../../spa/component/AComponent.js";
import { ReplayObservable } from "../../../spa/utils/ReplayObservable.js";

export class InputComponent extends AComponent {
	inputType = new ReplayObservable();
	placeholder = new ReplayObservable();

	initConfig() {
		this.setConfig({
			inputType: this.inputType,
			placeholder: this.placeholder
		});
	}

	static create(value) {
		let ret = new InputComponent(value.parentSelector, value.name);
		ret.inputType.next(value.inputType);
		ret.placeholder.next(value.placeholder);
		return ret;
	}

	getCSSPath() {
		return "app/component/input/Input.component.css";
	}

	generateHtml(config) {
		this.html = `
			<input type="${config.inputType}" class="form-control input" placeholder="${config.placeholder}">
		`;
	}
}