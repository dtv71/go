import { Component, Input, OnInit } from "@angular/core";
import { ApiService } from "../_services/api.service";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "../_services/authentication.service";
import { UtilsService } from "../_services/utils.service";
import { AppConfiguration } from "../_services/app-config.service";
import { EntMed, Prodcat } from "../_models/_numeris";
import { NgbDate, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { HttpClient } from "@angular/common/http";

@Component({
    selector: 'prodcat-edit-modal',
    templateUrl: 'prodcat.edit.modal.html',
})

export class ProdcatEditModal implements OnInit {
    constructor(public activeModal: NgbActiveModal, private apiService: ApiService, private log: ToastrService, private router: Router, private auth: AuthenticationService,
        private utils: UtilsService, private appconfig: AppConfiguration, private activatedRoute: ActivatedRoute, private http: HttpClient) { }

    @Input() id_categorie
    user
    prodcat: Prodcat

    ngOnInit() {
        this.auth.getUserLogat.emit(this.auth.currentUserValue)
        this.user = this.auth.currentUserValue

        if (this.id_categorie == '') {
            var d = new Date()
            this.prodcat = new Prodcat
            this.prodcat.id_categorie = '';
            this.prodcat.stamp = new Date();
            this.prodcat.nume = '';
            this.prodcat.text_cat = '';
            this.prodcat.is_inactiv = 1
            this.prodcat.iduser = this.auth.currentUserValue.iduser

        } else {
            this.apiService.getElementById("cat_go", "id_categorie", this.id_categorie, 1).then((d) => {
                this.prodcat = d[0]
                console.log(this.prodcat)
            })
        }

    }



    isDisabled() {
        return false
    }

    save() {
        this.apiService.saveProdCat(this.prodcat).subscribe((d) => {
            this.id_categorie = d;
            console.log(this.id_categorie)
            this.log.success('Categorie salvata!');
            this.goBack()
        })

    }
    goBack() {
        this.activeModal.close(this.id_categorie)
    }

}



