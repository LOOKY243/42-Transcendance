import { AComponent } from "../../../spa/component/AComponent.js";

export class InputFileComponent extends AComponent {
	onChangeFile = true;

	initConfig() {
		this.setConfig({
			inputText: this.translate("inputFile.text")
		});
	}

	static create(value) {
		let ret = new InputFileComponent(value.parentSelector, value.name);
		ret.registerOnChange(value.onchange);
		return ret;
	}

	generateHtml(config) {
		this.html = `
			<div>
				<input class="form-control" type="file" id="formFile" accept="image/png">
			</div>
		`;
	}
}