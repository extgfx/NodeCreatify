const randomstring = require('randomstring')
const request = require('request')
const axios = require('axios')
const qs = require('qs')

const Spotify = (username, password, tgl_lahir, bln_lahir, thn_lahir, email) =>
new Promise((resolve, reject) => {
	function getRandomInt(max) {
		return Math.floor(Math.random() * Math.floor(max));
	}
	let version_ua_phone = [
	"ASUS_T00F",
	"ASUS_T00J",
	"ASUS_T00Q",
	"ASUS_Z007",
	"ASUS_Z00AD",
	"ASUS_X00HD",
	];
	let data = qs.stringify({
		iagree: "true",
		birth_day: tgl_lahir,
		birth_month: bln_lahir,
		platform: "Android-ARM",
		creation_point: "client_mobile",
		password: password,
		key: "142b583129b2df829de3656f9eb484e6",
		birth_year: thn_lahir,
		email: email,
		gender: "male",
		app_version: "849800892",
		password_repeat: password,
	});
	let config = {
		method: "post",
		url: "https://spclient.wg.spotify.com:443/signup/public/v1/account/",
		headers: {
			"User-Agent": `Spotify/8.4.98 Android/25 ('${
				version_ua_phone[getRandomInt(version_ua_phone.length)]
			}')`,
			"Content-Type": "application/x-www-form-urlencoded",
			Connection: "Keep-Alive",
		},
		data: data,
	};

	axios(config)
	.then(function (response) {
		if (response.data.status == 1) {
			let json = {
				status: true,
				message: "berhasil",
				result: {
					bruh: response.data,
					password: password,
					email: email
				},
			};
			resolve(json);
		} else {
			let json = {
				status: false,
				message: "Failed",
			};
			resolve(json);
		}
	})
});

(async () => {

	let umail = randomstring.generate(5)
	let mail = `${umail}@1secmail.com`
	let uname = randomstring.generate(7)
	let pass = randomstring.generate(8)
	let tgl = randomstring.generate({length: 1, charset: "numeric"})
	let bln = randomstring.generate({length: 1, charset: "numeric"})
	let tahun = 1999


	let ekse = await Spotify(uname, pass, tgl, bln, tahun, mail);
	if (ekse.status == true) {
		console.log(ekse.result)

		await new Promise(resolve => setTimeout(resolve, 15000));

		request(`https://www.1secmail.com/api/v1/?action=getMessages&login=${umail}&domain=1secmail.com`, { json: true }, (err, res, body) => {
			const getMailId = body[0].id

			request(`https://www.1secmail.com/api/v1/?action=readMessage&login=${umail}&domain=1secmail.com&id=${getMailId}`, { json: true }, (err, res, body) => {

				const getVerifyBody = body.body
				const firstSplit = getVerifyBody.indexOf('https://wl.spotify.com/ls/click?upn=')
				const doneSplit = getVerifyBody.substr(firstSplit)
				const getVerifyURL = doneSplit.split('" clicktracking="on"')

				console.log(`\n\n${getVerifyURL[0]}\n\n`)

				// request(getVerifyURL[0], { json: true }, (err, res, body) => {
				// 	console.log('Verify Done.')
				// })
			})
		})

	}
})
();