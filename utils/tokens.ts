import { JwksClient } from "jwks-rsa";
// eslint-disable-next-line import/default
import jwt from "jsonwebtoken";
import { User } from "oidc-client-ts";
import { Token } from "~/db/entities/Token";
import { Config } from "types/config";

export async function getUserByToken(value: string) {
	const token = await Token.findOne({
		relations: {
			user: true,
		},
		where: {
			token: value,
		},
	});

	if (token?.user) {
		token.user.password = "";
		return token.user;
	} else return null;
}

export async function validateToken(
	body: User,
	provider: Config["oidc_providers"][0]
) {
	const { jwks_uri: jwksUri } = await (
		await fetch(provider.authority)
	).json();

	const client = new JwksClient({
		jwksUri,
	});

	const getKey: jwt.GetPublicKeyOrSecret = (header, callback) => {
		client.getSigningKey(header.kid, function (err, key) {
			if (err) {
				throw err;
			}
			const signingKey = key?.getPublicKey();
			callback(null, signingKey);
		});
	};

	let decoded: jwt.JwtPayload;

	// Verify the ID token
	try {
		decoded = await new Promise((resolve, reject) => {
			// eslint-disable-next-line import/no-named-as-default-member
			jwt.verify(
				body.id_token ?? "",
				getKey,
				{ algorithms: ["RS256"] },
				function (err, decoded) {
					if (err) {
						reject(err);
						// Handle error
					} else {
						resolve(decoded as any);
						// ID token is valid, create session for user
					}
				}
			);
		});
	} catch {
		throw new Error("Invalid JSON Web Token");
	}

	return decoded.sub;
}
