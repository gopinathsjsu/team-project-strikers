/** 
 * hotel api supplier 
 * for get and search a list of hotels from live database
 * 
*/

// variables
var hotels;
var options = {
    "FBRKFST": "Free Breakfast",
    "SPOOL": "Swimming Pool",
    "FITSPA": "Fitness Room",
    "FPRKING": "Free Parking",
    "ALLMEAL": "All meals included"
};

$('.input').ready(function () {
    Object.keys(options).forEach(function (k) {
        var checked = "checked";
        if (k == "ALLMEAL") checked = "";
        $('.input').append("<input type=\"checkbox\" id=\"" + k + "\" value=\"" + k + "\" " + checked + ">");
        $('.input').append("<label for=\"" + k + "\">" + options[k] + "</label>");
    })
});

//helper function to get hotel by hotelid from hotels variable
function findHotel(id) {
    for (var i = 0; i < hotels.length; i++) {
        if (hotels[i].hasOwnProperty('hotelId')) {
            if (hotels[i]['hotelId'] == id) {
                return hotels[i];
            }
        }
    }
}

function getOptions(hotel) {
    var someoptions = "";
    // var hotel = findHotel(hotelId);
    // console.log(hotel);
    for (var i = 0; i < hotel.hotelFeatures.hotelAmenityCodes.length; i++) {
        if (options.hasOwnProperty(hotel.hotelFeatures.hotelAmenityCodes[i])) {
            someoptions = someoptions + (options[hotel.hotelFeatures.hotelAmenityCodes[i]] + ", ");
        }
    }
    var res = someoptions.trim();

    console.log("options:", res.substring(0, res.length - 1));
    return res.substring(0, res.length - 1);
}

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

function getHotelDetail(hotelId) {
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://priceline-com-provider.p.rapidapi.com/v1/hotels/details?hotel_id=" + hotelId,
        "method": "GET",
        "headers": {
            "X-RapidAPI-Host": "priceline-com-provider.p.rapidapi.com",
            "X-RapidAPI-Key": "090c3ad7f6msh6ce66f807891299p16d0c7jsn79a1d5e184cf"
        }
    };

    $.ajax(settings).done(function (response) {
        console.log(response);

        var el = response;
        var hotelDetailWin = window.open();
        hotelDetailWin.document.write("<html><title>" + el.name + "</title>");
        hotelDetailWin.document.write("<link rel=\"stylesheet\" href=\"/style2.css\">");
        hotelDetailWin.document.write("<style>table, th, tr, td {   border-style: dotted; }</style>");
        hotelDetailWin.document.write("<body>");
        hotelDetailWin.document.write("<table border=1><td align=center><img src='" + el.thumbnailUrl + "'>" +
            "<td>" +
            "<p>" + el.name + " (" + el.starRating + "⭐ Hotel)</p>" +
            "<p>Address: <br>" + Object.values(el.location.address).toString().replaceAll(",", ", ") + "</p>" +
            "<p>Amenities: <br>" + Object.values(el.hotelFeatures.hotelAmenityCodes).toString().replaceAll(",", ", ") + "</p>" +
            "<p>Overall Guest Rating: " + el.overallGuestRating + " / " + el.totalReviewCount + " Reviews</p>" +
            "<td><h3>Policies : </h3></p>" +
            "<p>Check-In Time : " + el.policies.checkInTime + "</p>" +
            "<p>Check-Out Time : " + el.policies.checkOutTime + "</p>" +
            "<p>For Children : " + el.policies.childrenDescription + "</p>" +
            "<p>For Pet : " + el.policies.petDescription + "</p>" +
            "</td></tr></table>");
        hotelDetailWin.document.write("<fieldset><legend>Description</legend>" +
            "<p>" + el.description +
            "<p>Important : <br><font size=1>" + el.policies.importantInfo + "</font></p>" +
            "</fieldset>");
        hotelDetailWin.document.write("<fieldset><legend>Images</legend>");
        el.images.forEach(function (e) {
            hotelDetailWin.document.write("<a target=_blank href='" + e.imageHDUrl + "'><img src='" + e.imageUrl + "'></a> &nbsp;");
        });
        hotelDetailWin.document.write("</fieldset>");
        hotelDetailWin.document.write("</body></html>");
    });
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
            $('#hotelstable').append("<tr><td><img alt='Click for more detail' onClick='getHotelDetail(" + el.hotelId + ")' src='" + el.thumbnailUrl + "'>" +
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
                "</tr>");           //callBookingHotelAPI
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
        $('#BookingReservationtable').append("<tr><td><img alt='Click for more detail' onClick='getHotelDetail(" + el.hotel.hotelId + ")' src='" + el.hotel.thumbnailUrl + "'>" +
            "<td>" +
            "<p>" + el.hotel.name + " (" + el.hotel.starRating + "⭐ Hotel)</p>" +
            "<p>Address: " + Object.values(el.hotel.location.address).toString().replaceAll(",", ", ") + "</p>" +
            "<p>&nbsp;</p>" +
            "<p>Amenities: " + Object.values(el.hotel.hotelFeatures.hotelAmenityCodes).toString().replaceAll(",", ", ") + "</p>" +
            "<p>&nbsp;</p>" +
            "<p>Overall Guest Rating: " + el.hotel.overallGuestRating + " / " + el.hotel.totalReviewCount + " Reviews</p>" +
            "</td>" +
            "<td>Room Options : <br>" + el.options + "</td>" +
            "<td>" + el.hotel.ratesSummary.minCurrencyCode + " " + el.hotel.ratesSummary.minPrice + " per night</td>" +
            "<td>Stay : <br>" + el.checkin_date + " -> " + el.checkout_date + "</td>" +
            "<td><p>Booked on " + el.RequestTime.toString().split("T")[0] + "</p>" +
            "<p><button type=\"button\" onclick=\"callCancelHotelAPI('" + el.bookingId + "')\">Cancel this Booking</button></p></td>" +
            "</tr>");                           //callCancelHotelAPI
    });
    $('#BookingReservation').append("</table");

    $("#BookingReservationtable tr").click(function () {
        $(this).addClass('selected').siblings().removeClass('selected');
    });

}
