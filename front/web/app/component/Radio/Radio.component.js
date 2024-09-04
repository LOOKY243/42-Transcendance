import { AComponent } from "../../../spa/component/AComponent.js";
import { Observable } from "../../../spa/utils/Observable.js";

export class RadioComponent extends AComponent {
	radioSelect = new Observable();

	onInit() {
		super.onInit();
		this.generateHtml({});
	}

	render() {
		super.render();
		document.getElementsByName("ballSpeedRadio").forEach(element => {
			element.addEventListener("change", () => {
				this.radioSelect.next(element.id); 
			});
		});
	}

	generateHtml(config) {
		this.html = `
			<input type="radio" class="btn-check" name="ballSpeedRadio" id="slow" autocomplete="off">
			<label for="slow" class="btn btn-outline-primary">Slow</label>
			
			<input type="radio" class="btn-check" name="ballSpeedRadio" id="normal" autocomplete="off">
			<label for="normal" class="btn btn-outline-primary">Normal</label>

			<input type="radio" class="btn-check" name="ballSpeedRadio" id="fast" autocomplete="off">
			<label for="fast" class="btn btn-outline-primary">Fast</label>
		`;
	}
}