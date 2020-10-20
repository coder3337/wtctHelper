/* eslint-disable no-var */
module.exports = {
  sendRemindClient(docs, z) {
    const nodemailer = require('nodemailer');

    // require('dotenv').config();
    // console.log('name:', docs[z].firstName);
    let opPhone = '';
    if (docs[z].operatorName === 'AS') {
      opPhone = process.env.NODEMAILER_AS_PHONE;
    } else if (docs[z].operatorName === 'AV') {
      opPhone = process.env.NODEMAILER_AV_PHONE;
    } else if (docs[z].operatorName === 'GC') {
      opPhone = process.env.NODEMAILER_GC_PHONE;
    } else {
      console.log('no operator phone selected');
    };
    // console.log(opPhone);
    // console.log('First name', docs[z].firstName);

    // // INSERT MAILER SNIPPET HERE ////

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


    // //// working here
    if (docs[z].tourType === 'Chauffeur Drive') {
      // must use var not const
      // eslint-disable-next-line no-var
      var mailOptions = {
        from: process.env.NODEMAILER_FROM,
        to: '' + docs[z].customerEmail + '',
        subject: 'Reminder of your chauffeur drive tomorrow 🍷',
        html: '<p>Hi ' + docs[z].firstName +
          ',</p> <p>Thanks again for using WineToursCapeTown.com!</p><p>Just a quick reminder about your chauffeur drive tomorrow for ' + docs[z].pax + ' people.</p>Pickup is scheduled from: <br><strong>Outside ' + docs[z].pickupAddress + ' </strong><p>Please be outside and on the lookout at the earliest above time.</p><p>Lastly, should you need it, the contact number to use in the morning regarding collection or any problems, is <strong>' + opPhone + '</strong>, but you are welcome to contact me directly (+27 82 046 7370) should you need anything, I’ll be happy to help.</p><p></p>Have a great day!<p>Kind regards<br>Josh<br><a href=' + process.env.NODEMAILER_WTCTLINK + ' target=\'_blank\'>WineToursCapeTown.com</a></p>',
        text: 'Hi ' + docs[z].firstName + ',\r\n\r\nThanks again for using WineToursCapeTown.com!\r\n\r\nJust a quick reminder about your wine tour tomorrow for ' + docs[z].pax + ' people. \r\n\r\nPickup is scheduled from: Outside ' + docs[z].pickupAddress + ' \r\n\r\nPlease be outside and on the lookout at the earliest above time.\r\n\r\nLastly, should you need it, the contact number to use in the morning regarding collection or any problems, is ' + opPhone + ', but you are welcome to contact me directly (+27 82 046 7370) should you need anything, I’ll be happy to help.\r\n\r\nHave a great day!\r\n\r\nKind regards\r\nJosh\r\nWineToursCapeTown.com',
      };
    } else {
      var mailOptions = {
        from: process.env.NODEMAILER_FROM,
        to: '' + docs[z].customerEmail + '',
        subject: 'Reminder of your wine tour tomorrow 🍷',
        html: '<p>Hi ' + docs[z].firstName +
                      ',</p> <p>Thanks again for using WineToursCapeTown.com!</p><p>Just a quick reminder about your wine tour tomorrow for ' + docs[z].pax + ' people.</p>Pickup is scheduled from: <br><strong>Outside ' + docs[z].pickupAddress + ' </strong><p>Please be outside and on the lookout at the earliest above time.</p><p>Lastly, should you need it, the contact number to use in the morning regarding collection or any problems, is <strong>' + opPhone + '</strong>, but you are welcome to contact me directly (+27 82 046 7370) should you need anything, I’ll be happy to help.</p><p></p>Have a great day!<p>Kind regards<br>Josh<br><a href=' + process.env.NODEMAILER_WTCTLINK + ' target=\'_blank\'>WineToursCapeTown.com</a></p>',
        text: 'Hi ' + docs[z].firstName + ',\r\n\r\nThanks again for using WineToursCapeTown.com!\r\n\r\nJust a quick reminder about your wine tour tomorrow for ' + docs[z].pax + ' people. \r\n\r\nPickup is scheduled from: Outside ' + docs[z].pickupAddress + ' \r\n\r\nPlease be outside and on the lookout at the earliest above time.\r\n\r\nLastly, should you need it, the contact number to use in the morning regarding collection or any problems, is ' + opPhone + ', but you are welcome to contact me directly (+27 82 046 7370) should you need anything, I’ll be happy to help.\r\n\r\nHave a great day!\r\n\r\nKind regards\r\nJosh\r\nWineToursCapeTown.com',
      };
    }


    transporter.sendMail(mailOptions, docs, z, function(error, info) {
      // const gm = require('./getMatches.js');
      // console.log(docs[z][10]);
      const resInfo = info.response;
      const msgID = info.messageId;

      if (error) {
        console.log(error);
        transporter.close();
      } else {
        const fs = require('fs');
        // create log entry
        fs.appendFile('logs/logs.txt', 'LOG Client Reminder sent to ' + docs[z].customerEmail + ' ' + resInfo + msgID + '\r\n', // docs[10] isnt being read
            function(err) {
              if (err) throw err;
              console.log('Reminder Sent and Logged!');
            });
        // console.log(resInfo);
        // console.log(msgID);
        console.log('Client reminder sent');
        transporter.close();
      }
    });
    // //// END MAILER HERE
  },
};

