import { Component, OnInit } from "@angular/core";
import { ApiService } from "../_services/api.service";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "../_services/authentication.service";
import { UtilsService } from "../_services/utils.service";
import { AppConfiguration } from "../_services/app-config.service";
import { Contact, Followup } from "../_models/_numeris";
import { NgbDate } from "@ng-bootstrap/ng-bootstrap";
import { DialogService } from "../_services/dialog.service";
import { CompanieEditModal } from "../companie/companie.edit.modal";

@Component({
    selector: 'contact-edit',
    templateUrl: './contact.edit.html',
})

export class ContactEdit implements OnInit {
    constructor(private apiService: ApiService, private log: ToastrService, private router: Router, private auth: AuthenticationService,
        private utils: UtilsService, private appconfig: AppConfiguration, private activatedRoute: ActivatedRoute,
        private dialog: DialogService) { }

    id_contact
    user
    contact: Contact
    tipcontact
    dataReminder
    isReminder: boolean
    followup: Followup
    text_followup
    listatitlu

    colFunctie = [
        { property: "nume", class: "col-12" },
    ]
    colUnitate = [
        { property: "nume", class: "col-8" },
        { property: "cui", class: "col-4" }
    ]

    colJudet = [
        { property: "judet", class: "col-12" },
    ]
    colLocalitate = [
        { property: "localitate", class: "col-12" },
    ]

    ngOnInit() {
        //localStorage.setItem('curentUrl', this.router.url)
        this.auth.getUserLogat.emit(this.auth.currentUserValue)
        this.user = this.auth.currentUserValue
        this.id_contact = this.activatedRoute.snapshot.paramMap.get('id_contact') || "";
        this.getListaTitlu()

        if (this.id_contact == '') {
            var d = new Date()
            this.contact = new Contact
            this.contact.id_contact = '';
            this.contact.data_contact = new Date();
            this.contact.idspec_med = '';
            this.contact.ent_med_contact = '';
            this.contact.nume_contact = '';
            this.contact.prenume_contact = '';
            this.contact.numeprenume = '';
            this.contact.loc_contact = '';
            this.contact.jud_contact = '';
            this.contact.str_contact = '';
            this.contact.nr_contact = '';
            this.contact.cp_contact = '';
            this.contact.tel1_contact = '';
            this.contact.tel2_contact = '';
            this.contact.fax_contact = '';
            this.contact.email_contact = '';
            this.contact.www_contact = '';
            this.contact.cui_contact = '';
            this.contact.obs_contact = '';
            this.contact.tip_contact = 0;
            this.contact.contactat_cum = '';
            this.contact.interesat_de = '';
            this.contact.id_firma = '';
            this.contact.flag_ecograf = 0;
            this.contact.set_contact_userid = '';
            this.contact.id_ent_med = '';
            this.contact.setmain = 1;
            this.contact.flag_blocat = 0;
            this.contact.iduser = this.auth.currentUserValue.iduser
            this.contact.idtitlu_contact = '';
            this.contact.idtip_contact = '';
            this.contact.idfunctie_contact = '';
            this.contact.idtip_ent_med = '';
            console.log(this.contact)
        } else {
            this.apiService.getElementById("contact_go", "id_contact", this.id_contact, 1).then((d) => {
                this.contact = d[0]
                console.log(this.contact)
            })
        }

    }

    getListaTitlu() {
        this.apiService.getNomenclatorByTip('', 'tiptitlu').then((d) => {
            this.listatitlu = d;
            console.log(this.listatitlu)
        })
    }

    listaUnitate: any = (search) => {
        const iduser = this.auth.currentUserValue.iduser
        const tipuser = this.auth.currentUserValue.isadmin == 1 ? 'admin' : 'user'
        return this.apiService.fdbGetEntMed(search, this.contact.id_ent_med || '', '', iduser, tipuser, '', '');
    }

    listatip: any = (search) => {
        return this.apiService.getNomenclatorByTip(search, 'tipcontact', this.contact.idtip_contact || '');
    }
    listafunctie: any = (search) => {
        return this.apiService.getNomenclatorByTip(search, 'tipfunctie', this.contact.idfunctie_contact || '');
    }

    listaspecmed: any = (search) => {
        return this.apiService.getSpecMed(search, this.contact.idspec_med || '');
    }

    listatipentmed: any = (search) => {
        return this.apiService.getNomenclatorByTip(search, 'tipentmed', this.contact.idtip_ent_med || '');
    }

    listajudete: any = (search) => {
        return this.apiService.getJudete(search, this.contact.jud_contact || '');
    }

    listalocalitati: any = (search) => {
        return this.apiService.getLocalitati(search, this.contact.jud_contact, this.contact.loc_contact || '');
    }

    setReminder() {
        var d = new Date()
        this.dataReminder = new NgbDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
    }

    resetLocalitate() {
        this.contact.loc_contact = ''
        this.log.warning('Daca modificati judetul, trebuie sa alegeti din nou localitatea!')
    }

    getContactNou() {

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
                        this.contact.ent_med_contact = this.utils.diacritics(firma.denumire)
                        this.contact.tel1_contact = firma.telefon
                        this.contact.jud_contact = this.utils.diacritics(this.utils.getRegiune(adresa.scod_Judet, adresa.scod_JudetAuto, adresa.ddenumire_Judet)).trim()
                        //this.contact.jud_contact =adresa.scod_JudetAuto
                        console.log('jud_contact', this.contact.jud_contact)
                        this.contact.loc_contact = this.utils.diacritics(localitate.localitate)
                        //sector: localitate.sector && localitate.sector.trim() || '',
                        //console.log(this.contact.loc_contact)
                        this.contact.str_contact = strada
                        this.contact.nr_contact = this.utils.getSetItemAdresa(adresaFull, "NR.")
                        this.contact.bl_contact = this.utils.getSetItemAdresa(adresaFull, "BL.")
                        this.contact.ap_contact = this.utils.getSetItemAdresa(adresaFull, "AP.")
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

    addUnitate() {
        this.dialog.custom(CompanieEditModal, { id_ent_med: '' }, { size: 'xl', backdrop: false }).result.then((id_ent_med_nou) => {
            this.contact.id_ent_med = id_ent_med_nou
        })
    }
    getDateContact() {
        this.apiService.getElementById("entmed_go", 'id_ent_med', this.contact.id_ent_med, 1).then((d)=>{
            console.log(d)
            if (d[0]){
                const em = d[0]
                this.contact.jud_contact = em.jud
                this.contact.loc_contact = em.loc
                this.contact.str_contact=em.strada
                this.contact.bl_contact=em.bloc
                this.contact.nr_contact=em.numar
                this.contact.cp_contact=em.cp
                this.contact.cui_contact=em.cui
                this.contact.tel1_contact=em.tel1
                this.contact.tel2_contact=em.tel2
                this.contact.email_contact=em.email
                this.contact.www_contact=em.site
            }
        })

    }
    save() {
        if (this.isReminder) {
            if (this.dataReminder && this.text_followup) {
                this.apiService.saveContact(this.contact).subscribe((d) => {
                    this.id_contact = d;
                    this.log.success('Salvat');
                    this.followup = new Followup
                    this.followup.idfollowup = '';
                    this.followup.data_followup = new Date;
                    this.followup.text_followup = this.text_followup;
                    this.followup.data_reminder = this.utils.arrToDateStr(this.dataReminder);
                    this.followup.tip_followup = 'contact';
                    this.followup.iduser = this.auth.currentUserValue.iduser;
                    this.apiService.saveFollowUp(this.followup).subscribe((idnou) => {
                        this.log.info('Reminder Follow-up salvat')
                        this.goBack()
                    })
                })
            } else {
                this.log.error('Alegeti data reminder si text follow-up!')
            }
        } else {
            this.apiService.saveContact(this.contact).subscribe((d) => {
                this.id_contact = d;
                console.log(this.id_contact)
                this.log.success('Contact salvat!');
                this.goBack()
            })
        }

    }
    goBack() {
        this.router.navigate(['./contact', { id_contact: this.id_contact }]);
    }

}



