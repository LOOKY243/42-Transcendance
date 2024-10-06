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
    renderMatches = new Observable();
    matchesList = "";
    playerOne = "";
    playerTwo = "";
    points = "";
    ballSpeed = "";
    theme = "";
    
    constructor() {
		super();
        this.isTournament.next(false);
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
                this.isTournament.next(true);
                injector[Router].navigate('/tournament');
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
        injector[HttpClient].post('tournament/addUsers/', {
            usernames: usernameList
        }, true).then(response => {
            if (response.ok) {
                this.getState();
            } else {
                injector[PopService].renderPop(false, 'pop.tournamentListDanger');
            }
        }).catch(error => {
			if (error instanceof TokenError) {
				injector[TokenService].deleteCookie();
			}
		});
    }

    getState() {
        injector[HttpClient].get('tournament/state/', {}, true).then(response => {
            if (response.ok) {
                if (response.needPlayers) {
                    this.isStarted.next(false, true, true);
                    this.renderInput.next(true, true, true);
                }
                if (response.matches) {
                    this.matchesList = response.matches;
                    injector[Router].navigate('/tournament/match');
                    this.renderMatches.next(true, true, true)
                }
            } else {
                this.isTournament.next(false);
            }
        }).catch(error => {
            console.log(error)
			if (error instanceof TokenError) {
				injector[TokenService].deleteCookie();
			}
		});
    }

}