/* 
  Tell us about your project below!👇

- Which API did you use? Why did you choose that one?
I used two APIS:
  1-QR Code: Create an easy to read QR code and URL shortener https://goqr.me/api/
  2-Nominatim:Provides worldwide forward / reverse geocoding, https://nominatim.org/release-docs/develop/api/Overview/
I've been intrested in how QR codes work or on how they are made(I still have some questions). There have also been a few times where I wanted to make one but most of them came at a cost or I only had a limited number of free qr codes. This website will let users create unlimited codes!

  - How did you interact with the API, technically?
  For the QR Code api, I sent a GET request with user input and the formatting for the request varied depending on what the user wanted to encode in the QR code. The API would then return a repsonse containing a source link to the qr code as a PNG. I then created an IMG element making the source link the api's response and appended it to the result section of the site. The QR Code api's parameters to create a location qr code are latitude and longitude coordinates, which I thought are not convenient for the user to have to figure out the coodrinates to make the QR Code. So I formatted the user input to be something more familiar (the traditional address,city,state,zip). Then, I utilized the Nominatim API where one of its features is that you can make a GET request and send it the parameters for the address, and it will return plenty of information about that location(the coordinates included). I then made those coordinates the request and the procress after is the same as the others.
  
  - What does your project do/how does it work?
  First the user should decide what they want to encode: URL link, Text, Event, Wifi login info, or location. Then the user simply fills out the form with the necessary info, and them click submit! The result should be a QRcode that can be saved and ready to use!
  
  - If you were going to keep coding this project, what would you build next?
  I would like to implement the reader portion of the QR Code api, and if the qr code has a URL, I would like for it to check if the website link can be trusted for user safety! I also wanted to be able to show users some data on their codes e.g. how many scans have they gotten.(the api does provide a server for management but it is not free)
*/
// there is probably a more efficient way for this..
function showURLTab() {
  document.getElementById('home').style.display = "none";
  document.getElementById("form-url").style.display = "contents";
  document.getElementById('form-text').style.display = "none";
  document.getElementById('form-event').style.display = "none";
  document.getElementById('form-wifi').style.display = "none";
  document.getElementById('form-location').style.display = "none";
}

function showTextTab() {
  document.getElementById('home').style.display = "none";
  document.getElementById("form-text").style.display = "contents";
  document.getElementById('form-url').style.display = "none";
  document.getElementById('form-event').style.display = "none";
  document.getElementById('form-wifi').style.display = "none";
  document.getElementById('form-location').style.display = "none";
}

function showEventTab() {
  document.getElementById('home').style.display = "none";
  document.getElementById("form-event").style.display = "contents";
  document.getElementById('form-text').style.display = "none";
  document.getElementById('form-url').style.display = "none";
  document.getElementById('form-wifi').style.display = "none";
  document.getElementById('form-location').style.display = "none";
}

function showWifiTab() {
  document.getElementById('home').style.display = "none";
  document.getElementById("form-wifi").style.display = "contents";
  document.getElementById('form-text').style.display = "none";
  document.getElementById('form-url').style.display = "none";
  document.getElementById('form-event').style.display = "none";
  document.getElementById('form-location').style.display = "none";
}

function showLocationTab() {
  document.getElementById('home').style.display = "none";
  document.getElementById("form-location").style.display = "contents";
  document.getElementById('form-text').style.display = "none";
  document.getElementById('form-url').style.display = "none";
  document.getElementById('form-event').style.display = "none";
  document.getElementById('form-wifi').style.display = "none";
}

//constructs the request form for URL Type
function showUrlCode() {
  let form = document.getElementById("url-form").value;
  console.log(`form: ${form}`);
  if (isInputempty(form)) {
    return;
  }

  generateQrCode(form);
}

// constructs the request form for TEXT Type
function showTextCode() {
  let form = document.getElementById('text-form').value;
  if (isInputempty(form)) {
    return;
  }

  generateQrCode(form);
}

//converts it to UTC so it fits API requiremnets.
//constructs the request form for EVENT type
//formatted the request to URL Encoding
function showEventCode() {
  let summary = document.getElementById('event-summary').value;
  let startevent = document.getElementById('start-event').value;
  let endevent = document.getElementById('end-event').value;
  let timezone = document.getElementById('event-timezone').value;
  if (isInputempty(summary) || isInputempty(startevent) || isInputempty(endevent) || isInputempty(timezone)) {
    return;
  }

  // Parse timezone offset and adjust start and end times, should return in UTC TZ
  let tz = parseInt(timezone);
  var dateFrom = moment(startevent, "YYYY-MM-DDTHH:mm").utc().add(tz, 'm');
  var dateTo = moment(endevent, "YYYY-MM-DDTHH:mm").utc().add(tz, 'm');

   if(dateTo.isBefore(dateFrom)){
    let msg = document.createElement('p');
    msg.innerText = 'Cannot generate qr code because your event is ending before it starts!';
    let result = document.getElementById('qrcode-result');
    result.replaceChildren(msg);

    return;
  }


  // Format dates for VEVENT string
  var dateFromString = dateFrom.format('YYYYMMDDTHHmmss\\Z').replace(/(:|-)/g, '');
  var dateToString = dateTo.format('YYYYMMDDTHHmmss\\Z').replace(/(:|-)/g, '');

  //event form
  let form = "BEGIN:VEVENT\nSUMMARY:" + summary + "\n";
  form += "DTSTART:" + dateFromString + "\n";
  form += "DTEND:" + dateToString + "\n";
  form += "END:VEVENT";

  //url enconding
  form = form.replace(/:/g, '%3A');
  form = form.replace(/\n/g, "%0A");
  form = form.replace(/ /g, "+");

  generateQrCode(form);
}


//constructs the form for WIFI Type
function showWifiCode() {
  let type = document.querySelector('input[name="wifi-type"]:checked').value;
  let wifiname = document.getElementById('wifi-name').value;
  let password = document.getElementById('wifi-password').value;
  if (isInputempty(wifiname)) {
    return;
  }

  let form = `WIFI:T:${type};S:${wifiname};P:${password};`

  generateQrCode(form);
}


//constructs a query using the user input and sends a request to get latitude and longitude coordinates for the QR Code api
function convertAddressToCoord() {
  let address = document.getElementById('input-Address').value;
  let city = document.getElementById('input-City').value;
  let state = document.getElementById('input-State').value;
  let zip = document.getElementById('input-Zip').value;
  if (isInputempty(address) || isInputempty(city) || isInputempty(state) || isInputempty(zip)) {
    return;
  }
  //country is set to US by default
  let query = `${address},${city},${state},${zip},US`;

  axios.get(`https://nominatim.openstreetmap.org/search?q=
${query}&format=json`).then(response => {
    console.log(response);
    let lat = response.data[0].lat;
    console.log("lat = " + lat);
    let lon = response.data[0].lon
    console.log("lon = " + lon);
    let form = `geo:${lat},${lon}`;
    generateQrCode(form);
  });
}

//
function generateQrCode(form) {
  console.log("generating qr code..");

  axios.get(`https://api.qrserver.com/v1/create-qr-code/?data=${form}&download=1`).then(response => {
    console.log(response.request.responseURL);
    let qrcode = document.createElement('img');
    qrcode.id = 'qr-code'
    qrcode.src = response.request.responseURL;
    let result = document.getElementById('qrcode-result');
    result.replaceChildren(qrcode);
  });

  document.getElementById("download-button").removeAttribute("disabled");

}

function isInputempty(input) {
  if (input == '') {
    let msg = document.createElement('p');
    msg.innerText = 'Cannot generate form because of some empty slots! Please fill out the form in its entirety.';
    let result = document.getElementById('qrcode-result');
    result.replaceChildren(msg);
    console.log('its empty');
    return true;
  }
}

function downloadQR() {
  var imageSrc = document.getElementById('qr-code').src;
  window.location.href = imageSrc;

}

//shows instructions when the user first loads the page
document.getElementById("home").style.display = "contents";
document.getElementById('form-url').style.display = "none";
document.getElementById('form-text').style.display = "none";
document.getElementById('form-event').style.display = "none";
document.getElementById('form-wifi').style.display = "none";
document.getElementById('form-location').style.display = "none";


