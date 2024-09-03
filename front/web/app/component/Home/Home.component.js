import { injector } from "../../../spa/Bootstrap.js";
import { AComponent } from "../../../spa/component/AComponent.js"
import { Router } from "../../../spa/Router.js";
import { ButtonComponent } from "../Button/Button.component.js";
import { InputComponent } from "../Input/Input.Component.js";
import { NavBarComponent } from "../NavBar/NavBar.component.js"

export class HomeComponent extends AComponent {
	inputId = "";
	
	onInit() {
		super.onInit();
		this.generateHtml({});

		this.createSubComponent(new NavBarComponent(this.getSelector(), "navbar"));

		this.createSubComponent(ButtonComponent.create({
			name: "pongButton",
			parentSelector: this.getSelector(),
			style: "btn btn-outline-success",
			content: "PLAY",
			onclick: () => injector[Router].navigate("/pong/new")
		}));
		this.createSubComponent(ButtonComponent.create({
			name: "battleButton",
			parentSelector: this.getSelector(),
			style: "btn btn-outline-success",
			content: "PLAY",
			onclick: () => injector[Router].navigate("/battle/create")
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
			onchange: (value) => {this.inputId = value; this.checkInput()}
		}));

		this.setConfig({
			searchGame: this.translate("home.searchGame"),
			pongTitle: this.translate("home.pongTitle"),
			battleTitle: this.translate("home.battleTitle"),
			pongContent: this.translate("home.pongContent"),
			pongContentBis: this.translate("home.pongContentBis"),
			battleContent: this.translate("home.battleContent"),
			battleContentBis: this.translate("home.battleContentBis")
		});

		this.checkInput();
	}

	checkInput() {
		if (this.inputId === "") {
			this.subComponent["idInput"].error.next(false);
			this.subComponent["idButton"].disabled.next(true);
		} else if (this.inputId <= 0) {
			this.subComponent["idButton"].disabled.next(true);
			this.subComponent["idInput"].error.next(true);
			this.subComponent["idInput"].errorText.next("home.errorText");
		} else {
			this.subComponent["idButton"].disabled.next(false);
			this.subComponent["idInput"].error.next(false);
		}
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
							<p class="fs-1 fw-bold pongTitle">${config.pongTitle}</p>
							<span class="fs-5 text-light">${config.pongContent}</span>
							<p class="fs-5 text-light d-flex align-items-start justify-content-center">${config.pongContentBis}</p>
							<div id="pongButton"></div>
						</div>
						<div class="col-md-6 text-center my-5">
							<p class="fs-1 fw-bold battleTitle">${config.battleTitle}</p>
							<span class="fs-5 text-light">${config.battleContent}</span>
							<p class="fs-5 text-light">${config.battleContentBis}</p>
							<div id="battleButton"></div>
						</div>
					</div>
					<div class="line mt-3"></div>
					<div class="my-5">
						<div class="text-center fs-3 fw-bold text-light">${config.searchGame}</div>
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
