const jose = require('jose');
const axios = require('axios');

module.exports = async function (sid) {
	const privateKeyJSONB64 = process.env.PRIVATE_KEY_JSON_BASE64;
	const privateJWKJson = JSON.parse(Buffer.from(privateKeyJSONB64, 'base64').toString('utf8'));
	const privateJWK = await jose.importJWK(privateJWKJson, 'ES256');

	const privateKeyJwt = await new jose.SignJWT({
		iss: process.env.KANALO_ISSUER,
		sub: process.env.KANALO_KEY_ID,
		aud: 'https://api.kanalo.dev/',
		permissions: ['write:message'],
	})
		.setExpirationTime('1800s')
		.setIssuedAt()
		.setProtectedHeader({
			typ: 'JWT',
			alg: 'ES256',
		})
		.sign(privateJWK);

	console.log("Sending message with a Private key JWT");
	const res = await axios.post(`${process.env.KANALO_ISSUER.replace('.on.', '.api.')}/realtime-session2/v1/commands`, 
		[{
			"command":"message",
			"params":{ 
				"tags": [`sid-${sid}`],  
				"message":JSON.stringify({ type: "log-out" })
			}
		}],
		{
			headers: {
				Authorization: `Bearer ${privateKeyJwt}`
			}
		}
	);

	console.log("Success!~", res.status);
}