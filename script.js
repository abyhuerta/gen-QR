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


