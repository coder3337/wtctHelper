module.exports = {
  sendNewBookingsToOperators: function(docs, z) {
    // console.log(docs[z].firstName);
    const nodemailer = require('nodemailer');

    // switch booking to address based on operator
    let mailAddyInUse = '';
    if (docs[z].operatorName === 'AS') {
      mailAddyInUse = process.env['NODEMAILER_AS_' + envString];
    } else if (docs[z].operatorName === 'AV') {
      mailAddyInUse = process.env['NODEMAILER_AV_' + envString];
    } else if (docs[z].operatorName === 'GC') {
      mailAddyInUse = process.env['NODEMAILER_GC_' + envString];
    }
    // console.log(mailAddyInUse);

    // start a mail connection pool before for loop to reduce overhead
    const transporter = nodemailer.createTransport({
      host: process.env.NODEMAILER_SERVICE,

      // port: 587,
      secure: true, // upgrade later with STARTTLS
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
      subject: 'WTCT Confirmed Booking ' + docs[z].tourDate + '',
      html: '<p>Date: ' + docs[z].tourDate + '</p><p>Tour Type: ' + docs[z].tourType + ' </p><p>Pickup: ' + docs[z].pickupAddress + '<br>Name: ' + docs[z].firstName + ' ' + docs[z].lastName + '<br>Number: ' + docs[z].phone + '<br>Pax: ' + docs[z].pax + '</p><p>Paid Status: ' + docs[z].paidStatus + '</p><p>Notes: ' + docs[z].notes + '</p>',

      text: 'Date: ' + docs[z].tourDate + '\r\n\r\nTour Type: ' + docs[z].tourType + '\r\n\nPick up: ' + docs[z].pickupAddress + '\r\n\nName: ' + docs[z].firstName + ' ' + docs[z].lastName + '\r\n\nNumber: ' + docs[z].phone + '\r\n\nPax: ' + docs[z].pax + '\r\n\r\nPaid Status: ' + docs[z].paidStatus + '\r\n\r\nNotes: ' + docs[z].notes + '',

    };

    transporter.sendMail(mailOptions, docs, z, function(error, info) {
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
        fs.appendFile('logs/logs.txt', 'LOG New Booking sent to ' + docs[z].customerEmail + ' ' + resInfo + msgID + '\r\n',
            function(err) {
              if (err) throw err;
              console.log('New Booking Sent and Logged!');
            });
        transporter.close();
      }
    });
    // //// END MAILER HERE
  },
};
