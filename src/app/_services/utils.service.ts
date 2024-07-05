import { Injectable } from '@angular/core';
import { AppConfiguration } from './app-config.service';
import { isNumber, toInteger, padNumber } from '../controls/date/utils';


@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private appcfg: AppConfiguration) { }

  luni: any[] = [
    'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
    'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
  ]

  luni2 = [
    { indexLuna: 0, numarLuna: 1, numeLuna: 'Ianuarie' },
    { indexLuna: 1, numarLuna: 2, numeLuna: 'Februarie' },
    { indexLuna: 2, numarLuna: 3, numeLuna: 'Martie' },
    { indexLuna: 3, numarLuna: 4, numeLuna: 'Aprilie' },
    { indexLuna: 4, numarLuna: 5, numeLuna: 'Mai' },
    { indexLuna: 5, numarLuna: 6, numeLuna: 'Iunie' },
    { indexLuna: 6, numarLuna: 7, numeLuna: 'Iulie' },
    { indexLuna: 7, numarLuna: 8, numeLuna: 'August' },
    { indexLuna: 8, numarLuna: 9, numeLuna: 'Septembrie' },
    { indexLuna: 9, numarLuna: 10, numeLuna: 'Octombrie' },
    { indexLuna: 10, numarLuna: 11, numeLuna: 'Noiembrie' },
    { indexLuna: 11, numarLuna: 12, numeLuna: 'Decembrie' },

  ]

  //phpServer = "http://localhost/ispot.srv/api";

  get PHP_API_SERVER() {
    return this.appcfg.apiUrl
  }
  getSeconds(h, m) {
    return h * 3600 + m * 60;
  }

  ymd2dmy(d, separator?) {
    var g = d.split('-');
    if (!separator) separator = "-";
    return g[2] + separator + g[1] + separator + g[0];
  }

  getHourMinFromSec(sec, onlyStr?: boolean): any[] | string {
    // char daca intoarce string, pnetru afisare
    var arrTime = []
    var h = Math.floor(+(sec / 3600))
    var m = Math.floor(+(sec / 60) % 60)

    var strH = h.toString()
    var strM = m.toString()
    var strTime = (strH.length == 1 && onlyStr ? '0' + strH : strH) + ':' + (strM.length == 1 ? '0' + strM : strM);
    arrTime[0] = h;
    arrTime[1] = m
    arrTime[2] = strTime
    if (onlyStr) {
      return strTime
    } else {
      return arrTime

    }
  }

  getAnlunaFromDate(datacur: Date) {
    var y = datacur.getFullYear()
    var m = datacur.getMonth() + 1
    return y * 100 + m;
  }
  getAnLunaExtended(datacur?: Date) {
    // intoarce un obiect cu 4 proprietati:
    //datacur = 23-04-2021
    //indexLuna: 3, numarLuna: 4, numeLuna: 'Aprilie', an: 2021
    if (!datacur) datacur = new Date()
    var an = datacur.getFullYear()
    var numarLuna = datacur.getMonth() + 1
    var indexLuna = datacur.getMonth()
    var numeLuna = this.luni[indexLuna]
    var anluna = an * 100 + numarLuna
    var codper = an / 100
    return { indexLuna: indexLuna, numarLuna: numarLuna, numeLuna: numeLuna, an: an, anLuna: anluna, codper: codper }
  }

  getZileInLuna(an, luna) {
    return new Date(an, luna, 0).getDate();
  }

  getDow(zi, an, luna) {
    var dd = new Date(an, luna, zi)
    var z = ""
    switch (dd.getDay()) {
      case 0: z = "D"; break;
      case 6: z = "S"; break;
      default: z = "LV"; break;
    }
    return z;

  }

  dateToArr(value: string) {
    const dateParts = value.trim().split('-');
    if (dateParts.length === 1 && isNumber(dateParts[0])) {
      return { year: toInteger(dateParts[0]), month: null, day: null };
    } else if (dateParts.length === 2 && isNumber(dateParts[0]) && isNumber(dateParts[1])) {
      return { year: toInteger(dateParts[0]), month: toInteger(dateParts[1]), day: null };
    } else if (dateParts.length === 3 && isNumber(dateParts[0]) && isNumber(dateParts[1]) && isNumber(dateParts[2])) {
      return { year: toInteger(dateParts[0]), month: toInteger(dateParts[1]), day: toInteger(dateParts[2]) };
    }
  }

  ddateToArr(date: Date) {
    return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
  }

  dstrToArr(dateStr: string) {
    var d = dateStr.replace(/-/g, '');
    var aa = parseInt(d.substring(0, 4))
    var ll = parseInt(d.substring(4, 6));

    var zz = parseInt(d.substring(6, 8))

    let dd = { year: aa, month: ll, day: zz };
    return dd;

  }

  arrToDateStr(value) {
    var y = 0;
    var m = 0;
    var d = 0;
    var dateStr = '1900-01-01'
    if (!value || value == null || value == undefined) {
      dateStr = '1900-01-01'
    }else{

      for (var name in value) {

        // name is the name of each property, so:
        //console.log(name + " = " + value[name]);
        if (name == 'year') y = value[name];
        if (name == 'month') m = value[name];
        if (name == 'day') d = value[name];
  
  
      }
      var mm = m < 10 ? "0" + m : m
      var dd = d < 10 ? "0" + d : d
      dateStr =  y + "-" + mm + "-" + dd;
    }
    return dateStr
  }

  arrToDate(value) {
    var y = 0;
    var m = 0;
    var d = 0;

    var dated = new Date(1900, 0, 1)
    if (!value || value == null || value == undefined) {
      dated = new Date(1900, 0, 1)
    } else {
      for (var name in value) {
        // name is the name of each property, so:
        //console.log(name + " = " + value[name]);
        if (name == 'year') y = value[name];
        if (name == 'month') m = value[name];
        if (name == 'day') d = value[name];
      }
      dated = new Date(y, m - 1, d)
    }
    return dated;
  }

  setPerioada(value) {
    var i = this.dateToArr(value.getFullYear() + "-" + (value.getMonth() + 1) + "-01")
    var ds = new Date(value.getFullYear(), (value.getMonth() + 1), 0);
    var s = this.dateToArr(ds.getFullYear() + "-" + (ds.getMonth() + 1) + "-" + ds.getDate())
    var p: any[] = [];
    p[0] = i;
    p[1] = s
    p[2] = ds
    return p;
  }

  //ANAF
  diacritics(str) {
    return str.normalize("NFKD").replace(/\p{Diacritic}/gu, "")
  }

  getSetItemAdresa(adresa, removeStr) {
    var strLen = 0, item = '';
    for (var i = 3; i < adresa.length; i++) {
      strLen = removeStr.length;
      if (adresa[i].substring(0, strLen) == removeStr) {
        item = adresa[i].substring(strLen, adresa[i].length).trim()
      }
    }
    return item || ''
  }
  getSetItemAdresaStr(adresa, removeStr) {
    const strLen = removeStr.length;
    if (adresa.toUpperCase().substring(0, strLen) == removeStr) {
      return adresa.substring(strLen, adresa.length).trim()
    }
    return adresa || ''
  }

  // sanitizeAdresa(text){
  //     let result = this.diacritics(text)
  //     result = result.replace(/Mun./g, "").trim();
  //     result = result.replace(/Ors./g, "").trim();
  //     result = result.replace(/Com./g, "").trim();
  //     result = result.replace(/Sat /g, "").trim();
  //     console.log('result', result)
  //     return result
  // }

  getLocalitate(cod, denumire) {
    if (!denumire) { return { localitate: '', sector: '' } }

    var localitate = '', sector = '';
    if (/SECT[orul]*? [1-6]/i.test(denumire)) {
      localitate = 'BUCURESTI';
      sector = denumire.split(' ')[1];
      if ([1, 2, 3, 4, 5, 6].indexOf(+sector) == -1) { sector = '' }
    } else if (/MUN\.|COM\.|Com\.|Orş\./i.test(denumire)) {
      const index = denumire.search(/MUN\.|COM\.|Com\.|Orş\./i);
      localitate = denumire.substring(index + 4).trim();
    } else if (/comuna|sat(ul)?\s?\w+/i.test(denumire)) {
      const parts = denumire.split(' ');
      parts.shift();
      localitate = parts.join(' ').trim();
    } else {
      localitate = denumire
    }
    return { localitate: localitate, sector: sector }
  }
  getRegiune(cod, codAuto, denumire) {
    if (!denumire) { return '' }

    var regiune = denumire || '';
    if (denumire.substring(0, 4) == 'JUD.') {
      regiune = denumire.substring(4, denumire.length).trim()
    }
    if (denumire.substring(0, 10) == 'MUNICIPIUL') {
      regiune = denumire.substring(10, denumire.length).trim()
    }
    return regiune
  }
}
