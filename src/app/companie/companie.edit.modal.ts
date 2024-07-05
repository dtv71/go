import { Component, Input, OnInit } from "@angular/core";
import { ApiService } from "../_services/api.service";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "../_services/authentication.service";
import { UtilsService } from "../_services/utils.service";
import { AppConfiguration } from "../_services/app-config.service";
import { EntMed } from "../_models/_numeris";
import { NgbDate, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { HttpClient } from "@angular/common/http";

@Component({
    selector: 'companie-edit-modal',
    templateUrl: 'companie.edit.modal.html',
})

export class CompanieEditModal implements OnInit {
    constructor(public activeModal: NgbActiveModal,private apiService: ApiService, private log: ToastrService, private router: Router, private auth: AuthenticationService,
        private utils: UtilsService, private appconfig: AppConfiguration, private activatedRoute: ActivatedRoute, private http: HttpClient) { }

    @Input() id_ent_med
    user
    ent_med: EntMed
    tipent_med
    dataReminder

    colFunctie = [
        { property: "nume", class: "col-12" },
    ]
    colJudet = [
        { property: "judet", class: "col-12" },
    ]
    colLocalitate = [
        { property: "localitate", class: "col-12" },
    ]

    ngOnInit() {
        this.auth.getUserLogat.emit(this.auth.currentUserValue)
        this.user = this.auth.currentUserValue

        if (this.id_ent_med == '') {
            var d = new Date()
            this.ent_med = new EntMed
            this.ent_med.id_ent_med = '';
            this.ent_med.stamp = new Date();
            this.ent_med.nume = '';
            this.ent_med.idtara = '';
            this.ent_med.idjud = '';
            this.ent_med.idloc = '';
            this.ent_med.strada = '';
            this.ent_med.numar = '';
            this.ent_med.bloc = '';
            this.ent_med.ap = '';
            this.ent_med.cp = '';
            this.ent_med.tel1 = '';
            this.ent_med.tel2 = '';
            this.ent_med.email = '';
            this.ent_med.idtip_ent_med = '';
            this.ent_med.cui = '';
            this.ent_med.jud = '';
            this.ent_med.loc = '';
            this.ent_med.iduser = this.auth.currentUserValue.iduser

        } else {
            this.apiService.getElementById("entmed_go", "id_ent_med", this.id_ent_med, 1).then((d) => {
                this.ent_med = d[0]
                console.log(this.ent_med)
            })
        }

    }





    listatipentmed: any = (search) => {
        return this.apiService.getNomenclatorByTip(search, 'tipentmed', this.ent_med.idtip_ent_med || '');
    }

    listajudete: any = (search) => {
        return this.apiService.getJudete(search, this.ent_med.jud || '');
    }

    listalocalitati: any = (search) => {
        return this.apiService.getLocalitati(search, this.ent_med.jud, this.ent_med.loc || '');
    }

    setReminder() {
        var d = new Date()
        this.dataReminder = new NgbDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
    }

    resetLocalitate() {
        this.ent_med.loc = ''
        this.log.warning('Daca modificati judetul, trebuie sa alegeti din nou localitatea!')
    }

    getent_medNou() {

    }
    isDisabled() {
        return false
    }

    getDateAnaf(cui) {
        if (cui.toString().length != 13) {
            cui = cui.toString().replace(/[^0-9]+/g, '');
            console.log(cui)
            this.apiService.getDateFirmaAnaf(cui).subscribe({
                next: (res: any) => {
                    console.log(res.found[0])
                    if (res.found[0] && res.found[0] != '') {
                        console.log(res.found[0])
                        const firma = res.found[0].date_generale
                        const adresa = res.found[0].adresa_domiciliu_fiscal
                        const adresaFull = (adresa.ddetalii_Adresa || firma.adresa).split(', ');
                        const localitate = this.utils.getLocalitate(adresa.dcod_Localitate, adresa.ddenumire_Localitate);
                        var strada = this.utils.getSetItemAdresaStr(adresa.ddenumire_Strada, "STR.");
                        strada = this.utils.getSetItemAdresaStr(strada, "BLD.");
                        console.log(adresa.ddenumire_Judet)
                        this.ent_med.nume = this.utils.diacritics(firma.denumire)
                        this.ent_med.nr_reg_com = firma.nrRegCom
                        this.ent_med.tel1 = firma.telefon
                        this.ent_med.cp = firma.codPostal
                        this.ent_med.jud = this.utils.diacritics(this.utils.getRegiune(adresa.scod_Judet, adresa.scod_JudetAuto, adresa.ddenumire_Judet)).trim()
                        //this.ent_med.jud_ent_med =adresa.scod_JudetAuto
                        console.log('jud_ent_med', this.ent_med.jud)
                        this.ent_med.loc = this.utils.diacritics(localitate.localitate)
                        //sector: localitate.sector && localitate.sector.trim() || '',
                        //console.log(this.ent_med.loc_ent_med)
                        this.ent_med.strada = strada
                        this.ent_med.numar = this.utils.getSetItemAdresa(adresaFull, "NR.")
                        this.ent_med.bloc = this.utils.getSetItemAdresa(adresaFull, "BL.")
                        this.ent_med.ap = this.utils.getSetItemAdresa(adresaFull, "AP.")
                        /*
                        nume: diacritics(cuiAnaf['date_generale'].denumire),
                        atrf: cuiAnaf['inregistrare_scop_Tva'].scpTVA ? 'RO' : '',
                        regiune: diacritics(getRegiune(adresa.dcod_Judet, adresa.dcod_JudetAuto, adresa.ddenumire_Judet)),
                        localitate: diacritics(localitate.localitate),
                        sector: localitate.sector && localitate.sector.trim() || '',
                        strada: diacritics(strada),
                        numar: getSetItemAdresa(adresaFull, "NR."),
                        bloc: getSetItemAdresa(adresaFull, "BL."),
                        scara: getSetItemAdresa(adresaFull, "SC."),
                        etaj: getSetItemAdresa(adresaFull, "ET."),
                        ap: getSetItemAdresa(adresaFull, "AP."),
                        */
                    } else {
                        this.log.warning('CUI-ul nu este valid')
                    }

                },
                error: (error) => {
                    console.error(error);
                    this.log.warning(error.message || 'Serviciul ANAF nu functioneaza!');
                }

            })
        }

    }

    save() {

        this.apiService.saveEntMed(this.ent_med).subscribe((d) => {
            this.id_ent_med = d;
            console.log(this.id_ent_med)
            this.log.success('ent_med salvat!');
            this.goBack()
        })

    }
    goBack() {
        //this.router.navigate(['./companie', { id_ent_med: this.id_ent_med }]);
        this.activeModal.close(this.id_ent_med)
    }

}



