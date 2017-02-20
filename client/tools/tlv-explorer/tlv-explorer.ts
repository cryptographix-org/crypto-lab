import { bindable, autoinject } from 'aurelia-framework';
import { TLVDatabase, TLVDatabaseEntry, RootTLVInfo, TLVInfo, TLV, TLVParser } from './tlv-database';
import { ByteArray } from '@cryptographix/sim-core';

import './tlv-explorer.scss';

export class TLVX {
  tlvDatabase: TLVDatabase;

  constructor() {
    this.tlvDatabase = new TLVDatabase();
    this.rootTLVInfo = new RootTLVInfo(this.tlvDatabase);

    let entries = [
      new TLVDatabaseEntry(0x70, "Public Data Template", ""),
      new TLVDatabaseEntry(0x5A, "Application PAN", ""),
      new TLVDatabaseEntry(0x5F34, "PAN Sequence", ""),
    ];

    this.tlvDatabase.databaseEntries = this.tlvDatabase.databaseEntries.concat(entries);

    this.hexInputChanged(this.hexInput);
  }

  @bindable()
  hexInput: string;

  @bindable()
  parseError: string;

  @bindable()
  rootTLVInfo: RootTLVInfo;

  hexInputChanged(newValue: string) {
    this.parseError = undefined;

    this.rootTLVInfo.bytes = new ByteArray();

    let bytes: ByteArray;
    try {
      bytes = new ByteArray(newValue, ByteArray.HEX);
    }
    catch (E) {
      this.parseError = "INVALID HEX";
      return;
    }

    try {
      this.rootTLVInfo.bytes = bytes;
    }
    catch (E) {
      this.parseError = "INVALID TLV DATA";
      return;
    }
  }

  private xx(infos: Array<TLVInfo>, indent: number): string {
    let text = "";
    for (let info of infos) {
      text += "  ".repeat(indent);
      text += info.tlv.tagAsHex + " " + info.tlv.lenAsHex;
      if (info.childTLVInfos.length)
        text += "\n" + this.xx(info.childTLVInfos, indent + 1);
      else
        text += " " + info.tlv.value.toString() + "\n";
    }

    return text;
  }

  reformatTLV() {
    let text = this.xx(this.rootTLVInfo.childTLVInfos, 0);
    this.hexInput = text;
  }
  cleanupTLV() {
    let text = this.xx(this.rootTLVInfo.childTLVInfos, 0);
    this.hexInput = text.replace(/ /g, '').replace(/\n/g, '');
  }
}
