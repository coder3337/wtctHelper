module.exports = {
  gcGuideSend: function(docs, z) {
    // // INSERT MAILER SNIPPET HERE ////
    const nodemailer = require('nodemailer');
    gcGuideEmail = docs[z].guidesEmail;
    console.log('GC guide addy', gcGuideEmail);
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
      to: '' + gcGuideEmail + '',
      cc: '' + process.env['NODEMAILER_GC_' + envString] + '',
      subject: 'WTCT Tour Guide Reminder for ' + docs[z].tourDate + '',
      html: '<p>Tour Guides Reminder for Tour Tomorrow:</p><p>Date: ' + docs[z].tourDate + '</p><p>Tour Type: ' + docs[z].tourType + ' </p><p>Pickup: ' + docs[z].pickupAddress + '<br>Name: ' + docs[z].firstName + ' ' + docs[z].lastName + '<br>Number: ' + docs[z].phone + '<br>Pax: ' + docs[z].pax + '</p><p>Paid Status: ' + docs[z].paidStatus + '</p><p>Notes: ' + docs[z].notes + '</p>',

      text: 'Date: ' + docs[z].tourDate + '\r\n\r\nTour Type: ' + docs[z].tourType + '\r\n\nPick up: ' + docs[z].pickupAddress + '\r\n\nName: ' + docs[z].firstName + ' ' + docs[z].lastName + '\r\n\nNumber: ' + docs[z].phone + '\r\n\nPax: ' + docs[z].pax + '\r\n\r\nPaid Status: ' + docs[z].paidStatus + '\r\n\r\nNotes: ' + docs[z].notes + '',

    };
    transporter.sendMail(mailOptions, function(error, info) {
      // check for console errors
      const resInfo = info.response;
      const msgID = info.messageId;
      if (error) {
        console.log(error);
        transporter.close();
        //
      } else {
        // create log entry
        const fs = require('fs');
        fs.appendFile('logs/logs.txt', 'GCGuide Reminder sent to  ' + gcGuideEmail + resInfo + msgID + '\r\n', function(err) {
          if (err) throw err;
          console.log('GCGuide Reminder Sent and Logged!');
        });
        transporter.close();
      }
    });
  },
};
