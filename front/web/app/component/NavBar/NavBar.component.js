import { injector } from "../../../spa/Bootstrap.js";
import { AComponent } from "../../../spa/component/AComponent.js";
import { Router } from "../../../spa/Router.js";
import { TranslateService } from "../../../spa/service/Translate.service.js";
import { IconComponent } from "../Icon/Icon.component.js";
import { TextButtonComponent } from "../textButton/TextButton.component.js";

export class NavBarComponent extends AComponent {
	onInit() {
		super.onInit();
		this.generateHtml({});

		this.createSubComponent(IconComponent.create({
			name: "chatIcon",
			parentSelector: this.getSelector(),
			icon: "chat",
			onclick: () => injector[Router].navigate("/chat")
		}));
		this.createSubComponent(IconComponent.create({
			name: "settingsIcon",
			parentSelector: this.getSelector(),
			icon: "settings"
		}));

		this.createSubComponent(TextButtonComponent.create({
			name: "homeButton",
			parentSelector: this.getSelector(),
			langKey: "navbar.home",
			onclick: () => injector[Router].navigate("/")
		}));
		this.createSubComponent(TextButtonComponent.create({
			name: "profileButton",
			parentSelector: this.getSelector(),
			langKey: "navbar.profile",
			onclick: () => injector[Router].navigate("/auth")
		}));

		this.createSubComponent(IconComponent.create({
			name: "frenchIcon",
			parentSelector: this.getSelector(),
			icon: "french",
			onclick: () => injector[TranslateService].setLang("fr")
		}));
		this.createSubComponent(IconComponent.create({
			name: "englishIcon",
			parentSelector: this.getSelector(),
			icon: "english",
			onclick: () => injector[TranslateService].setLang("en")
		}));
		this.createSubComponent(IconComponent.create({
			name: "italianIcon",
			parentSelector: this.getSelector(),
			icon: "italian",
			onclick: () => injector[TranslateService].setLang("it")
		}));

		this.createSubComponent(IconComponent.create({
			name: "pause",
			parentSelector: this.getSelector(),
			icon: "pause",
			onclick: () => injector[Router].bgVideo.videoSpeed.next(0)
		}));
		this.createSubComponent(IconComponent.create({
			name: "play",
			parentSelector: this.getSelector(),
			icon: "play",
			onclick: () => injector[Router].bgVideo.videoSpeed.next(0.75)
		}));
		this.createSubComponent(IconComponent.create({
			name: "playFill",
			parentSelector: this.getSelector(),
			icon: "playFill",
			onclick: () => injector[Router].bgVideo.videoSpeed.next(2)
		}));
	}

	getCSSPath() {
		return "app/component/NavBar/NavBar.component.css";
	}

	generateHtml(config) {
		this.html = `
		<nav class="navbar navbar-expand-lg">
			<div class="container-fluid">
				<a id="homeButton" class="navbar-brand me-4 nav-item"></a>
        		<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
					aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            		<span class="navbar-toggler-icon"></span>
        		</button>
				<div class="navbarCollapse d-flex justify-content-between">
					<a id="chatIcon" class="nav-item navbar-brand"></a>
				</div>
        		<div class="collapse navbar-collapse" id="navbarNavDropdown">
					<div class="btn-group">
						<div class="dropdown pe-4">
							<button id="settingsIcon" class="btn nav-item dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button>
							<ul class="dropdown-menu dropdown-menu-dark"> 	
							<div class="text-center fs-6">Lang</div>
							<div class="d-flex justify-content-center">
								<li><a id="frenchIcon" class="dropdown-item"></a></li>
								<li><a id="englishIcon" class="dropdown-item"></a></li>
								<li><a id="italianIcon" class="dropdown-item"></a></li>
							</div>
							<div class="line my-2"></div>
							<div class="text-center fs-6">Background Speed</div>
							<div class="d-flex justify-content-center">
								<li><a id="pause" class="dropdown-item"></a></li>
								<li><a id="play" class="dropdown-item"></a></li>
								<li><a id="playFill" class="dropdown-item"></a></li>
							</div>
							</ul>
						</div>
						<a id="profileButton" class="navbar-brand nav-item me-5"></a>
					</div>
        		</div>
			</div>
		</nav>`
	}
}
