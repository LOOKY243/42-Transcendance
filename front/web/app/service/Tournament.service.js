import { injector } from "../../spa/Bootstrap.js";
import { TokenError } from "../../spa/error/TokenError.js";
import { Router } from "../../spa/Router.js";
import { AInjectable } from "../../spa/service/AInjectable.js";
import { HttpClient } from "../../spa/service/HttpClient.js";
import { TokenService } from "../../spa/service/Token.service.js";
import { Observable } from "../../spa/utils/Observable.js";
import { ReplayObservable } from "../../spa/utils/ReplayObservable.js";
import { PopService } from "./Pop.service.js";

export class TournamentService extends AInjectable {
    isTournament = new ReplayObservable();
    isStarted = new ReplayObservable();
    renderInput = new Observable();
    playerOne = "";
    playerTwo = "";
    points = "";
    ballSpeed = "";
    theme = "";
    
    constructor() {
		super();
        this.isTournament.next(null);
	}

    createTournament(playerOne, playerTwo, points, ballSpeed, theme) {
        this.playerOne = playerOne;
        this.playerTwo = playerTwo;
        injector[HttpClient].post('tournament/create/', {
            ballSpeed: ballSpeed,
            theme: theme,
            points: points,
        }, true).then(response => {
            if (response.ok) {
                this.isTournament.next(true),
                injector[Router].navigate('/tournament');
                this.renderInput.next(true);
            } else {
                injector[PopService].renderPop(false, "pop.startTournDanger");
            }
        }).catch(error => {
			if (error instanceof TokenError) {
				injector[TokenService].deleteCookie();
			}
		});
    }

    sendList(usernameList) {
        console.log(usernameList);
    }

}