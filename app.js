

'use strict';

const reddit = require('redwrap');
const fs = require('fs');
const nodemailer = require('nodemailer');
const Helper = require('./Helper.js');
const config = require('./config.json');


let lastPageIds = [];

let emailList = fs.readFileSync(config.email_list_filename, "utf8");
emailList = JSON.parse(emailList);


function sendEmail(to, subject, html) {
	if (!config.email.account || !config.email.password) {
		console.log("Error, check the config file");
		return;
	}
	
    // replace the @ symbol
    config.email.account = config.email.account.replace(/@/gi, "%40");

    let transporter = nodemailer.createTransport('smtps://' + config.email.account + ':' + config.email.password + '@smtp.gmail.com/?pool=true');
    let message = Helper.stripHTML(html);

    let mailOptions = {
        from: '"NinjaBot 🕵" <' + config.email.account +'>', 
        to: to, 
        subject: "NinjaBot: " + subject,
        text: message,
        html: html
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log("Error while trying to send an email")
            console.log(error);
        }

        console.log('Email sent to: ' + to + " with subject: " + subject + " \n" + info.response);
    });
}

function readLastPageIdsFile(callback) {
	try {
		lastPageIds = fs.readFileSync(config.last_page_ids_filename, "utf8");
		lastPageIds = JSON.parse(lastPageIds);

		callback();
	} catch(err) {
		if (err.code == "ENOENT") {
			saveLastPageIdsFile();
		} else {
			console.log(err);
		}
	}
}

function saveLastPageIdsFile() {
	fs.writeFileSync(config.last_page_ids_filename, JSON.stringify(lastPageIds));
}

function sendNotificationEmail(url, title) {
	let html = `<a href='${url}'>${title}</a>`;

	for(let email of email_list) {
		sendEmail(email, `Novo jogo na Steam ${title}`, html);
	}
}

function checkNewPosts() {
	console.log("Checking for new posts...");
	
	readLastPageIdsFile(() => {
		reddit.r('FreeGamesOnSteam').new().exe(function(err, data, res){
			let posts = data.data.children.reverse();
			let currentPageIds = [];

			for(let post of posts) {
				currentPageIds.push(post.data.id);

				if (lastPageIds.indexOf(post.data.id) === -1) {
					sendNotificationEmail(post.data.url, post.data.title);
				}
			}

			lastPageIds = currentPageIds;
			saveLastPageIdsFile();
		});
	});
}

Helper.printLogo();
checkNewPosts();

setInterval(function() {
	checkNewPosts();
}, config.update_interval * 60 * 1000); // in minutes