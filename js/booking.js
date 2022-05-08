/*global Strikers _config*/

var Strikers = window.Strikers || {};

(function rideScopeWrapper($) {
    var authToken;
    Strikers.authToken.then(function setAuthToken(token) {
        if (token) {
            authToken = token;
        } else {
            window.location.href = '/login.html';
        }
    }).catch(function handleTokenError(error) {
        alert(error);
        window.location.href = '/login.html';
    });
    function requestHotel(request) {
        $.ajax({
            method: 'POST',
            url: _config.api.invokeUrl + '/booking',
            headers: {
                Authorization: authToken
            },
            data: JSON.stringify({
                    hotelId: request.hotelId,
                    checkin_date: request.checkin_date,
                    checkout_date: request.checkout_date,
                    options: request.options,
            }),
            contentType: 'application/json',
            success: completeRequest,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occured when requesting your unicorn:\n' + jqXHR.responseText);
            }
        });
    }

    function completeRequest(result) {
        var hotel;
        console.log('Response received from API: ', result);
        hotel = result.Hotel;
        displayUpdate("hotel booked detail: " + JSON.stringify(hotel));
    }

    function handleRequestClick(request) {
        var hotelId = $("#hotelstable tr.selected td:first").find("img").attr("alt");
        var checkin_date = $('#checkin_date').text();
        var checkout_date = $('#checkout_date').text();
        request.preventDefault();

        req_hotel = JSON.stringify({
            hotelId: hotelId,
            checkin_date: checkin_date,
            checkout_date: checkout_date
        })
        console.log(req_hotel);

        requestHotel(req_hotel);
    }

    // Register click handler for #request button
    $(function onDocReady() {
        $('#request').click(handleRequestClick);

        Strikers.authToken.then(function updateAuthMessage(token) {
            if (token) {
                $('.authToken').text(token);
            }
        });

        if (!_config.api.invokeUrl) {
            $('#noApiMessage').show();
        }
    });

    function displayUpdate(text) {
        $('#updates').append($('<li>' + text + '</li>'));
    }
}(jQuery));
