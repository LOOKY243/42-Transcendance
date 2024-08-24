import { AComponent } from "../../../spa/component/AComponent.js";
import { ReplayObservable } from "../../../spa/utils/ReplayObservable.js";

export class TextButtonComponent extends AComponent {
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
		let ret = new TextButtonComponent(value.parentSelector, value.name);
		ret.onClick.subscribe(value.onclick);
		ret.buttonText.next(value.langKey);
		return ret;
	}

	getCSSPath() {
		return "app/component/textButton/TextButton.component.css";
	}

	generateHtml(config) {
		this.html = `
			<span class="buttonText">${config.text}</span>
		`;
	}
}