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
        		<a class="navbar-brand" href="#">Transcendence</a>
        		<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
                	aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            		<span class="navbar-toggler-icon"></span>
       			</button>
        		<div class="collapse navbar-collapse" id="navbarNavDropdown">
          			<ul class="navbar-nav me-auto">
                		<li class="nav-item ">
                    		<a class="nav-link nav-text" aria-current="page" href="#">ft_pong</a>
                		</li>
                		<li class="nav-item">
                    		<a class="nav-link nav-text" href="#">Live chat</a>
                		</li>
            		</ul>
            		<button type="button" class="btn btn-outline-primary me-3">Sign in</button>
            		<button type="button" class="btn btn-outline-secondary">Register</button>
       		 	</div>
    		</div>`
	}
}

/*<nav class="navbar navbar-expand-lg bg-body-tertiary fixed-top">
			<div class="container-fluid">
       			<a class="navbar-brand" href="/">Home</a>
        		<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
					aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            		<span class="navbar-toggler-icon"></span>
        		</button>
        		<div class="collapse navbar-collapse" id="navbarNavDropdown">
            		<button type="button" class="btn btn-outline-primary me-3">profile</button>
        		</div>
			</div>
		</nav>`*/