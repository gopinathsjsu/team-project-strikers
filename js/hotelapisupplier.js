/** 
 * hotel api supplier 
 * for get and search a list of hotels from live database
 * 
*/

//helper function to get correct date format
function getDatefromTodayFormat(day) {
    var d = new Date();
    d.setDate(d.getDate() + day);
    return d.toISOString().split('T')[0];
}

//helper function to pass enviroment variable
function getCookie(cookieName) {
    let cookie = {};
    document.cookie.split(';').forEach(function (el) {
        let [key, value] = el.split('=');
        cookie[key.trim()] = value;
    })
    return cookie[cookieName];
}

// api function to get "locationId" by search location(e.g. "San Jose")
function getDestinationId(locations) {
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://priceline-com-provider.p.rapidapi.com/v1/hotels/locations?name=" + locations + "&search_type=ALL",
        "method": "GET",
        "headers": {
            "X-RapidAPI-Host": "priceline-com-provider.p.rapidapi.com",
            "X-RapidAPI-Key": "090c3ad7f6msh6ce66f807891299p16d0c7jsn79a1d5e184cf"
        }
    };
    $.ajax(settings).done(function (response) {
        console.log(response[0]);
        document.cookie = 'locationId=' + response[0].id;  //store the locationId to cookie for next function to retrieve
    });
}


/**
 * use this function for search hotel and return a list of result
 * @param {*} location , e.g. "San Jose"
 * @param {*} date_checkin e.g. "2022-06-10"
 * @param {*} date_checkout e.g. same above
 */
function searchHotelbyLocationId(location, date_checkin, date_checkout) {
    getDestinationId(location);
    var locationId = getCookie('locationId');
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://priceline-com-provider.p.rapidapi.com/v1/hotels/search?sort_order=HDR&date_checkout=" + date_checkout + "&location_id=" + locationId + "&date_checkin=" + date_checkin + "&star_rating_ids=3.0%2C3.5%2C4.0%2C4.5%2C5.0&rooms_number=1&amenities_ids=FINTRNT%2CFBRKFST",
        "method": "GET",
        "headers": {
            "X-RapidAPI-Host": "priceline-com-provider.p.rapidapi.com",
            "X-RapidAPI-Key": "090c3ad7f6msh6ce66f807891299p16d0c7jsn79a1d5e184cf"
        }
    };
    $.ajax(settings).done(function (response) {
        console.log(response);
        showHotels(response.hotels); // show the list of hotel declared in html page
    });
}

