namespace dou {
    /**
     * 字节数组
     * @author wizardc
     */
    export class ByteArray {
        protected _bufferExtSize: number = 0;
        protected _data: DataView;
        protected _bytes: Uint8Array;
        protected _position: number;
        protected _writePosition: number;
        protected _endian: Endian;

        private _eofByte: number = -1;
        private _eofCodePoint: number = -1;

        public constructor(buffer?: ArrayBuffer | Uint8Array, bufferExtSize: number = 0) {
            if (bufferExtSize < 0) {
                bufferExtSize = 0;
            }
            this._bufferExtSize = bufferExtSize;
            let bytes: Uint8Array, wpos = 0;
            if (buffer) {
                let uint8: Uint8Array;
                if (buffer instanceof Uint8Array) {
                    uint8 = buffer;
                    wpos = buffer.length;
                }
                else {
                    wpos = buffer.byteLength;
                    uint8 = new Uint8Array(buffer);
                }
                if (bufferExtSize == 0) {
                    bytes = new Uint8Array(wpos);
                }
                else {
                    let multi = (wpos / bufferExtSize | 0) + 1;
                    bytes = new Uint8Array(multi * bufferExtSize);
                }
                bytes.set(uint8);
            }
            else {
                bytes = new Uint8Array(bufferExtSize);
            }
            this._writePosition = wpos;
            this._position = 0;
            this._bytes = bytes;
            this._data = new DataView(bytes.buffer);
            this._endian = Endian.bigEndian;
        }

        public set endian(value: Endian) {
            this._endian = value;
        }
        public get endian(): Endian {
            return this._endian;
        }

        public get readAvailable() {
            return this._writePosition - this._position;
        }

        public get buffer(): ArrayBuffer {
            return this._data.buffer.slice(0, this._writePosition);
        }

        public get rawBuffer(): ArrayBuffer {
            return this._data.buffer;
        }

        public set buffer(value: ArrayBuffer) {
            let wpos = value.byteLength;
            let uint8 = new Uint8Array(value);
            let bufferExtSize = this._bufferExtSize;
            let bytes: Uint8Array;
            if (bufferExtSize == 0) {
                bytes = new Uint8Array(wpos);
            }
            else {
                let multi = (wpos / bufferExtSize | 0) + 1;
                bytes = new Uint8Array(multi * bufferExtSize);
            }
            bytes.set(uint8);
            this._writePosition = wpos;
            this._bytes = bytes;
            this._data = new DataView(bytes.buffer);
        }

        public get bytes(): Uint8Array {
            return this._bytes;
        }

        public get dataView(): DataView {
            return this._data;
        }

        public set dataView(value: DataView) {
            this.buffer = value.buffer;
        }

        public get bufferOffset(): number {
            return this._data.byteOffset;
        }

        public set position(value: number) {
            this._position = value;
            if (value > this._writePosition) {
                this._writePosition = value;
            }
        }
        public get position(): number {
            return this._position;
        }

        public set length(value: number) {
            this._writePosition = value;
            if (this._data.byteLength > value) {
                this._position = value;
            }
            this.validateBuffer(value);
        }
        public get length(): number {
            return this._writePosition;
        }

        protected validateBuffer(value: number): void {
            if (this._data.byteLength < value) {
                let be = this._bufferExtSize;
                let tmp: Uint8Array;
                if (be == 0) {
                    tmp = new Uint8Array(value);
                }
                else {
                    let nLen = ((value / be >> 0) + 1) * be;
                    tmp = new Uint8Array(nLen);
                }
                tmp.set(this._bytes);
                this._bytes = tmp;
                this._data = new DataView(tmp.buffer);
            }
        }

        public get bytesAvailable(): number {
            return this._data.byteLength - this._position;
        }

        public validate(len: number): boolean {
            let bl = this._bytes.length;
            if (bl > 0 && this._position + len <= bl) {
                return true;
            }
            else {
                console.error("End of the file");
            }
        }

        protected validateBuffer2(len: number): void {
            this._writePosition = len > this._writePosition ? len : this._writePosition;
            len += this._position;
            this.validateBuffer(len);
        }

        public readBoolean(): boolean {
            if (this.validate(ByteArraySize.SIZE_OF_BOOLEAN)) {
                return !!this._bytes[this.position++];
            }
        }

        public readByte(): number {
            if (this.validate(ByteArraySize.SIZE_OF_INT8)) {
                return this._data.getInt8(this.position++);
            }
        }

        public readUnsignedByte(): number {
            if (this.validate(ByteArraySize.SIZE_OF_UINT8)) return this._bytes[this.position++];
        }

        public readShort(): number {
            if (this.validate(ByteArraySize.SIZE_OF_INT16)) {
                let value = this._data.getInt16(this._position, this._endian == Endian.littleEndian);
                this.position += ByteArraySize.SIZE_OF_INT16;
                return value;
            }
        }

        public readUnsignedShort(): number {
            if (this.validate(ByteArraySize.SIZE_OF_UINT16)) {
                let value = this._data.getUint16(this._position, this._endian == Endian.littleEndian);
                this.position += ByteArraySize.SIZE_OF_UINT16;
                return value;
            }
        }

        public readInt(): number {
            if (this.validate(ByteArraySize.SIZE_OF_INT32)) {
                let value = this._data.getInt32(this._position, this._endian == Endian.littleEndian);
                this.position += ByteArraySize.SIZE_OF_INT32;
                return value;
            }
        }

        public readUnsignedInt(): number {
            if (this.validate(ByteArraySize.SIZE_OF_UINT32)) {
                let value = this._data.getUint32(this._position, this._endian == Endian.littleEndian);
                this.position += ByteArraySize.SIZE_OF_UINT32;
                return value;
            }
        }

        public readFloat(): number {
            if (this.validate(ByteArraySize.SIZE_OF_FLOAT32)) {
                let value = this._data.getFloat32(this._position, this._endian == Endian.littleEndian);
                this.position += ByteArraySize.SIZE_OF_FLOAT32;
                return value;
            }
        }

        public readDouble(): number {
            if (this.validate(ByteArraySize.SIZE_OF_FLOAT64)) {
                let value = this._data.getFloat64(this._position, this._endian == Endian.littleEndian);
                this.position += ByteArraySize.SIZE_OF_FLOAT64;
                return value;
            }
        }

        public readBytes(bytes: ByteArray, offset: number = 0, length: number = 0): void {
            if (!bytes) {
                return;
            }
            let pos = this._position;
            let available = this._writePosition - pos;
            if (available < 0) {
                console.error("End of the file");
                return;
            }
            if (length == 0) {
                length = available;
            }
            else if (length > available) {
                console.error("End of the file");
                return;
            }
            const position = bytes._position;
            bytes._position = 0;
            bytes.validateBuffer2(offset + length);
            bytes._position = position;
            bytes._bytes.set(this._bytes.subarray(pos, pos + length), offset);
            this.position += length;
        }

        public readUTF(): string {
            let length = this.readUnsignedShort();
            if (length > 0) {
                return this.readUTFBytes(length);
            }
            else {
                return "";
            }
        }

        public readUTFBytes(length: number): string {
            if (!this.validate(length)) {
                return;
            }
            let data = this._data;
            let bytes = new Uint8Array(data.buffer, data.byteOffset + this._position, length);
            this.position += length;
            return this.decodeUTF8(bytes);
        }

        private decodeUTF8(data: Uint8Array): string {
            let fatal = false;
            let pos = 0;
            let result = "";
            let code_point: number;
            let utf8_code_point = 0;
            let utf8_bytes_needed = 0;
            let utf8_bytes_seen = 0;
            let utf8_lower_boundary = 0;
            while (data.length > pos) {
                let byte = data[pos++];
                if (byte == this._eofByte) {
                    if (utf8_bytes_needed != 0) {
                        code_point = this.decoderError(fatal);
                    }
                    else {
                        code_point = this._eofCodePoint;
                    }
                }
                else {
                    if (utf8_bytes_needed == 0) {
                        if (this.inRange(byte, 0x00, 0x7F)) {
                            code_point = byte;
                        }
                        else {
                            if (this.inRange(byte, 0xC2, 0xDF)) {
                                utf8_bytes_needed = 1;
                                utf8_lower_boundary = 0x80;
                                utf8_code_point = byte - 0xC0;
                            }
                            else if (this.inRange(byte, 0xE0, 0xEF)) {
                                utf8_bytes_needed = 2;
                                utf8_lower_boundary = 0x800;
                                utf8_code_point = byte - 0xE0;
                            }
                            else if (this.inRange(byte, 0xF0, 0xF4)) {
                                utf8_bytes_needed = 3;
                                utf8_lower_boundary = 0x10000;
                                utf8_code_point = byte - 0xF0;
                            }
                            else {
                                this.decoderError(fatal);
                            }
                            utf8_code_point = utf8_code_point * Math.pow(64, utf8_bytes_needed);
                            code_point = null;
                        }
                    }
                    else if (!this.inRange(byte, 0x80, 0xBF)) {
                        utf8_code_point = 0;
                        utf8_bytes_needed = 0;
                        utf8_bytes_seen = 0;
                        utf8_lower_boundary = 0;
                        pos--;
                        code_point = this.decoderError(fatal, byte);
                    }
                    else {
                        utf8_bytes_seen += 1;
                        utf8_code_point = utf8_code_point + (byte - 0x80) * Math.pow(64, utf8_bytes_needed - utf8_bytes_seen);
                        if (utf8_bytes_seen !== utf8_bytes_needed) {
                            code_point = null;
                        }
                        else {
                            let cp = utf8_code_point;
                            let lower_boundary = utf8_lower_boundary;
                            utf8_code_point = 0;
                            utf8_bytes_needed = 0;
                            utf8_bytes_seen = 0;
                            utf8_lower_boundary = 0;
                            if (this.inRange(cp, lower_boundary, 0x10FFFF) && !this.inRange(cp, 0xD800, 0xDFFF)) {
                                code_point = cp;
                            }
                            else {
                                code_point = this.decoderError(fatal, byte);
                            }
                        }
                    }
                }
                if (code_point !== null && code_point !== this._eofCodePoint) {
                    if (code_point <= 0xFFFF) {
                        if (code_point > 0) {
                            result += String.fromCharCode(code_point);
                        }
                    }
                    else {
                        code_point -= 0x10000;
                        result += String.fromCharCode(0xD800 + ((code_point >> 10) & 0x3ff));
                        result += String.fromCharCode(0xDC00 + (code_point & 0x3ff));
                    }
                }
            }
            return result;
        }

        private inRange(a: number, min: number, max: number): boolean {
            return min <= a && a <= max;
        }

        private decoderError(fatal: boolean, opt_code_point?: number): number {
            if (fatal) {
                console.error("Decoding error");
            }
            return opt_code_point || 0xFFFD;
        }

        public writeBoolean(value: boolean): void {
            this.validateBuffer2(ByteArraySize.SIZE_OF_BOOLEAN);
            this._bytes[this.position++] = +value;
        }

        public writeByte(value: number): void {
            this.validateBuffer2(ByteArraySize.SIZE_OF_INT8);
            this._bytes[this.position++] = value & 0xff;
        }

        public writeShort(value: number): void {
            this.validateBuffer2(ByteArraySize.SIZE_OF_INT16);
            this._data.setInt16(this._position, value, this._endian == Endian.littleEndian);
            this.position += ByteArraySize.SIZE_OF_INT16;
        }

        public writeUnsignedShort(value: number): void {
            this.validateBuffer2(ByteArraySize.SIZE_OF_UINT16);
            this._data.setUint16(this._position, value, this._endian == Endian.littleEndian);
            this.position += ByteArraySize.SIZE_OF_UINT16;
        }

        public writeInt(value: number): void {
            this.validateBuffer2(ByteArraySize.SIZE_OF_INT32);
            this._data.setInt32(this._position, value, this._endian == Endian.littleEndian);
            this.position += ByteArraySize.SIZE_OF_INT32;
        }

        public writeUnsignedInt(value: number): void {
            this.validateBuffer2(ByteArraySize.SIZE_OF_UINT32);
            this._data.setUint32(this._position, value, this._endian == Endian.littleEndian);
            this.position += ByteArraySize.SIZE_OF_UINT32;
        }

        public writeFloat(value: number): void {
            this.validateBuffer2(ByteArraySize.SIZE_OF_FLOAT32);
            this._data.setFloat32(this._position, value, this._endian == Endian.littleEndian);
            this.position += ByteArraySize.SIZE_OF_FLOAT32;
        }

        public writeDouble(value: number): void {
            this.validateBuffer2(ByteArraySize.SIZE_OF_FLOAT64);
            this._data.setFloat64(this._position, value, this._endian == Endian.littleEndian);
            this.position += ByteArraySize.SIZE_OF_FLOAT64;
        }

        public writeBytes(bytes: ByteArray, offset: number = 0, length: number = 0): void {
            let writeLength: number;
            if (offset < 0) {
                return;
            }
            if (length < 0) {
                return;
            }
            else if (length == 0) {
                writeLength = bytes.length - offset;
            }
            else {
                writeLength = Math.min(bytes.length - offset, length);
            }
            if (writeLength > 0) {
                this.validateBuffer2(writeLength);
                this._bytes.set(bytes._bytes.subarray(offset, offset + writeLength), this._position);
                this.position = this._position + writeLength;
            }
        }

        public writeUTF(value: string): void {
            let utf8bytes: ArrayLike<number> = this.encodeUTF8(value);
            let length: number = utf8bytes.length;
            this.validateBuffer2(ByteArraySize.SIZE_OF_UINT16 + length);
            this._data.setUint16(this._position, length, this._endian == Endian.littleEndian);
            this.position += ByteArraySize.SIZE_OF_UINT16;
            this.writeUint8Array(utf8bytes, false);
        }

        public writeUTFBytes(value: string): void {
            this.writeUint8Array(this.encodeUTF8(value));
        }

        private encodeUTF8(str: string): Uint8Array {
            let pos = 0;
            let codePoints = this.stringToCodePoints(str);
            let outputBytes = [];
            while (codePoints.length > pos) {
                let code_point = codePoints[pos++];
                if (this.inRange(code_point, 0xD800, 0xDFFF)) {
                    console.error(`EncodingError The code point ${code_point} could not be encoded`);
                }
                else if (this.inRange(code_point, 0x0000, 0x007f)) {
                    outputBytes.push(code_point);
                }
                else {
                    let count, offset;
                    if (this.inRange(code_point, 0x0080, 0x07FF)) {
                        count = 1;
                        offset = 0xC0;
                    }
                    else if (this.inRange(code_point, 0x0800, 0xFFFF)) {
                        count = 2;
                        offset = 0xE0;
                    }
                    else if (this.inRange(code_point, 0x10000, 0x10FFFF)) {
                        count = 3;
                        offset = 0xF0;
                    }
                    outputBytes.push(this.div(code_point, Math.pow(64, count)) + offset);
                    while (count > 0) {
                        let temp = this.div(code_point, Math.pow(64, count - 1));
                        outputBytes.push(0x80 + (temp % 64));
                        count -= 1;
                    }
                }
            }
            return new Uint8Array(outputBytes);
        }

        private stringToCodePoints(string: string): number[] {
            let cps: number[] = [];
            let i = 0, n = string.length;
            while (i < string.length) {
                let c = string.charCodeAt(i);
                if (!this.inRange(c, 0xD800, 0xDFFF)) {
                    cps.push(c);
                }
                else if (this.inRange(c, 0xDC00, 0xDFFF)) {
                    cps.push(0xFFFD);
                }
                else {
                    if (i == n - 1) {
                        cps.push(0xFFFD);
                    }
                    else {
                        let d = string.charCodeAt(i + 1);
                        if (this.inRange(d, 0xDC00, 0xDFFF)) {
                            let a = c & 0x3FF;
                            let b = d & 0x3FF;
                            i += 1;
                            cps.push(0x10000 + (a << 10) + b);
                        }
                        else {
                            cps.push(0xFFFD);
                        }
                    }
                }
                i += 1;
            }
            return cps;
        }

        public writeUint8Array(bytes: Uint8Array | ArrayLike<number>, validateBuffer: boolean = true): void {
            let pos = this._position;
            let npos = pos + bytes.length;
            if (validateBuffer) {
                this.validateBuffer2(npos);
            }
            this.bytes.set(bytes, pos);
            this.position = npos;
        }

        private div(n: number, d: number): number {
            return Math.floor(n / d);
        }

        public clear(): void {
            let buffer = new ArrayBuffer(this._bufferExtSize);
            this._data = new DataView(buffer);
            this._bytes = new Uint8Array(buffer);
            this._position = 0;
            this._writePosition = 0;
        }

        public toString(): string {
            return "[ByteArray] length:" + this.length + ", bytesAvailable:" + this.bytesAvailable;
        }
    }

    const enum ByteArraySize {
        SIZE_OF_BOOLEAN = 1,
        SIZE_OF_INT8 = 1,
        SIZE_OF_INT16 = 2,
        SIZE_OF_INT32 = 4,
        SIZE_OF_UINT8 = 1,
        SIZE_OF_UINT16 = 2,
        SIZE_OF_UINT32 = 4,
        SIZE_OF_FLOAT32 = 4,
        SIZE_OF_FLOAT64 = 8
    }
}
