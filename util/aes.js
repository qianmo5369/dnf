import CryptoJS from 'crypto-js';
let crypt_key = 'A1b2C3d4E5f6G7h8';
let crypt_iv = 'I9j0K1l2M3n4O5p6';
// 加密
export function encrypt(data) {
	// 将key解析为字节
	let aes_key = CryptoJS.enc.Utf8.parse(crypt_key);
	// 将iv解析为字节
	let new_iv = CryptoJS.enc.Utf8.parse(crypt_iv);
	// AES加密 CBC模式 ZeroPadding
	let encrypted = CryptoJS.AES.encrypt(data, aes_key, {
		iv: new_iv,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7
	});
	// 返回字符串
	return encrypted.toString();
}

//解密
export function decrypt(data) {
	let aes_key = CryptoJS.enc.Utf8.parse(crypt_key);
	let aes_iv = CryptoJS.enc.Utf8.parse(crypt_iv);
	// 将数据编码成Base64格式
	let baseResult = CryptoJS.enc.Base64.parse(data);
	let ciphertext = CryptoJS.enc.Base64.stringify(baseResult);
	// AES解密 CBC模式 ZeroPadding
	let decryptResult = CryptoJS.AES.decrypt(ciphertext, aes_key, {
		iv: aes_iv,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7
	});
	// 返回字符串
	let resData = decryptResult.toString(CryptoJS.enc.Utf8).toString();
	return resData;
}