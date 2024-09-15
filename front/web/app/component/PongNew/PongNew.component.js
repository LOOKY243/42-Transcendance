import { injector } from "../../../spa/Bootstrap.js";
import { AComponent } from "../../../spa/component/AComponent.js";
import { Router } from "../../../spa/Router.js";
import { GameService } from "../../service/Game.service.js";
import { ButtonComponent } from "../Button/Button.component.js";
import { ButtonIconComponent } from "../ButtonIcon/ButtonIcon.component.js";
import { InputComponent } from "../Input/Input.Component.js";
import { NavBarComponent } from "../NavBar/NavBar.component.js";
import { RadioComponent } from "../Radio/Radio.component.js";
import { RadioImgComponent } from "../RadioImg/RadioImg.component.js";

export class PongNewComponent extends AComponent {
	inputPlayers = "";
	inputPoints = "";
	ballSpeed = "";
	theme = "";
	params = {
		"players": false,
		"points": false,
		"theme": false,
		"ball": false
	};

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
		this.createSubComponent(ButtonIconComponent.create({
			name: "startButton",
			parentSelector: this.getSelector(),
			icon: "arrow",
			style: "btn btn-outline-info",
			onclick: () => injector[GameService].pongParams(this.inputPlayers, this.inputPoints, this.ballSpeed, this.theme)
		}));

		this.createSubComponent(new RadioComponent(this.getSelector(), "ballRadio"));
		this.subComponent["ballRadio"].radioSelect.subscribe((value) => {this.ballSpeed = value; this.params.ball = true; this.checkParams()});

		this.createSubComponent(new RadioImgComponent(this.getSelector(), "themeRadio"));
		this.subComponent["themeRadio"].radioSelect.subscribe((value) => {this.theme = value; this.params.theme = true; this.checkParams()});

		this.setConfig({
			pongTitle: this.translate("pongNew.pongTitle"),
			players: this.translate("pongNew.players"),
			ball: this.translate("pongNew.ball"),
			points: this.translate("pongNew.points"),
		});

		this.checkParams();

		return true;
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
								<div>${config.players}</div>
								<div class="d-flex justify-content-center m-2">
									<div id="playerInput" class="inputContainer"></div>
								</div>
							</div>
							<div class="my-5">
								<div class="fs-4 fw-semibold text-light my-2">${config.ball}</div>
								<div id="ballRadio"></div>
							</div>
						</div>
						<div class="col-md-4 text-center my-5">
							<div id="themeRadio" class="row d-flex justify-content-center"></div>
						</div>
						<div class="col-md-4 text-center my-5">
							<div class="fs-4 fw-semibold text-light">
								<div>${config.points}</div>
								<div class="d-flex justify-content-center m-2">
									<div id="pointInput" class="inputContainer"></div>
								</div>
							</div>
							<div class="mt-5 pt-4">
								<div id="startButton"></div
							</div>
						</div>
					</div>
				</div>
			</div>
		`;
	}
}