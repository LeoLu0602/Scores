function clickThisTeam(i) {
    document.getElementById(nbaTeams[i]['full_name']).classList.toggle('chosen');
    if (!chosenTeams.has(i)) { // add a game to displaySet
        chosenTeams.add(i);
        getLastGame(i + 1, true); // true -> add
    }
    else if (chosenTeams.has(i)) { // remove a game from displaySet
        chosenTeams.delete(i);
        getLastGame(i + 1, false); // false -> remove
    }
}

function renderPage() {
    fetch('https://www.balldontlie.io/api/v1/teams')
    .then(res => res.json())
    .then((data) => {
        nbaTeams = data.data;
        let teams = document.getElementById('teams');
        teams.innerHTML = '';
        for (let i = 0; i < nbaTeams.length; i++) {
            teams.innerHTML += `<div id="${nbaTeams[i]['full_name']}" class="team-card" onclick="clickThisTeam(${i})">${nbaTeams[i]['full_name']}</div>`;
        }
        let defaultTeams = [1, 12, 13, 16];
        defaultTeams.forEach((i) => {
            clickThisTeam(i);
        });
    });
}

function getLastGame(teamId, add) { // get last game of the team and update displaySet
    fetch(`https://www.balldontlie.io/api/v1/games?seasons[]=2021&team_ids[]=${teamId}&per_page=100&page=1`)
    .then(res => res.json())
    .then((data) => {
        let gameList = [];
        let latestGameId = -1;
        let latestGame = {};
        gameList = gameList.concat(data.data);
        if (data.meta.total_pages == 1) {
            gameList.forEach((game) => {
                if (game['id'] > latestGameId) {
                    latestGameId = game['id'];
                    latestGame = game;
                }
            });
            /* 
            JSON.stringify() is used to prevent duplicate "latestGame" from being added to displaySet
            JSON.parse() is the reverse of JSON.stringify()
            */
            if (add) {
                if (displaySet.has(JSON.stringify(latestGame))) {
                    gameCount[latestGameId] += 1;
                } 
                else if (!displaySet.has(JSON.stringify(latestGame))) {
                    gameCount[latestGameId] = 1;
                    displaySet.add(JSON.stringify(latestGame));
                }
            }
            else if (!add) {
                gameCount[latestGameId] -= 1;
                if (gameCount[latestGameId] == 0) {
                    delete gameCount[latestGameId]
                    displaySet.delete(JSON.stringify(latestGame));
                }
            }
            displayGames();
        }
        else if (data.meta.total_pages == 2) {
            fetch(`https://www.balldontlie.io/api/v1/games?seasons[]=2021&team_ids[]=${teamId}&per_page=100&page=2`)
            .then(res => res.json())
            .then((data) => {
                gameList = gameList.concat(data.data);
                gameList.forEach((game) => {
                    if (game['id'] > latestGameId) {
                        latestGameId = game['id'];
                        latestGame = game;
                    }
                });
                if (add) {
                    if (displaySet.has(JSON.stringify(latestGame))) {
                        gameCount[latestGameId] += 1;
                    } 
                    else if (!displaySet.has(JSON.stringify(latestGame))) {
                        gameCount[latestGameId] = 1;
                        displaySet.add(JSON.stringify(latestGame));
                    }
                }
                else if (!add) {
                    gameCount[latestGameId] -= 1;
                    if (gameCount[latestGameId] == 0) {
                        delete gameCount[latestGameId]
                        displaySet.delete(JSON.stringify(latestGame));
                    }
                }
                displayGames();
            });
        }
    });
}

function displayGames() {
    let games = document.getElementById('games');
    games.innerHTML = '';
    let displayArray = Array.from(displaySet);
    for (let i = 0; i < displayArray.length; i++) {
        newGame = JSON.parse(displayArray[i]);

        let game = document.createElement('div');
        let team1 = document.createElement('div');
        let team1Logo = document.createElement('div');
        let team1Name = document.createElement('div');
        let team1Score = document.createElement('div');
        let team2 = document.createElement('div');
        let team2Logo = document.createElement('div');
        let team2Name = document.createElement('div');
        let team2Score = document.createElement('div');

        game.className = 'game';
        team1.className = 'game-team';
        team1Logo.className = 'team-logo';
        team1Name.className = 'team-name';
        team1Score.className = 'team-score';
        team2.className = 'game-team';
        team2Logo.className = 'team-logo';
        team2Name.className = 'team-name';
        team2Score.className = 'team-score';
        if (newGame['home_team_score'] > newGame['visitor_team_score']) {
            team1Name.classList.add('win');
            team1Score.classList.add('win');
        }
        else if (newGame['home_team_score'] < newGame['visitor_team_score']) {
            team2Name.classList.add('win');
            team2Score.classList.add('win');
        }

        team1Name.innerHTML = `${newGame['home_team']['name']}`;
        team1Score.innerHTML = `${newGame['home_team_score']}`;
        team2Name.innerHTML = `${newGame['visitor_team']['name']}`;
        team2Score.innerHTML = `${newGame['visitor_team_score']}`;
        team1Logo.style.backgroundImage = `url("/pic/NBA/${newGame['home_team']['name']}.png")`;
        team2Logo.style.backgroundImage = `url("/pic/NBA/${newGame['visitor_team']['name']}.png")`;

        if (i % 4 == 0) {
            let newRow = document.createElement('div');
            newRow.className = 'row';
            newRow.id = `row${i / 4}`;
            games.appendChild(newRow);
        }

        document.getElementById(`row${Math.floor(i / 4)}`).appendChild(game);
        game.appendChild(team1);
        game.appendChild(team2);
        team1.appendChild(team1Logo);
        team1.appendChild(team1Name);
        team1.appendChild(team1Score);
        team2.appendChild(team2Logo);
        team2.appendChild(team2Name);
        team2.appendChild(team2Score);
    }
}

let nbaTeams; // array
let chosenTeams = new Set(); // store indices in array
let displaySet = new Set(); // store games to display
let gameCount = {};
/*
gameCount is used to solve "remove teams bug"  
key: game id, val: number of teams having this game as the latest game
*/

renderPage(); // entry point: NBA