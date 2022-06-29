function clickThisLeague(league) {
    document.getElementById('NBA').className = (league == 'NBA') ? 'active' : '';
    document.getElementById('NFL').className = (league == 'NFL') ? 'active' : '';
    document.getElementById('Bundesliga').className = (league == 'Bundesliga') ? 'active' : '';
    document.getElementById('Premier League').className = (league == 'Premier League') ? 'active' : '';
    renderPage(league);
}

function clickThisTeam(i, league) {
    document.getElementById(nbaTeams[i]['full_name']).classList.toggle('chosen');
    if (!chosenTeams[league].has(i)) { // add a game to displaySet
        chosenTeams[league].add(i);
    }
    else if (chosenTeams[league].has(i)) { // remove a game from displaySet
        chosenTeams[league].delete(i);
    }
    getLastGame(i + 1);
}

function renderPage(league) {
    if (league == 'NBA') {
        fetch('https://www.balldontlie.io/api/v1/teams')
        .then(res => res.json())
        .then((data) => {
            nbaTeams = data.data;
            let teams = document.getElementById('teams');
            teams.innerHTML = '';
            for (let i = 0; i < nbaTeams.length; i++) {
                teams.innerHTML += `<div id="${nbaTeams[i]['full_name']}" class="team-card" onclick="clickThisTeam(${i}, '${league}')">${nbaTeams[i]['full_name']}</div>`;
            }
        });
    }
    else if (league == 'NFL') {

    }
    else if (league == 'Bundesliga') {
        
    }
    else if (league == 'Premier League') {
        
    }
}

function getLastGame(teamId) { // get last game of the team and update displaySet
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
            displaySet.has(JSON.stringify(latestGame)) ? displaySet.delete(JSON.stringify(latestGame)) : displaySet.add(JSON.stringify(latestGame));
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
                displaySet.has(JSON.stringify(latestGame)) ? displaySet.delete(JSON.stringify(latestGame)) : displaySet.add(JSON.stringify(latestGame));
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
        let team1Name = document.createElement('div');
        let team1Score = document.createElement('div');
        let team2 = document.createElement('div');
        let team2Name = document.createElement('div');
        let team2Score = document.createElement('div');

        game.className = 'game';
        team1.className = 'game-team';
        team1Name.className = 'team-name';
        team1Score.className = 'team-score';
        team2.className = 'game-team';
        team2Name.className = 'team-name';
        team2Score.className = 'team-score';

        team1Name.innerHTML = `${newGame['home_team']['name']}`;
        team1Score.innerHTML = `${newGame['home_team_score']}`;
        team2Name.innerHTML = `${newGame['visitor_team']['name']}`;
        team2Score.innerHTML = `${newGame['visitor_team_score']}`;

        if (i % 4 == 0) {
            let newRow = document.createElement('div');
            newRow.className = 'row';
            newRow.id = `row${i / 4}`;
            games.appendChild(newRow);
        }

        document.getElementById(`row${Math.floor(i / 4)}`).appendChild(game);
        game.appendChild(team1);
        game.appendChild(team2);
        team1.appendChild(team1Name);
        team1.appendChild(team1Score);
        team2.appendChild(team2Name);
        team2.appendChild(team2Score);
    }
}

let nbaTeams; // array
let nflTeams; // array
let BundesligaTeams; // array
let PremierLeagueTeams; // array
let chosenTeams = {}; // store indices in array
let displaySet = new Set(); // store games to display

chosenTeams['NBA'] = new Set();
chosenTeams['NFL'] = new Set();
chosenTeams['Bundesliga'] = new Set();
chosenTeams['Premier League'] = new Set();
renderPage('NBA'); // entry point: NBA