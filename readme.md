Title: WTCT Helper App
Description: A simple app to help with bookings
Author: Josh W
Date: 2023-01-31

# WTCT Helper App
A simple app to help with bookings

Go to debug tab
1. Launch program
2.Launch chrome for frontend

# sendmail.ini settings

[sendmail]
smtp_server=smtp.gmail.com
smtp_port=465
smtp_ssl=true
smtp_user=youremail@gmail.com
smtp_pass=yourpassword
from_address=youremail@gmail.com
from_name=Your Name


Alternative config in package.json using nodemon and browsersync

 "scripts": {
    "start": "node app.js",
    "debug": "set DEBUG=express:* & node ./bin/www",
    "dev": "nodemon -e * ./bin/www",
    "ui": "browser-sync start --proxy localhost:1500 --files=**/*  --ignore=node_modules --reload-delay 1000 --no-ui --no-notify --no-inject-changes"
  },