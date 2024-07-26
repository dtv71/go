import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfiguration } from './app-config.service';

@Injectable({
	providedIn: 'root'
})
export class ApiService {

	constructor(private httpClient: HttpClient, private appcfg: AppConfiguration) { }

	get PHP_API_SERVER() {
		return this.appcfg.apiUrl
	}
	// UTILS
	getElementById(tabel: string, camp: string, valoare: any, is_string: number) {
		const promise = this.httpClient.get(`${this.PHP_API_SERVER}/utils.php?op=getElementById&tabel=${tabel}&camp=${camp}&valoare=${valoare}&is_string=${is_string}`).toPromise();
		return promise.then((data) => {
			return data;
		}).catch((error) => {
			console.log("Promise rejected with " + JSON.stringify(error));
		});
	}

	getElementByWhere(tabel, where) {
		const promise = this.httpClient.get(`${this.PHP_API_SERVER}/utils.php?op=getElementByWhere&tabel=${tabel}&where=${where}`).toPromise();
		return promise.then((data) => {
			return data;
		}).catch((error) => {
			console.log("Promise rejected with " + JSON.stringify(error));
		});
	}


	deleteElementById(tabel, camp, id, isString) {
		return this.httpClient.get(`${this.PHP_API_SERVER}/utils.php?op=deleteElementById&tabel=${tabel}&camp=${camp}&id=${id}&isstring=${isString}`)
	}

	getNomenclatorByTip(searchText, tipstatus, idstatus?, lunasfarsit?, ord?, limit?) {
		if (!lunasfarsit) lunasfarsit = 999912
		if (!ord) ord = ''
		if (!limit) limit = ''
		if (!idstatus) idstatus = ''
		const promise = this.httpClient.get(
			`${this.PHP_API_SERVER}/nomenclator.php?
					op=getNomenclatorByTip
					&searchText=${searchText}
					&idstatus=${idstatus}
					&tipstatus=${tipstatus}
					&lunasfarsit=${lunasfarsit}
					&ord=${ord}
					&limit=${limit}`
		).toPromise();
		return promise.then((data) => {
			return data;
		}).catch((error) => {
			console.log("Promise rejected with " + JSON.stringify(error));
		});
	}

	getSpecMed(searchText, idspec_med?, lunasfarsit?, ord?, limit?) {
		if (!lunasfarsit) lunasfarsit = 999912
		if (!ord) ord = ''
		if (!limit) limit = ''
		const promise = this.httpClient.get(
			`${this.PHP_API_SERVER}/nomenclator.php?
					op=getSpecMed
					&searchText=${searchText}
					&idspec_med=${idspec_med || ''}
					&lunasfarsit=${lunasfarsit}
					&ord=${ord}
					&limit=${limit}`
		).toPromise();
		return promise.then((data) => {
			return data;
		}).catch((error) => {
			console.log("Promise rejected with " + JSON.stringify(error));
		});
	}

	getJudete(searchText, judet?) {
		if (!judet) judet = ''
		const promise = this.httpClient.get(
			`${this.PHP_API_SERVER}/nomenclator.php?
					op=getJudete
					&searchText=${searchText}
					&judet=${judet}`
		).toPromise();
		return promise.then((data) => {
			return data;
		}).catch((error) => {
			console.log("Promise rejected with " + JSON.stringify(error));
		});
	}

	getLocalitati(searchText, judet, localitate?) {
		if (!localitate) localitate = ''
		const promise = this.httpClient.get(
			`${this.PHP_API_SERVER}/nomenclator.php?
					op=getLocalitati
					&searchText=${searchText}
					&judet=${judet}
					&localitate=${localitate}`
		).toPromise();
		return promise.then((data) => {
			return data;
		}).catch((error) => {
			console.log("Promise rejected with " + JSON.stringify(error));
		});
	}

	fdbGetContacte(searchText, id_contact, lunasfarsit?, ord?, limit?) {
		if (!lunasfarsit) lunasfarsit = 999912
		if (!ord) ord = ''
		if (!limit) limit = ''
		const promise = this.httpClient.get(
			`${this.PHP_API_SERVER}/dbcontact.php?
					op=fdbGetContacte
					&searchText=${searchText}
					&id_contact=${id_contact}
					&lunasfarsit=${lunasfarsit}
					&ord=${ord}
					&limit=${limit}`
		).toPromise();
		return promise.then((data) => {
			return data;
		}).catch((error) => {
			console.log("Promise rejected with " + JSON.stringify(error));
		});

	}

	fdbGetActivitateForContact(searchText, id_contact, iduser, tipuser) {
		const u = window.btoa(iduser)
		const t = window.btoa(tipuser)
		const promise = this.httpClient.get(
			`${this.PHP_API_SERVER}/dbcontact.php?
					op=fdbGetActivitateForContact
					&searchText=${searchText}
					&id_contact=${id_contact}
					&u=${u}
					&t=${t}`
		).toPromise();
		return promise.then((data) => {
			return data;
		}).catch((error) => {
			console.log("Promise rejected with " + JSON.stringify(error));
		});

	}

	fdbGetActivitate(searchText, id_contact, idtip_activitate, iduser, tipuser, ord, limit) {
		const u = window.btoa(iduser)
		const t = window.btoa(tipuser)
		const promise = this.httpClient.get(
			`${this.PHP_API_SERVER}/dbcontact.php?
						op=fdbGetActivitate
						&searchText=${searchText}
						&id_contact=${id_contact}
						&idtip_activitate=${idtip_activitate}
						&u=${u}
						&t=${t}
						&ord=${ord}
						&limit=${limit}`
		).toPromise();
		return promise.then((data) => {
			return data;
		}).catch((error) => {
			console.log("Promise rejected with " + JSON.stringify(error));
		});
	}

	fdbGetEntMed(searchText, id_ent_med, idtip_ent_med, iduser, tipuser, ord, limit) {
		const u = window.btoa(iduser)
		const t = window.btoa(tipuser)
		const promise = this.httpClient.get(
			`${this.PHP_API_SERVER}/dbcontact.php?
							op=fdbGetEntMed
							&searchText=${searchText}
							&id_ent_med=${id_ent_med}
							&idtip_ent_med=${idtip_ent_med}
							&u=${u}
							&t=${t}
							&ord=${ord}
							&limit=${limit}`
		).toPromise();
		return promise.then((data) => {
			return data;
		}).catch((error) => {
			console.log("Promise rejected with " + JSON.stringify(error));
		});
	}

	getProducator(searchText, id_producator) {
		if (!id_producator) id_producator = ''
		const promise = this.httpClient.get(
			`${this.PHP_API_SERVER}/nomenclator.php?
					op=getProducator
					&searchText=${searchText}
					&id_producator=${id_producator}`
		).toPromise();
		return promise.then((data) => {
			return data;
		}).catch((error) => {
			console.log("Promise rejected with " + JSON.stringify(error));
		});
	}

	fdbGetCategoriiProduse(searchText, id_categorie?, ord?, limit?) {
		if (!ord) ord = ''
		if (!limit) limit = ''
		const promise = this.httpClient.get(
			`${this.PHP_API_SERVER}/dbproduse.php?
						op=fdbGetCategoriiProduse
						&searchText=${searchText}
						&id_categorie=${id_categorie || "" }
						&ord=${ord}
						&limit=${limit}`
		).toPromise();
		return promise.then((data) => {
			return data;
		}).catch((error) => {
			console.log("Promise rejected with " + JSON.stringify(error));
		});

	}

	fdbGetProduse(searchText?, id_categorie?, id_prod?, ord?, limit?) {
		const promise = this.httpClient.get(
			`${this.PHP_API_SERVER}/dbproduse.php?
						op=fdbGetProduse
						&searchText=${searchText || ""}
						&id_categorie=${id_categorie || ""}
						&id_prod=${id_prod || ""}
						&ord=${ord || ""}
						&limit=${limit || ""}`
		).toPromise();
		return promise.then((data) => {
			return data;
		}).catch((error) => {
			console.log("Promise rejected with " + JSON.stringify(error));
		});

	}

	fdbGetAccesoriiForProdus(searchText?, id_prod?) {
		const promise = this.httpClient.get(
			`${this.PHP_API_SERVER}/dbproduse.php?
						op=fdbGetAccesoriiForProdus
						&searchText=${searchText || ""}
						&id_prod=${id_prod || ""}`
		).toPromise();
		return promise.then((data) => {
			return data;
		}).catch((error) => {
			console.log("Promise rejected with " + JSON.stringify(error));
		});

	}

	fdbGetProduseForAccesorii(id_prod, id_categorie?, searchText?) {
		const promise = this.httpClient.get(
			`${this.PHP_API_SERVER}/dbproduse.php?
						op=fdbGetProduseForAccesorii
						&id_prod=${id_prod}
						&id_categorie=${id_categorie || ""}
						&searchText=${searchText || ""}`
		).toPromise();
		return promise.then((data) => {
			return data;
		}).catch((error) => {
			console.log("Promise rejected with " + JSON.stringify(error));
		});

	}

	getTipTva(searchText?, id_tiptva?, is_curent?) {
		const promise = this.httpClient.get(
			`${this.PHP_API_SERVER}/dbcomun.php?
						op=getTipTva
						&searchText=${searchText || ""}
						&id_tiptva=${id_tiptva || ""}
						&is_curent=${is_curent || 0}`
		).toPromise();
		return promise.then((data) => {
			return data;
		}).catch((error) => {
			console.log("Promise rejected with " + JSON.stringify(error));
		});
	}

	getValuta(searchText?, id_valuta?, is_curent?) {
		const promise = this.httpClient.get(
			`${this.PHP_API_SERVER}/dbcomun.php?
						op=getValuta
						&searchText=${searchText || ""}
						&id_valuta=${id_valuta || ""}
						&is_curent=${is_curent || 0}`
		).toPromise();
		return promise.then((data) => {
			return data;
		}).catch((error) => {
			console.log("Promise rejected with " + JSON.stringify(error));
		});
	}



	getOferte(searchText?, id_ofprod?, id_contact?, ord?, limit?) {
		const promise = this.httpClient.get(
			`${this.PHP_API_SERVER}/dboferta.php?
						op=fdbGetOferte
						&searchText=${searchText || ""}
						&id_ofprod=${id_ofprod || ""}
						&id_contact=${id_contact || ""}
						&ord=${ord || ""}
						&limit=${limit || " 1000 "}
						`
		).toPromise();
		return promise.then((data) => {
			return data;
		}).catch((error) => {
			console.log("Promise rejected with " + JSON.stringify(error));
		});
	}

	getDateFirmaAnaf(cui) {
		return this.httpClient.get(`${this.PHP_API_SERVER}/mfinante.php?op=getDateFirmaAnaf&cui=${cui}`)
	}


	saveContact(contact) {
		return this.httpClient.post(`${this.PHP_API_SERVER}/dbcontact.php?op=saveContact`, contact)
	}

	saveFollowUp(followup) {
		return this.httpClient.post(`${this.PHP_API_SERVER}/dbcomun.php?op=saveFollowUp`, followup)
	}
	saveNomenclator(nomenclator) {
		return this.httpClient.post(`${this.PHP_API_SERVER}/nomenclator.php?op=saveNomenclator`, nomenclator)
	}
	saveSpecMed(nomenclator) {
		return this.httpClient.post(`${this.PHP_API_SERVER}/nomenclator.php?op=saveSpecMed`, nomenclator)
	}
	saveEntMed(ent_med) {
		return this.httpClient.post(`${this.PHP_API_SERVER}/nomenclator.php?op=saveEntMed`, ent_med)
	}
	saveProducator(producator) {
		return this.httpClient.post(`${this.PHP_API_SERVER}/nomenclator.php?op=saveProducator`, producator)
	}
	saveActivitate(activitate) {
		return this.httpClient.post(`${this.PHP_API_SERVER}/dbcontact.php?op=saveActivitate`, activitate)
	}

	saveProdCat(categorie) {
		return this.httpClient.post(`${this.PHP_API_SERVER}/dbproduse.php?op=saveProdCat`, categorie)
	}

	saveStatus(dataStatus) {
		return this.httpClient.post(`${this.PHP_API_SERVER}/dbcomun.php?op=saveStatus`, dataStatus)
	}

	setCurent(dataStatus) {
		return this.httpClient.post(`${this.PHP_API_SERVER}/dbcomun.php?op=setCurent`, dataStatus)
	}

	saveInsert(idtable, data) {
		return this.httpClient.post(`${this.PHP_API_SERVER}/dbcomun.php?opi=${idtable}`, data)
	}

	fdbSaveAccesorii(id_prod, listaIds) {
		return this.httpClient.post(`${this.PHP_API_SERVER}/dbproduse.php?op=fdbSaveAccesorii`,
			{
				id_prod: id_prod,
				listaIds: listaIds,
			})
	}
}
