import { TLVDatabase, TLVDatabaseEntry, TLV, TLVParser } from '.';
//import { TLV } from '@cryptographix/se-core';
import { ByteArray } from '@cryptographix/sim-core';

function buildTLVInfos(tlvDatabase: TLVDatabase, bytes: ByteArray) {

  let tlvInfos = new Array<TLVInfo>();

  if (bytes.length) {
    let parser: TLVParser = new TLVParser(bytes);

    while (!parser.atEOF) {
      let tlv = parser.nextTLV();
      if (!tlv)
        throw new Error("Invalid TLV Data");

      tlvInfos.push(new TLVInfo(tlvDatabase, tlv));
    }
  }

  return tlvInfos;
}

export class RootTLVInfo {
  private rootBytes: ByteArray;

  public get bytes(): ByteArray {
    return this.rootBytes;
  }
  public set bytes(bytes: ByteArray) {
    this.rootBytes = bytes || new ByteArray();

    this.childTLVInfos = buildTLVInfos(this.tlvDatabase, this.rootBytes)
  }

  public tlvDatabase: TLVDatabase;

  public childTLVInfos: Array<TLVInfo>;

  constructor(tlvDatabase: TLVDatabase, bytes?: ByteArray) {
    this.tlvDatabase = tlvDatabase;

    this.bytes = bytes;
  }
}

export class TLVInfo {
  public tlv: TLV;
  public entry: TLVDatabaseEntry;

  public childTLVInfos: Array<TLVInfo>;

  constructor(tlvDatabase: TLVDatabase, tlv: TLV) {
    this.tlv = tlv;
    this.entry = tlvDatabase.findTag(tlv.tag);
    this.childTLVInfos = new Array<TLVInfo>();

    let tag: number = tlv.tag;
    if (tag > 255) tag >>= 8;

    if (tag & 0x20) {
      this.childTLVInfos = buildTLVInfos(tlvDatabase, tlv.value)
    }
  }
}
