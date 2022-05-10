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

var hotels;

function findHotel(id) {
    for (var i = 0; i < hotels.length; i++) {
        if (hotels[i].hasOwnProperty('hotelId')) {
            if (hotels[i]['hotelId'] == id) {
                return hotels[i];
            }
        }
    }
}

/**
 * use this function for search hotel and return a list of result
 * @param {*} location , e.g. "San Jose"
 * @param {*} date_checkin e.g. "2022-06-10"
 * @param {*} date_checkout e.g. same above
 */
async function searchHotelbyLocation(location, date_checkin, date_checkout, roomcount) {
    await getDestinationId(location);
    var locationId = getCookie('locationId');
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://priceline-com-provider.p.rapidapi.com/v1/hotels/search?sort_order=HDR&date_checkout=" + date_checkout + "&location_id=" + locationId + "&date_checkin=" + date_checkin + "&star_rating_ids=3.0%2C3.5%2C4.0%2C4.5%2C5.0&rooms_number=" + roomcount + "&amenities_ids=FINTRNT%2CFBRKFST",
        "method": "GET",
        "headers": {
            "X-RapidAPI-Host": "priceline-com-provider.p.rapidapi.com",
            "X-RapidAPI-Key": "090c3ad7f6msh6ce66f807891299p16d0c7jsn79a1d5e184cf"
        }
    };
    $.ajax(settings).done(function (response) {
        console.log(response);
        hotels = response.hotels;
        showHotels(hotels); // show the list of hotel declared in html page
    }).fail(function (data) {
        console.log("Request failed: " + data['responseText']);
        showError(data['reponseText']);
    })
}

function showError(error) {
    $('#hotellist').empty();
    $('#hotellist').append("<p>Request information not available for " +
        $('#input_roomcount').val() + " room, " +
        "checkin on " + $('#input_checkindate').val() + " and " +
        "checkout on " + $('#input_checkoutdate').val() +
        " in " + $('#input_city').val() + " : ");
}

function showHotels(results) {
    $('#hotellist').empty();
    $('#hotellist').append("<p>Hotels available for " +
        $('#input_roomcount').val() + " room, " +
        "checkin on " + $('#input_checkindate').val() + " and " +
        "checkout on " + $('#input_checkoutdate').val() +
        " in " + $('#input_city').val() + " : ");
    $('#hotellist').append("<table id='hotelstable'>");
    results.forEach(function (el) {
        if (el.hasOwnProperty('hotelId') && el.hasOwnProperty('location')) {
            $('#hotelstable').append("<tr><td><img alt='" + el.hotelId + "' src='" + el.thumbnailUrl + "'>" +
                "<td>" +
                "<p>" + el.name + " (" + el.starRating + "⭐ Hotel)</p>" +
                "<p>Address: " + Object.values(el.location.address).toString().replaceAll(",", ", ") + "</p>" +
                "<p>&nbsp;</p>" +
                "<p>Amenities: " + Object.values(el.hotelFeatures.hotelAmenityCodes).toString().replaceAll(",", ", ") + "</p>" +
                "<p>&nbsp;</p>" +
                "<p>Overall Guest Rating: " + el.overallGuestRating + " / " + el.totalReviewCount + " Reviews</p>" +
                "</td>" +
                "<td>" + el.ratesSummary.minCurrencyCode + " " + el.ratesSummary.minPrice + "</td>" +
                "<td><button type=\"button\" onclick=\"callBookingHotelAPI(" + el.hotelId + ")\">Book this</button></td>" +
                "</tr>");
        }
    });
    $('#hotellist').append("</table");

    $("#hotelstable tr").click(function () {
        $(this).addClass('selected').siblings().removeClass('selected');
    });
}


function showReservations(results) {
    $('#BookingReservation').empty();
    $('#BookingReservation').append("<table id='BookingReservationtable'>");
    results.forEach(function (el) {
        $('#BookingReservationtable').append("<tr><td><img alt='" + el.bookingId + "' src='" + el.hotel.thumbnailUrl + "'>" +
            "<td>" +
            "<p>" + el.hotel.name + " (" + el.hotel.starRating + "⭐ Hotel)</p>" +
            "<p>Address: " + Object.values(el.hotel.location.address).toString().replaceAll(",", ", ") + "</p>" +
            "<p>&nbsp;</p>" +
            "<p>Amenities: " + Object.values(el.hotel.hotelFeatures.hotelAmenityCodes).toString().replaceAll(",", ", ") + "</p>" +
            "<p>&nbsp;</p>" +
            "<p>Overall Guest Rating: " + el.hotel.overallGuestRating + " / " + el.hotel.totalReviewCount + " Reviews</p>" +
            "</td>" +
            "<td>" + el.hotel.ratesSummary.minCurrencyCode + " " + el.hotel.ratesSummary.minPrice + "</td>" +
            "<td><button type=\"button\" onclick=\"callCancelHotelAPI(" + el.bookingId + ")\">Cancel this Booking</button></td>" +
            "</tr>"); 
    });
    $('#BookingReservation').append("</table");

    $("#BookingReservationtable tr").click(function () {
        $(this).addClass('selected').siblings().removeClass('selected');
    });

}
