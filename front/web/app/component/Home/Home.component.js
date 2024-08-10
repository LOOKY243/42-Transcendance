import { AComponent } from "../../../spa/component/AComponent.js"
import { ButtonComponent } from "../Button/Button.component.js"
import { Observable } from "../../../spa/utils/Observable.js"
import { injector } from "../../../spa/Bootstrap.js"
import { Router } from "../../../spa/Router.js"
import { InputTextComponent } from "../InputText/InputText.component.js"

export class HomeComponent extends AComponent {
	button = null;
	input = null;

	onInit() {
		super.onInit();
		this.generateHtml({});
		
		this.button = new ButtonComponent(this.getSelector(), "button");
		this.button.onClick.subscribe(() => injector[Router].navigate("/user"));
		this.button.buttonText.next("user page");
		this.input = new InputTextComponent(this.getSelector(), "input");

		this.setConfig({
			inputResult: this.input.onChange
		});
	}

	generateHtml(config) {
		this.html = `<h1>Home</h1><div id='input'></div><div id='button'></div>${config.inputResult}`;
	}

	getChildComponent() {
		return [this.button, this.input];
	}
}