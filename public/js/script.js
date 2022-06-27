function clickOn(league) {
    document.getElementById('NBA').className = (league == 'NBA') ? 'active' : '';
    document.getElementById('NFL').className = (league == 'NFL') ? 'active' : '';
    document.getElementById('Bundesliga').className = (league == 'Bundesliga') ? 'active' : '';
    document.getElementById('Premier League').className = (league == 'Premier League') ? 'active' : '';
    renderPage(league);
}

function chooseThisTeam(i) {
    document.getElementById(nbaTeams[i]['full_name']).classList.toggle('chosen');
    chosenTeams.has(i) ? chosenTeams.delete(i) : chosenTeams.add(i);
}

function renderPage(league) {
    if (league == 'NBA') {
        fetch('https://www.balldontlie.io/api/v1/teams')
        .then(res => res.json())
        .then((data) => {
            nbaTeams = data.data;
            console.log(nbaTeams);
            let teams = document.getElementById('teams');
            teams.innerHTML = '';
            for (let i = 0; i < nbaTeams.length; i++) {
                teams.innerHTML += `<div id="${nbaTeams[i]['full_name']}" class="team-card" onclick="chooseThisTeam(${i})">${nbaTeams[i]['full_name']}</div>`;
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

let nbaTeams;
let nflTeams;
let BundesligaTeams;
let PremierLeagueTeams;
const chosenTeams = new Set();

renderPage('NBA');