import { injector } from "../../../spa/Bootstrap.js";
import { AComponent } from "../../../spa/component/AComponent.js";
import { Router } from "../../../spa/Router.js";
import { ButtonComponent } from "../Button/Button.component.js";
import { InputComponent } from "../Input/Input.Component.js";
import { NavBarComponent } from "../NavBar/NavBar.component.js";

export class PongNewComponent extends AComponent {
	inputPlayers = "";
	inputPoints = "";
	params = {
		"players": false,
		"points": false,
		"theme": true,
		"ball": true
	};
	ballSpeed = 1;
	theme = 1;

	onInit() {
		super.onInit();
		this.generateHtml({});

		this.createSubComponent(new NavBarComponent(this.getSelector(), "navbar"));

		this.createSubComponent(InputComponent.create({
			name: "playerInput",
			parentSelector: this.getSelector(),
			inputType: "number",
			placeholder: "2",
			onchange: (value) => {this.inputPlayers = value; this.checkInputPlayer(); this.checkParams()}
		}));
		this.createSubComponent(InputComponent.create({
			name: "pointInput",
			parentSelector: this.getSelector(),
			inputType: "number",
			placeholder: "5",
			onchange: (value) => {this.inputPoints = value; this.checkInputPoint(); this.checkParams()}
		}));
		this.createSubComponent(ButtonComponent.create({
			name: "startButton",
			parentSelector: this.getSelector(),
			style: "btn btn-outline-info",
			content: "Start ➡",
			onclick: () => injector[Router].navigate("/pong/<id>")
		}));
		this.createSubComponent(ButtonComponent.create({
			name: "slowButton",
			parentSelector: this.getSelector(),
			style: "btn btn-outline-success",
			content: "Slow"
		}));

		this.setConfig({
			pongTitle: this.translate("pongNew.pongTitle"),
		});

		this.checkParams();
	}

	checkParams() {
		if (Object.values(this.params).some(value => value === false)) {
			this.subComponent["startButton"].disabled.next(true);
		} else {
			this.subComponent["startButton"].disabled.next(false);
		}
	}

	checkInputPoint() {
		if (this.inputPoints === "") {
			this.subComponent["pointInput"].error.next(false);
			this.params.points = false;
		} else if (this.inputPoints <= 0) {
			this.subComponent["pointInput"].error.next(true);
			this.subComponent["pointInput"].errorText.next("pongNew.inputError");
			this.params.points = false;
		} else {
			this.subComponent["pointInput"].error.next(false);
			this.params.points = true;
		}
	}

	checkInputPlayer() {
		if (this.inputPlayers === "") {
			this.subComponent["playerInput"].error.next(false);
			this.params.players = false;
		} else if (this.inputPlayers <= 0) {
			this.subComponent["playerInput"].error.next(true);
			this.subComponent["playerInput"].errorText.next("pongNew.inputError");
			this.params.players = false;
		} else {
			this.subComponent["playerInput"].error.next(false);
			this.params.players = true;
		}
	}

	getCSSPath() {
		return "app/component/PongNew/PongNew.component.css";
	}

	generateHtml(config) {
		this.html = `
			<div id="navbar"></div>
			<div class="container">
				<div class="containerBlur mt-5">
					<div class="fs-1 fw-bold newPongTitle text-center m-3"
						<span>${config.pongTitle}</span>
					</div>
					<div class="line"></div>
					<div class="row">
						<div class="col-md-4 text-center my-5">
							<div class="fs-4 fw-semibold text-light">
								<div> Players :</div>
								<div class="d-flex justify-content-center m-2">
									<div id="playerInput" class="inputContainer"></div>
								</div>
							</div>
							<div class="my-5">
								<div class="fs-4 fw-semibold text-light m-1"> Ball Speed :</div>
								<input type="radio" class="btn-check" name="ballSpeedRadio" id="slow" autocomplete="off">
								<label for="slow" class="btn btn-outline-success"><div id="slowButton"></div></label>

								<input type="radio" class="btn-check" name="ballSpeedRadio" id="normal" autocomplete="off">
								<label class="btn btn-outline-success" for="normal">NORMAL</label>

								<input type="radio" class="btn-check" name="ballSpeedRadio" id="fast" autocomplete="off">
								<label class="btn btn-outline-success" for="fast">FAST</label>
							</div>
						</div>
						<div class="col-md-4 text-center my-5">
							<div>THEME</div>
						</div>
						<div class="col-md-4 text-center my-5">
							<div class="fs-4 fw-semibold text-light">
								<div> Points to Win :</div>
								<div class="d-flex justify-content-center m-2">
									<div id="pointInput" class="inputContainer"></div>
								</div>
							</div>
							<div class="mt-5">
								<div id="startButton"></div
							</div>
						</div>
					</div>
				</div>
			</div>
		`;
	}
}