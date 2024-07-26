import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../_services/api.service';
import { AuthenticationService } from '../_services/authentication.service';
import { DialogService } from '../_services/dialog.service';
import { AgGrid, ColDef, Renderers } from '../controls';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-setaritext',
  templateUrl: './setaritext.component.html',
  styleUrl: './setaritext.component.css'
})
export class SetaritextComponent implements OnInit {
  constructor(private api: ApiService, private router: Router, private activatedRoute: ActivatedRoute,
    private auth: AuthenticationService, private dialog: DialogService, private log: ToastrService) { }

  setaritext

  ngOnInit(): void {
    this.getSetari()


  }

  getSetari() {
    this.api.getElementById('setari_go', 'idset', 1, 0).then((d) => {
      this.setaritext = d[0]
      console.log(this.setaritext)
    })
  }

  save() {
    this.api.saveInsert(4, this.setaritext).subscribe((d) => {
      this.log.success('Setarile au fost salvate')
      this.getSetari()
    })
  }

  cancel() {
    this.getSetari()
  }
}
