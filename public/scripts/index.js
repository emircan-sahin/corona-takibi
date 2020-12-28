const monthList = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

$(document).ready(function () {
    init();
});

const countries = { turkey: 'turkey' };


function init() {
    getCountryData(countries.turkey, function (data) {
        var prevDayItem = data[data.length - 2];
        var nowDayItem = data[data.length - 1];

        const countryData = {};

        countryData.total = {
            confirmed: nowDayItem.Confirmed,
            deaths: nowDayItem.Deaths,
            recovered: nowDayItem.Recovered
        }

        countryData.new = {
            confirmed: nowDayItem.Confirmed - prevDayItem.Confirmed,
            deaths: nowDayItem.Deaths - prevDayItem.Deaths,
            recovered: nowDayItem.Recovered - prevDayItem.Recovered
        }

        updateStaticStatus(nowDayItem.Date, countryData);
    });

    initListeners();
}

function updateStaticStatus(date, countryData) {
    const dt = new Date(date);

    const day = dt.getUTCDate();
    const month = monthList[dt.getMonth()];

    setText('#prevDate', `${day - 1} ${month}`);
    setText('#latestDate', `${day} ${month}`);

    setText('.TotalConfirmed', countryData.total.confirmed, true);
    setText('.TotalDeaths', countryData.total.deaths, true);
    setText('.TotalRecovered', countryData.total.recovered, true);

    setText('.NewConfirmed', countryData.new.confirmed, true);
    setText('.NewDeaths', countryData.new.deaths, true);
    setText('.NewRecovered', countryData.new.recovered, true);
}

function getCountryData(country, cb) {
    return $.get('https://api.covid19api.com/country/' + country, function (data) {
        return cb(data);
    });
}

function initElements(props) {
    const { countryData, day, month } = props;

    const { TotalConfirmed, TotalDeaths, TotalRecovered } = countryData;
    const { NewConfirmed, NewDeaths, NewRecovered } = countryData;

    // setText('#total-cases', `${TotalConfirmed.toString().slice(0, 3)}.${TotalConfirmed.toString().slice(-3)}`);

    setText('#prevDate', `GUNCEL ( ${day - 1} ${month} )`);
    setText('#latestDate', `GUNCEL ( ${day} ${month} )`);

    setText('.TotalConfirmed', TotalConfirmed, true);
    setText('.TotalDeaths', TotalDeaths, true);
    setText('.TotalRecovered', TotalRecovered, true);

    setText('.NewConfirmed', NewConfirmed, true);
    setText('.NewDeaths', NewDeaths, true);
    setText('.NewRecovered', NewRecovered, true);
}

function initListeners() {
    $('#prevDate').on('click', function (e) {
        getCountryData(countries.turkey, function (data) {
            var prevTwoDayItem = data[data.length - 3];
            var prevDayItem = data[data.length - 2];

            const countryData = {};

            countryData.new = {
                confirmed: prevDayItem.Confirmed - prevTwoDayItem.Confirmed,
                deaths: prevDayItem.Deaths - prevTwoDayItem.Deaths,
                recovered: prevDayItem.Recovered - prevTwoDayItem.Recovered
            }

            setText('.NewConfirmed', countryData.new.confirmed, true);
            setText('.NewDeaths', countryData.new.deaths, true);
            setText('.NewRecovered', countryData.new.recovered, true);

            $('.day-list button').removeClass('active');
            $('.day-list button#prevDate').addClass('active');
        });
    });

    $('#latestDate').on('click', function (e) {
        $('.day-list button').removeClass('active');
        $('.day-list button#latestDate').addClass('active');

        getCountryData(countries.turkey, function (data) {
            var prevDayItem = data[data.length - 2];
            var nowDayItem = data[data.length - 1];

            const countryData = {};

            countryData.new = {
                confirmed: nowDayItem.Confirmed - prevDayItem.Confirmed,
                deaths: nowDayItem.Deaths - prevDayItem.Deaths,
                recovered: nowDayItem.Recovered - prevDayItem.Recovered
            }

            setText('.NewConfirmed', countryData.new.confirmed, true);
            setText('.NewDeaths', countryData.new.deaths, true);
            setText('.NewRecovered', countryData.new.recovered, true);
        });
    });
}

function setText(el, text, digits = false) {
    text = text.toString();

    if (digits) {
        console.log(text + ' / ' + text.length);

        if (text.length === 4) {
            text = text.slice(0, 1) + '.' + text.slice(-3);
        }

        else if (text.length === 5) {
            text = text.slice(0, 2) + '.' + text.slice(-3);
        }

        else if (text.length === 6) {
            text = text.slice(0, 3) + '.' + text.slice(-3);
        }

        else if (text.length === 7) {
            text = text.slice(0, 1) + '.' + text.slice(1, 4) + '.' + text.slice(-3);
        }
    }

    $(el).text(text);
}

setTimeout(() => {
    $(window).ready(function () { // makes sure the whole site is loaded
        $('#status').fadeOut(); // will first fade out the loading animation
        $('#preloader').delay(50).fadeOut(100); // will fade out the white DIV that covers the website.
        $('body').delay(50).css({ 'overflow': 'visible' });
    });
}, 500);