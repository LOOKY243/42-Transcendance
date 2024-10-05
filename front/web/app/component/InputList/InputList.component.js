import { AComponent } from "../../../spa/component/AComponent.js";
import { InputComponent } from "../Input/Input.Component.js";

export class InputListComponent extends AComponent {
    isRelativeHtml = true;
	usernameList = [];

	onInit() {
		super.onInit();
		this.generateHtml({});

        for (let i = 1; i <= 16; i++) {
            console.log('create input:' + i);
            document.querySelector(this.getSelector()).innerHTML += `<div id="${"input" + i}" class='inputContainer m-2'>$</div>`;
            this.createSubComponent(InputComponent.create({
                name: `${'input' + i}`,
                parentSelector: this.getSelector(),
                inputType: 'text',
                placeholder: `${'player ' + i}`,
                onchange: (value) => this.usernameList[i] = value,
            }));
        }

        return true;
	}

	generateHtml(config) {
		this.html = `
			<div></div>
		`;
	}
}