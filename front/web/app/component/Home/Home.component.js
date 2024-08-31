import { AComponent } from "../../../spa/component/AComponent.js"
import { ButtonComponent } from "../Button/Button.component.js";
import { InputComponent } from "../Input/Input.Component.js";
import { NavBarComponent } from "../NavBar/NavBar.component.js"

export class HomeComponent extends AComponent {
	onInit() {
		super.onInit();
		this.generateHtml({});

		this.createSubComponent(new NavBarComponent(this.getSelector(), "navbar"));

		this.createSubComponent(ButtonComponent.create({
			name: "pongButton",
			parentSelector: this.getSelector(),
			style: "btn btn-outline-success",
			content: "PLAY",
		}));
		this.createSubComponent(ButtonComponent.create({
			name: "battleButton",
			parentSelector: this.getSelector(),
			style: "btn btn-outline-success",
			content: "PLAY",
		}));
		this.createSubComponent(ButtonComponent.create({
			name: "idButton",
			parentSelector: this.getSelector(),
			style: "btn btn-outline-success",
			content: "Search",
		}));

		this.createSubComponent(InputComponent.create({
			name: "idInput",
			parentSelector: this.getSelector(),
			inputType: "number",
			placeholder: "1234",
			onchange: (value) => console.log(value)
		}));

		this.setConfig({});
	}

	getCSSPath() {
		return "app/component/Home/Home.component.css";
	}

	generateHtml(config) {
		this.html = `
		<div id="navbar"></div>
			<div class="container">
				<div class="containerBlur mt-5">
					<div class="row">
						<div class="col-md-6 text-center my-5">
							<div id="pongButton"></div>
						</div>
						<div class="col-md-6 text-center my-5">
							<div id="battleButton"></div>
						</div>
					</div>
					<div class="line"></div>
					<div class="my-5">
						<div class="d-flex justify-content-center m-3">
							<div id="idInput" class="inputContainer"></div>
						</div>	
						<div id="idButton" class="text-center m-3"></div>
					</div>
				</div>
			</div>
		</div>`;
	}

}
