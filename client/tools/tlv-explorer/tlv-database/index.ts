export { TLVDatabase } from './tlv-database';
export { TLVDatabaseEntry } from './tlv-database-entry';
export { RootTLVInfo, TLVInfo } from './tlv-info';
import { ByteArray } from '@cryptographix/sim-core';

import { BaseTLV } from '@cryptographix/se-core';

function I2H(value: number): string {
  let len = 2;

  if (value > 0xffffffff)
    len = 16;
  else if (value > 0xffffff)
    len = 8;
  else if (value > 0xffff)
    len = 6;
  else if (value > 0xff)
    len = 4;

  return ("0".repeat(len - 1) + value.toString(16)).slice(-len).toUpperCase();
}

export class TLV extends BaseTLV {
  public get tagAsHex(): string {
    return I2H(this.tag);
  }

  public get lenAsHex(): string {
    let parse = TLV.parseTLV(this.byteArray, TLV.Encodings.EMV);

    return this.byteArray.bytesAt(parse.lenOffset, parse.valueOffset - parse.lenOffset).toString();
  }
}

export class TLVParser {
  pos: number;
  constructor(public tlvData: ByteArray) {
    this.pos = 0;
  }

  public nextTLV(peek: boolean = false): TLV {
    var info = TLV.parseTLV(<any>this.tlvData.bytesAt(this.pos), TLV.Encodings.EMV);

    // no TLV found (empty or only padding)
    if (!info)
      return null;

    if (!peek)
      this.pos += info.valueOffset + info.len;

    return new TLV(info.tag, info.value);
  }

  get atEOF(): boolean {
    var info = TLV.parseTLV(<any>this.tlvData.bytesAt(this.pos), TLV.Encodings.EMV);

    // not-erro and no-more-data
    return (info && info.tag == 0);
  }
}
