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
            // JSON.stringify() is used to prevent duplicate "latestGame" from being added to displaySet
            // JSON.parse() is the reverse of JSON.stringify()
            displaySet.has(JSON.stringify(latestGame)) ? displaySet.delete(JSON.stringify(latestGame)) : displaySet.add(JSON.stringify(latestGame));
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
            });
        }
    });
}

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
            teams.innerHTML += '<br>';
        });
    }
    else if (league == 'NFL') {

    }
    else if (league == 'Bundesliga') {
        
    }
    else if (league == 'Premier League') {
        
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