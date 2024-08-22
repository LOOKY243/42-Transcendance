import { AComponent } from "../../../spa/component/AComponent.js";

export class NavBarComponent extends AComponent {
	onInit() {
		super.onInit();
		this.generateHtml({});
	}

	getCSSPath() {
		return "app/component/NavBar/NavBar.component.css";
	}

	generateHtml(config) {
		this.html = `
		<nav class="navbar navbar-expand-lg bg-body-tertiary">
			<div class="container-fluid">
				<a class="navbar-brand me-4 nav-item" href="/">Home</a>
        		<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
					aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            		<span class="navbar-toggler-icon"></span>
        		</button>
        		<div class="collapse navbar-collapse" id="navbarNavDropdown">
					<div class="navbarCollapse d-flex justify-content-between">
						<a class="nav-item navbar-brand" href="/chat">Chat</a>
					</div>
					<div class="btn-group">
						<button class="btn" type="button">Lang</button>
						<button type="button" class="btn dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
							<span class="visually-hidden">Toggle Dropdown</span>
						</button>
						<ul class="dropdown-menu">
							...
						</ul>
					<a class="mx-2 navbar-brand nav-item" href="/profile">Profile</a>
					</div>
        		</div>
			</div>
		</nav>`
	}
}
