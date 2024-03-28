# gen-QR
> QR Code generator

A simple website that takes in user input and creates a QR Code as a .png file.

# APIs & Libraries
1. APIs
    - [**QR Code**](https://goqr.me/api/doc/):   For the QR Code api, I sent a GET request with user input and the formatting for the request varied depending on what the user wanted to encode in the QR code.
    - [**Nominatim**](https://nominatim.org/release-docs/develop/api/Overview/):    The QR Code api's parameters to create a location qr code are latitude and longitude coordinates, which I thought are not convenient for the user to have to figure out the coodrinates to make the QR Code. So I formatted the user input to be something more familiar (the traditional address,city,state,zip). Then, I utilized the Nominatim API where one of its features is that you can make a GET request and send it the parameters for the address, and it will return plenty of information about that location(the coordinates included). 
2. Libraries
    - [**moment.js**](https://momentjs.com/docs/#/use-it/) & [**moment-timezone.js**](https://momentjs.com/timezone/docs/#/using-timezones/):    I utilized the moment.js library to help convert the user input for times in a UTC timezone, as that was the reqired formatting for the QR Code api. As well a ensuring that the user input for events was in the correct order.
    - [**Axios**](https://axios-http.com/docs/intro):    I utilized the axios library for sending GET requests from the browser. It can also handle response data.
# Usage Example
<div>URL usage:</div>
<img src="img/qrcode-URLtest.png">
<div>LOCATION usage:</div>
<img src="img/qrcode-GEOtest.png">
