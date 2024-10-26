let groupedPlayers = [];

searchPlayer = () => {
    const query = document.getElementById('in-box').value || 'A'; // Default to 'A' if no input
    fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${query}`)
        .then((res) => res.json())
        .then(data => {
            if (data.player) {
                displayPlayers(data.player);
            } else {
                alert('No players found!');
            }
        })
        .catch(err => console.error(err));
}

displayPlayers = (players) => {
    const playerCards = document.getElementById('player-container');
    playerCards.innerHTML = ''; // Clear previous content
    players.forEach(player => {
        const card = `
        <div class="col-md-4">
            <div class="card">
                <img src="${player.strThumb}" alt="Player Image">
                <h3>${player.strPlayer}</h3>
                <p>Nationality: ${player.strNationality}</p>
                <p>Team: ${player.strTeam}</p>
                <p>Sport: ${player.strSport}</p>
                <p>Salary: ${player.strWage || 'N/A'}</p>
                <p>Description: ${player.strDescriptionEN ? player.strDescriptionEN.split(' ').slice(0, 10).join(' ') + '...' : 'N/A'}</p>
                <div>
                    <a href="https://twitter.com/${player.strTwitter || ''}" target="_blank"><i class="fa-brands fa-twitter p-3"></i></a>
                <a href="https://www.facebook.com/${player.strFacebook || ''}" target="_blank"><i class="fa-brands fa-facebook p-3"></i></a>
                </div>
                <button class="btn btn-info mt-2" onclick="showDetails(${player.idPlayer})">Details</button>
                <button class="btn btn-success mt-2" onclick="handleAddToCart('${player.strPlayer}')">Add to Group</button>
            </div>
        </div>`;
        playerCards.innerHTML += card;
    });
}

const handleAddToCart = (name) => {
    const cartCount = document.getElementById("count").innerText;

    let convertedCount = parseInt(cartCount);


    if (convertedCount >= 11) {
        alert('You cannot add more than 11 players.');
        return;
    }
    if (!groupedPlayers.includes(name)) {
        groupedPlayers.push(name);
        convertedCount += 1;
        document.getElementById("count").innerText = convertedCount

        const container = document.getElementById("card-main-container");
        // console.log(name)
        const div = document.createElement("div");
        //div.classList.add("cart-info");
        div.innerHTML = `
        <h5 class="price">${name}</h5>
        `;
        container.appendChild(div);
    }

    updatePrice();
}

const showDetails = (playerId) => {
    fetch(`https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${playerId}`)
        .then((res) => res.json())
        .then(data => {
            if (data.players) {
                const player = data.players[0]; // Assuming the player details are in an array

                // Populate modal with player details
                const modalBody = document.getElementById('modal-body-content');
                modalBody.innerHTML = `
                    <img src="${player.strThumb}" alt="Player Image" class="img-fluid mb-3">
                    <h3>${player.strPlayer}</h3>
                    <p><strong>Nationality:</strong> ${player.strNationality}</p>
                    <p><strong>Team:</strong> ${player.strTeam}</p>
                    <p><strong>Sport:</strong> ${player.strSport}</p>
                    <p><strong>Birthdate:</strong> ${player.dateBorn || 'N/A'}</p>
                    <p><strong>Height:</strong> ${player.strHeight || 'N/A'}</p>
                    <p><strong>Weight:</strong> ${player.strWeight || 'N/A'}</p>
                    <p><strong>Description:</strong> ${player.strDescriptionEN || 'N/A'}</p>
                `;

                // Show the modal
                const playerDetailsModal = new bootstrap.Modal(document.getElementById('playerDetailsModal'));
                playerDetailsModal.show();
            } else {
                alert('No details available for this player.');
            }
        })
        .catch(err => console.error(err));
};


window.onload = function () {
    searchPlayer();
};
