// 本文件由FirstUI授权予陈*强（会员ID： 51 7）专用，请尊重知识产权，勿私下传播，违者追究法律责任。
import mode from './mode.js'

function QR8bitByte(data) {
	this.mode = mode.MODE_8BIT_BYTE;
	this.data = data;
}

QR8bitByte.prototype = {

	getLength : function(buffer) {
		return this.data.length;
	},

	write : function(buffer) {
		for (var i = 0; i < this.data.length; i++) {
			// not JIS ...
			buffer.put(this.data.charCodeAt(i), 8);
		}
	}
};

export default QR8bitByte;
