import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';

import { DialogService } from '../../services/dialog.service';
//import { DataService } from '../../services/DataService';
//import { UserService } from '../../services/UserService';

@Component({
    selector: 'dialog-file',
    templateUrl: './dialog.file.html',
})
export class FileViewer implements OnInit {
    constructor(private activeModal: NgbActiveModal,
        private log: ToastrService,
        private dialog: DialogService) { }

    estimated: string;
    isUploading: boolean;
    allowedFiletype = '.pdf,.txt,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png,.tip,.gif,.ppt,.pptx,.rar,.zip,.7zip';

    files: any[] = [];
    uploader: FileUploader[] = [];
    @Input() canUpload: boolean;
    @Input() private entitate: string;
    @Input() private idEntitate: number;

    ngOnInit() { this.getFisiere() }

    getFisiere() {
        // const query = Query.comun.getFisiereAtasate(this.entitate, this.idEntitate);
        // this.data.executeQuery<metadata.sief.Fisier>(query, Tables.sief.Fisier).then(data => {
        //     data.forEach(item => item['tip'] = item.nume.substring(item.nume.lastIndexOf(".") + 1));
        //     this.files = data;
        // })
    }
    download(file) {
        const port = (window.location.port ? ':' + window.location.port : '');
        const url = `${window.location.protocol}//${window.location.hostname}${port}`;
        window.open(`${url}/download/${file.cale}/`, "_blank");
    }
    delete(item) {
        // this.dialog.confirm({ message: `Doriti sa stergeti fisierul\n${item.nume} ?` }).then(() => {
        //     item.entityAspect.setDeleted();
        //     this.data.saveChanges(item, true).then(() => {
        //         this.files.splice(this.files.indexOf(item), 1)
        //     })
        // })
    }

    uploadFiles(event) {
        if (!this.canUpload) {
            this.log.info('Nu se pot incarca fisiere!')
        } else {
            const up = new FileUploader({
                url: '/file/upload',
                additionalParameter: { entitate: this.entitate, idEntitate: this.idEntitate },
                autoUpload: true, removeAfterUpload: true
                // allowedFileType: this.allowedFiletype.split(','),
            });
            // this.uploader.queue.forEach(item => item.upload()); // !autoupload
            up.addToQueue(event.srcElement.files);
            up.response.subscribe(
                (res) => this.getFisiere(),
                (err) => this.log.error(err),
                () => this.uploader.splice(this.uploader.indexOf(up), 1)
            );
            this.uploader.push(up);
        }

        // this.uploader.uploadItem(file);
        // uploader.response.subscribe(res => this.response = res);

        // this.file.upload(file).then((result) => {
        //     this.log.success("File upload success.");
        //     this.files.unshift(result);
        //     this.isUploading = false;
        // }, (error) => {
        //     this.isUploading = false;
        //     this.log.error(error.message || error.data, null, error);
        // })
    }

    getFileType(item) {
        switch (item.tip) {
            case 'txt': return 'fal fa-file-text';
            case 'pdf': return 'fal fa-file-pdf';
            case 'xls': case 'xls': return 'fal fa-file-excel';
            case 'doc': case 'docx': return 'fal fa-file-word';
            case 'ppt': case 'pptx': return 'fal fa-file-powerpoint';
            case 'jpg': case 'gif': case 'tip': case 'png': return 'fal fa-file-image';
            case 'rar': case 'zip': case '7zip': return 'fal fa-file-archive';
            default: 'fal fa-file';
        }
    }

    close() {
        this.unsubscribe();
        this.activeModal.close(this.files.length)
    }
    unsubscribe() {
        while (this.uploader.length) {
            this.uploader.shift().response.unsubscribe()
        }
    }
}