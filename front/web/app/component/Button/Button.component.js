import { AComponent } from "../../../spa/component/AComponent.js"
import { ReplayObservable } from "../../../spa/utils/ReplayObservable.js";

export class ButtonComponent extends AComponent {
	buttonText = new ReplayObservable();

	initConfig() {
		this.setConfig({
			text: {
				value: this.buttonText,
				translate: true
			}
		});
	}

	static create(value) {
		let ret = new ButtonComponent(value.parentSelector, value.name);
		ret.onClick.subscribe(value.func);
		ret.buttonText.next(value.langKey);
		return ret;
	}

	getCSSPath() {
		return "app/component/Button/Button.component.css";
	}

	getChildComponent() {
		return [];
	}

	generateHtml(calculatedConfig) {
		this.html = `<button class='atom__button'>${calculatedConfig.text}</button>`
	}
}