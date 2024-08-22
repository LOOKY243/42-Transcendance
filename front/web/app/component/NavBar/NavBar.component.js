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
			<div class="container-fluid">
				<a class="navbar-brand me-4" href="/">
					<img class="nav-img" src="app/assets/img/homeIcon.png" alt="HomeIcon" width="48" height="48">
				</a>
        		<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
					aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            		<span class="navbar-toggler-icon"></span>
        		</button>
        		<div class="collapse navbar-collapse" id="navbarNavDropdown">
					<div class="navbarCollapse d-flex justify-content-between">
						<a href="/chat">
							<img class="nav-img" src="app/assets/img/chatIcon.png" alt="chatIcon" width="48" height="48">
						</a>
					</div>
					<div class="btn-group">
						<button class="btn btn-sm" type="button">Lang</button>
						<button type="button" class="btn btn-sm dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
							<span class="visually-hidden">Toggle Dropdown</span>
						</button>
						<ul class="dropdown-menu">
							...
						</ul>
					<a class="me-2" href="/profile">
						<img class="nav-img" src="app/assets/img/profileIcon.png" alt="profileIcon" width="48" height="48">
					</a>
					</div>
        		</div>
			</div>`
	}
}
