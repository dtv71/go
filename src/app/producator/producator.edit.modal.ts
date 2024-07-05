import { Component, Input, OnInit } from "@angular/core";
import { ApiService } from "../_services/api.service";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "../_services/authentication.service";
import { UtilsService } from "../_services/utils.service";
import { AppConfiguration } from "../_services/app-config.service";
import { EntMed, Producator } from "../_models/_numeris";
import { NgbDate, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { HttpClient } from "@angular/common/http";

@Component({
    selector: 'producator-edit-modal',
    templateUrl: 'producator.edit.modal.html',
})

export class ProducatorEditModal implements OnInit {
    constructor(public activeModal: NgbActiveModal,private apiService: ApiService, private log: ToastrService, private router: Router, private auth: AuthenticationService,
        private utils: UtilsService, private appconfig: AppConfiguration, private activatedRoute: ActivatedRoute, private http: HttpClient) { }

    @Input() id_producator
    user
    producator: Producator
    

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

        if (this.id_producator == '') {
            var d = new Date()
            this.producator = new Producator
            this.producator.id_producator = '';
            this.producator.stamp = new Date();
            this.producator.nume = '';
            this.producator.adresa = '';
            this.producator.obs = '';
            this.producator.telefon = '';
            this.producator.website = '';
            this.producator.is_inactiv = 0
            this.producator.iduser = this.auth.currentUserValue.iduser

        } else {
            this.apiService.getElementById("producator_go", "id_producator", this.id_producator, 1).then((d) => {
                this.producator = d[0]
                console.log(this.producator)
            })
        }

    }

  

    getproducatorNou() {

    }
    isDisabled() {
        return false
    }

       save() {

        this.apiService.saveProducator(this.producator).subscribe((d) => {
            this.id_producator = d;
            console.log(this.id_producator)
            this.log.success('producator salvat!');
            this.goBack()
        })

    }
    goBack() {
        //this.router.navigate(['./companie', { id_producator: this.id_producator }]);
        this.activeModal.close(this.id_producator)
    }

}



