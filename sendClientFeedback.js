module.exports = {
  sendFeedbackRequests: function(docs, z) {
    const dt = require('./public/dates.js');


    // // INSERT MAILER SNIPPET HERE ////
    const nodemailer = require('nodemailer');

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
      to: '' + docs[z].customerEmail + '',
      subject: 'Hi ' +
        docs[z].firstName + ', how was ' + dt.dayYesterday() + '\'s wine wine tour? 🍷',
      html: '<p>Hi ' + docs[z].firstName +
                ',</p> <p>Thanks again for using WineToursCapeTown.com, we hope you had a great day on ' + dt.dayYesterday() + '!</p><p><strong> Please leave us a quick star rating or short review on <a href="' + process.env.NODEMAILER_gReviewLink +
                '" target="_blank">Google</a> to let us know  how it went so that we can improve our service.</strong></p><p>We love your feedback and it is as important to us and our future clients.</p><p>Regards<br>Josh<br><a href="' + process.env.NODEMAILER_WTCTLINK + '" target="_blank">WineToursCapeTown.com</a></p>',
      text: 'Hi ' + docs[z].firstName + ',\r\n\r\nThanks again for using WineToursCapeTown.com, we hope you had a great day on ' +
            dt.dayYesterday() + '!\r\n\r\nPlease leave us a quick star rating or short review on Google to let us know  how it went so that we can improve our service.\r\n\r\n' + process.env.NODEMAILER_gReviewLink + '\r\n\r\nWe love your feedback and it is as important to us as and our future clients.\r\n\r\nKind Regards\r\n\nJosh\r\n\nWineToursCapeTown.com',
    };


    transporter.sendMail(mailOptions, function(error, info) {
      // check for console errors
      if (error) {
        console.log(error);
        transporter.close();
        //
      } else {
        const fs = require('fs');
        // create log entry
        fs.appendFile('logs/logs.txt', 'LOG Feeeback Request sent to ' + docs[z].customerEmail + ' ' + resInfo + msgID + '\r\n',
            function(err) {
              if (err) throw err;
              console.log('Reminder Sent and Logged!');
            });
        console.log('Customer feedback requests send: ' + info.response);
        transporter.close();
      }
    });
    // //// END MAILER HERE
  },
};
