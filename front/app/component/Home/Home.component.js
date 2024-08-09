import { AComponent } from "../../../spa/component/AComponent.js"
import { ButtonComponent } from "../Button/Button.component.js"
import { Observable } from "../../../spa/utils/Observable.js"
import { injector } from "../../../spa/Bootstrap.js"
import { Router } from "../../../spa/Router.js"
import { InputTextComponent } from "../InputText/InputText.component.js"

export class HomeComponent extends AComponent {
	buttonText = null;
	button = null;
	input = null;
	inputResult = new Observable();

	onInit() {
		super.onInit();
		this.generateHtml({});
		this.buttonText = new Observable();
		this.button = new ButtonComponent(this.getSelector(), "button", {
			onClick: () => {
				injector[Router].navigate("/user");
			}
		});
		this.button.setConfig({
			text: this.buttonText
		});
		this.buttonText.next("user page");
		this.input = new InputTextComponent(this.getSelector(), "input", {
			onChange: (event) => {
				console.log(event.target.value);
				this.inputResult.next(event.target.value);
			}
		});
		this.setConfig({
			inputResult: this.inputResult
		});
	}

	generateHtml(config) {
		this.html = `<h1>Home</h1><div id='input'></div><div id='button'></div>${config.inputResult}`;
	}

	getChildComponent() {
		return [this.button, this.input];
	}
}