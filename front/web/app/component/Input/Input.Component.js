import { AComponent } from "../../../spa/component/AComponent.js";
import { ReplayObservable } from "../../../spa/utils/ReplayObservable.js";

export class InputComponent extends AComponent {
	inputType = new ReplayObservable();
	placeholder = new ReplayObservable();
	autocomplete = new ReplayObservable();

	initConfig() {
		this.setConfig({
			inputType: this.inputType,
			placeholder: this.placeholder,
			autocomplete: this.autocomplete,
		});
	}

	static create(value) {
		let ret = new InputComponent(value.parentSelector, value.name);
		ret.inputType.next(value.inputType);
		ret.placeholder.next(value.placeholder);
		if (value.autocomplete) {
			ret.autocomplete.next(value.autocomplete);
		} else {
			ret.autocomplete.next("");
		}
		ret.onChange.subscribe(value.onchange);
		return ret;
	}

	getCSSPath() {
		return "app/component/input/Input.component.css";
	}

	generateHtml(config) {
		this.html = `
			<input type="${config.inputType}" class="form-control input" ${config.autocomplete} placeholder="${config.placeholder}">
		`;
	}
}