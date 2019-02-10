window.onload = function() {
    fetch('https://api.songkick.com/api/3.0/events.json?apikey=V24zeBmnMf3f26iq&location=geo:53.9,27.5667')
        .then(res => res.json())
        .then(res => {
            parseResults(res.resultsPage.results.event);
            checkedNotification(res.resultsPage.results.event);
        })
        .catch(err => console.log(err));
};

function parseResults(data) {
    let section = document.querySelector('#main');
    section.innerHTML = data.map(item => {
        return `
                <div class="tab">
                    <input type="checkbox" id="${item.id}" name="tabs">
                    <label for="${item.id}">${item.displayName}</label>
                    <div class="tab-content">
                        <div class="information">
                            <div class="place">
                                <div>Place: ${item.venue.displayName || 'Place is unknown'}</div>
                                <div>City: ${item.venue.metroArea.displayName || 'Minsk'}</div>
                                <div>Country: ${item.venue.metroArea.country.displayName || 'Belarus'}</div>
                            </div>

                            <div class="events_date">
                                <div>Date: ${item.start.date}</div>
                                <div>Time: ${item.start.time || 'Time will known soon'}</div>
                            </div>
                        </div>

                        <div class="artists">
                            <div class="artists_list_title">Artists</div>
                            ${getAllArtists(item.performance)}
                        </div>

                        <div class="notification_btn_container">
                            <div>Send notification</div>
                            <button id="button-${item.id}" class="notificating_button red"><img class="not_btn_img" src="images/bell.svg"/> </button>
                        </div>
                    </div>
                </div>
            `
    }).join('');

    let arr = data.map(item => item.id);
    document.querySelectorAll('.notificating_button').forEach((item, i) => {
        item.addEventListener('click', function() {
            writeToLocalStorage(arr[i]);
        });
    });
}

function writeToLocalStorage(id) {
    (localStorage.getItem(id) === id.toString()) ? localStorage.removeItem(id) : localStorage.setItem(id, id);
    changeButtonColor(this.document.querySelector(`#button-${id}`));
}

function getAllArtists(data) {
    return data.map(item => {
        return `<div class="artist">${item.displayName}</div>`
    }).join('');
}

function checkedButtonColor(data) {
    data.forEach(item => {
        let elem = this.document.querySelector(`#button-${item}`);
        changeButtonColor(elem);
    });
}

function changeButtonColor(elem) {
    if (elem.classList.contains('red')) {
        elem.classList.remove('red');
        elem.classList.add('green');
    } else if (elem.classList.contains('green')) {
        elem.classList.remove('green');
        elem.classList.add('red');
    }
}