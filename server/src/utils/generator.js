import crypto from "crypto"

const characters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjklmnpqrstuvwxyz23456789"

export const generateJoinCode = () => {
	let code = ""

	for (let i=0; i<6; i++) {
		code += characters[crypto.randomInt(characters.length)]
	}

	return code
}