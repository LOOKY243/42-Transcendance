<br>

### Modules

|    |           Category           | Module | Point |
| :-----: | :--------------------------: | :----- | :------ |
| `Major` | Web - Backend                          | [Use a Framework as backend] | 1 |
| `Minor` | Web - Frontend                          | [Use a front-end framework or toolkit] | 0.5 |
| `Minor` | Web - Backend                          | [Use a database for the backend] | 0.5 |
| `Major` | User management                          | [Standard user management, authentication, users across tournaments] | 1 |
| `Major` | User management                          | [Implementing a remote authentication] | 1 |
| `Major` | Gameplay                          | [Remote players] | 1 |
| `Major` | Gameplay                          | [Multiplayers] | 1 |
| `Major` | Gameplay                          | [Add Another Game with User History and Matchmaking] | 1 |
| `Major` | Gameplay                          | [Live chat] | 1 |
| `Minor` | Gameplay                         | [Game Customization Options] | 0.5 |
| `Minor` | Accessibility                         | [Support on all devices] | 0.5 |
| `Minor` | Accessibility                         | [Expanding Browser Compatibility] | 0.5 |
| `Minor` | Accessibility                         | [Multiple language supports] | 0.5 |
| `Major` | Graphics                         | [ Use of advanced 3D techniques] | 1 |
| | | | 11/9.5 |

<br>

## Pages

| Route | Usage | static | fonctional |
| :---: | :---: | :-----------: | :---: |
| / | home page | &#10060; | &#10060; |
| /[all] | navbar | &#9989; | &#9989; |
| /[notFound] | error 404 | &#9989; | &#9989; |
| /auth | sign in or register | &#9989; | &#10060; |
| /pong/new | create new game | &#10060; | &#10060; |
| /naval/new | create new game | &#10060; | &#10060; |
| /pong/gameId | the game | &#10060; | &#10060; |
| /naval/gameId | the game | &#10060; | &#10060; |
| /pongResult/gameId | game result | &#10060; | &#10060; |
| /navalResult/gameId | game result | &#10060; | &#10060; |

<br>

## SPA

| Features | status |
| :-------:| :----: |
| Router | &#10060; |
| Bootstrap | &#9989; |
| observable | &#9989; |
| docker | &#9989; |
| services | &#9989; |
| client http | &#9989; |
| templates | &#9989; |
| style(css) | &#9989; |
| composants | &#9989; |
| protection XSS | &#9989; |
| translate | &#9989; |
| query parameters | &#10060; |

<br>

Common error from console: <br>
`/front/errorLog.txt`

to start the front without nginx: <br>
`npm install http-server` <br>
`cd front/web` <br>
`npx http-server --spa -P http://localhost:8080?`

<br>

## API REQUEST

| route | parameters | response |
exemple :

/login -> {username, password} -> response from back (responde code + value)