import { injector } from "../../../spa/Bootstrap.js";
import { AComponent } from "../../../spa/component/AComponent.js";
import { Router } from "../../../spa/Router.js";
import { TournamentService } from "../../service/Tournament.service.js";
import { UserService } from "../../service/User.service.js";
import { MatchesListComponent } from "../MatchesList/MatchesList.component.js";
import { NavBarComponent } from "../NavBar/NavBar.component.js";

export class TournamentMatchComponent extends AComponent {
	renderMatches = injector[TournamentService].renderMatches
	renderMatchesSubscription = null;

	onInit() {
		if (!injector[UserService].user) {
			injector[Router].navigate('/auth');
			return false;
		}
		super.onInit();

        this.createSubComponent(new NavBarComponent(this.getSelector(), 'navbar'));
		console.log('test in tournament match', injector[TournamentService].matchesList,);
		this.renderMatchesSubscription = this.renderMatches.subscribe(() => {
        	this.createSubComponent(new MatchesListComponent(this.getSelector(), "matchesList"));
		});

		this.setConfig({
			playingTitle: this.translate('tournament.playingTitle'),
			renderMatches: this.renderMatches,
		});

		injector[TournamentService].getState();

		return true;
	}

	destroy() {
		super.destroy();
		if (this.renderMatchesSubscription) {
			this.renderMatches.unsubscribe(this.renderMatchesSubscription);
		}
	}

	getCSSPath() {
        return "app/component/TournamentMatch/TournamentMatch.component.css";
    }

	generateHtml(config) {
		this.html = `
			<div id='navbar'></div>
			<div class='container'>
				<div class='containerBlur'>
					<div class='fs-2 m-3 fw-bold text-center text-light tournamentMatchTitle'>${config.playingTitle}</div>
                    <div id='matchesList'></div>
				</div>
			</div>
		`;
	}
}