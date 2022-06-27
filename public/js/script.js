function renderPage(league) {
    if (league == 'NBA') {

    }
    else if (league == 'NFL') {

    }
    else if (league == 'Bundesliga') {
        
    }
    else if (league == 'Premier League') {
        
    }
}

function clickOn(league) {
    document.getElementById('NBA').className = (league == 'NBA') ? 'active' : '';
    document.getElementById('NFL').className = (league == 'NFL') ? 'active' : '';
    document.getElementById('Bundesliga').className = (league == 'Bundesliga') ? 'active' : '';
    document.getElementById('Premier League').className = (league == 'Premier League') ? 'active' : '';
    renderPage(league);
}

let nbaTeams;

fetch('https://www.balldontlie.io/api/v1/teams')
.then(res => res.json())
.then((data) => {
    nbaTeams = data.data;
    console.log(nbaTeams);
});

renderPage('NBA');