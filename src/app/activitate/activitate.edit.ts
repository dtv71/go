import { Component, OnInit } from "@angular/core";
import { ApiService } from "../_services/api.service";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "../_services/authentication.service";
import { UtilsService } from "../_services/utils.service";
import { AppConfiguration } from "../_services/app-config.service";
import { Contact, Activitate, Followup } from "../_models/_numeris";
import { NgbDate } from "@ng-bootstrap/ng-bootstrap";
import { DialogService } from "../_services/dialog.service";
import { CompanieEditModal } from "../companie/companie.edit.modal";

@Component({
    selector: 'activitate-edit',
    templateUrl: './activitate.edit.html',
})

export class ActivitateEdit implements OnInit {
    constructor(private apiService: ApiService, private log: ToastrService, private router: Router, private auth: AuthenticationService,
        private utils: UtilsService, private appconfig: AppConfiguration, private activatedRoute: ActivatedRoute,
        private dialog: DialogService) { }

    idtip_activitate
    tipActivitate
    activitate: Activitate
    id_contact
    contact
    tipcontact
    dataFollowup
    dataActivitate
    isReminder: boolean
    followup: Followup
    text_followup
    listatipactivitate
    listatipinteres
    user
    isClient: boolean

    colContact = [
        { property: "numeprenume", class: "col-4" },
        { property: "loc_contact", class: "col-4" },
        { property: "jud_contact", class: "col-4" },
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
        this.idtip_activitate = this.activatedRoute.snapshot.paramMap.get('idtip_activitate') || "";
        this.getTipActivitate()
        this.getListaTipNivelInteres()

        this.dataActivitate = this.utils.ddateToArr(new Date())
        //this.dataFollowup = this.utils.ddateToArr(new Date(1970, 0, 1))

        this.activitate = new Activitate
        this.activitate.stamp = new Date()
        this.activitate.id_activitate = ''
        this.activitate.idtip_activitate = this.idtip_activitate
        this.activitate.id_contact = this.id_contact;
        this.activitate.data_activitate = new Date();
        this.activitate.obs = ''
        this.activitate.data_followup = '';
        this.activitate.flag_oferta
        this.activitate.data_last_modif = new Date();
        this.activitate.tema = ''
        this.activitate.flag_mednews_advertising = 0
        this.activitate.flag_mednews_article = 0
        this.activitate.flag_mednews_account = 0
        this.activitate.flag_mednews_subscription = 0
        this.activitate.eval_point = 0
        this.activitate.flag_catalog = 0
        this.activitate.flag_prospect_ecografie = 0
        this.activitate.flag_prospect_radiologie = 0
        this.activitate.flag_prospect_ati = 0
        this.activitate.flag_prospect_altele = 0
        this.activitate.flag1 = 0
        this.activitate.flag2 = 0
        this.activitate.flag3 = 0
        this.activitate.iduser = this.user.iduser
        this.activitate.idtip_interes = ''


    }

    setCheck(tip) {

        if (this.activitate[tip] == 0 || this.activitate[tip] == undefined || this.activitate[tip] == false) {
            this.activitate[tip] = 1
        } else {
            this.activitate[tip] = 0
        }
        //console.log(tip, this.activitate[tip])
    }


    getTipActivitate() {
        this.apiService.getElementById('nomenclator_go', 'idstatus', this.idtip_activitate, 1).then((d) => {
            this.tipActivitate = d[0];
            this.isClient = this.tipActivitate.isClient
            //console.log(d)

        })
    }

    getListaTipNivelInteres() {
        this.apiService.getNomenclatorByTip('', 'tipinteres').then((d) => {
            this.listatipinteres = d;
        })
    }


    getContact() {
        this.apiService.fdbGetContacte('', this.activitate.id_contact).then((d) => {
            this.contact = d[0]
        })
    }

    listaContact: any = (search) => {
        const iduser = this.auth.currentUserValue.iduser
        const tipuser = this.auth.currentUserValue.isadmin == 1 ? 'admin' : 'user'
        return this.apiService.fdbGetContacte(search, this.id_contact || '', 0, '', 1000);
    }



    goContactNou() {
        // const url = this.router.serializeUrl(
        //     this.router.createUrlTree(['contactnou/'])
        //   );
        //const url = this.router.serializeUrl(this.router.createUrlTree(['/contact.edit'], { queryParams: { id_contact: '' } }));
        //   this.log.warning(url)
        // window.open(url, '_blank');
        //this.router.navigate(['./contact.edit',   '' ]);

        //this.router.navigate(['./contact.edit',   '' ]).then(result => {  window.open( `http://localhost:4200/#/contact.edit/`, '_blank'); });

        //window.open("../contact/contact-edit/", '_blank');
    }

    isDisabled() {
        let disableSalvare: boolean = false
        let a = this.activitate
        if (!a.data_activitate) disableSalvare = true
        if (this.isClient && !a.id_contact) disableSalvare = true
        if (this.isClient && !a.idtip_interes) disableSalvare = true
        if (this.isClient && (a.flag_prospect_altele && !a.flag_prospect_ati && !a.flag_prospect_ecografie && !a.flag_prospect_radiologie)) disableSalvare = true

        return disableSalvare
    }



    addUnitate() {
        this.dialog.custom(CompanieEditModal, { id_ent_med: '' }, { size: 'xl', backdrop: false }).result.then((id_ent_med_nou) => {
            this.contact.id_ent_med = id_ent_med_nou
        })
    }
    getDateContact() {
        this.apiService.getElementById("entmed_go", 'id_ent_med', this.contact.id_ent_med, 1).then((d) => {
            console.log(d)
            if (d[0]) {
                const em = d[0]
                this.contact.jud_contact = em.jud
                this.contact.loc_contact = em.loc
                this.contact.str_contact = em.strada
                this.contact.bl_contact = em.bloc
                this.contact.nr_contact = em.numar
                this.contact.cp_contact = em.cp
                this.contact.cui_contact = em.cui
                this.contact.tel1_contact = em.tel1
                this.contact.tel2_contact = em.tel2
                this.contact.email_contact = em.email
                this.contact.www_contact = em.site
            }
        })

    }
    save() {
        console.log(this.dataFollowup)
        this.activitate.data_activitate = this.utils.arrToDateStr(this.dataActivitate);
        this.activitate.data_followup = this.utils.arrToDateStr(this.dataFollowup)
        console.log(this.activitate.data_activitate)
        this.apiService.saveActivitate(this.activitate).subscribe((d) => {
            this.log.success('Contact salvat!');
            this.goBack(d)
        })

    }
    goBack(id_activitate?) {
        this.router.navigate(['./activitate', { id_activitate: id_activitate || '' }]);
    }

}



