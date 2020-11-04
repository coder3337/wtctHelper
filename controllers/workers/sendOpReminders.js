module.exports = {
  sendOperatorReminder: function(docs, z) {
    // (function (x) {
    // // INSERT MAILER SNIPPET HERE ////
    const nodemailer = require('nodemailer');

    // switch booking to address based on operator
    let mailAddyInUse = '';
    if (docs[z].operatorName === 'AS') {
      mailAddyInUse = process.env['NODEMAILER_AS_' + envString];
    } else if (docs[z].operatorName === 'AV') {
      mailAddyInUse = process.env['NODEMAILER_AV_' + envString];
    }

    // start a mail connection pool before for loop to reduce overhead
    const transporter = nodemailer.createTransport({
      host: process.env.NODEMAILER_SERVICE,
      // port: 587,
      // secure: true, // upgrade later with STARTTLS
      pool: true,
      maxConnections: 25,
      maxMessages: 50,
      // debug: true,
      // logger: true,
      connectionTimeout: 5000,
      rateDelta: 1000,
      rateLimit: 1,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    const mailOptions = {

      from: process.env.NODEMAILER_FROM,
        to: '' + mailAddyInUse + '',
      // cc: "" + opAddy + "",
      subject: 'WTCT Tour Operator Reminder for ' + docs[z].tourDate + '',
      html: '<p>Operators Reminder for Tour Tomorrow:</p><p>Date: ' + docs[z].tourDate + '</p><p>Pickup: ' + docs[z].pickupAddress + '<br>Name: ' + docs[z].firstName + ' ' + docs[z].lastName + '<br>Number: ' + docs[z].phone + '<br>Pax: ' + docs[z].pax + '</p><p>Paid Status: ' + docs[z].paidStatus + '</p><p>Notes: ' + docs[z].notes + '</p>',

      text: 'Date: ' + docs[z].tourDate + '\r\n\r\nPick up: ' + docs[z].pickupAddress + '\r\n\nName: ' + docs[z].firstName + ' ' + docs[z].lastName + '\r\n\nNumber: ' + docs[z].phone + '\r\n\nPax: ' + docs[z].pax + '\r\n\r\nPaid Status: ' + docs[z].paidStatus + '\r\n\r\nNotes: ' + docs[z].notes + '',

    };


    transporter.sendMail(mailOptions, function(error, info) {
      const resInfo = info.response;
      const msgID = info.messageId;
      // check for console errors
      if (error) {
        console.log(error);
        transporter.close();
        //
      } else {
        const fs = require('fs');
        // create log entry
          fs.appendFile('logs/logs.txt', 'OPGuide Reminder sent to  ' + mailAddyInUse + resInfo + msgID, function(err) {
          if (err) throw err;
          console.log('OPGuide Reminder Sent and Logged!');
        });
        transporter.close();
      }
    });
    // })(x);
  },
};
