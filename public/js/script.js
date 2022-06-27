let nbaTeams;

fetch('https://www.balldontlie.io/api/v1/teams')
.then(res => res.json())
.then((data) => {
    nbaTeams = data.data;
    console.log(nbaTeams);
});