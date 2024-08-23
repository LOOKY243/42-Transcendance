import { AComponent } from "../../../spa/component/AComponent.js"

export class BackgroundComponent extends AComponent {
    onInit() {
        super.onInit();
        this.generateHtml({});
    }
    
    getCSSPath() {
        return "app/component/Background/Background.component.css";
    }

    generateHtml(config) {
        this.html = `
        <video onloadstart="this.playbackRate = 0.75;" autoplay muted loop class="backgroundVideo">
        	<source src="app/assets/img/neonVideo2.mp4" type="video/mp4">
    	</video>
        `
    }
}
