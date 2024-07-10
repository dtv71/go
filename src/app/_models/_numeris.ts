export class Contact {
    idc: number;
    id_contact: string;
    data_contact: Date | string;
    idspec_med: string;
    ent_med_contact: string;
    nume_contact: string;
    prenume_contact: string;
    numeprenume: string;
    loc_contact: string;
    jud_contact: string;
    str_contact: string;
    nr_contact: string;
    cp_contact: string;
    tel1_contact: string;
    tel2_contact: string;
    fax_contact: string;
    email_contact: string;
    www_contact: string;
    cui_contact: string;
    obs_contact: string;
    tip_contact: number;
    contactat_cum: string;
    interesat_de: string;
    id_firma: string;
    flag_ecograf: number;
    set_contact_userid: string;
    id_ent_med: string;
    setmain: number;
    flag_blocat: number;
    iduser: string;
    idtitlu_contact: string;
    idtip_contact: string;
    idfunctie_contact: string;
    idtip_ent_med: string;
    bl_contact: string;
    ap_contact: string;
}

export class Activitate {
    ida: number;
    stamp: Date | string;
    id_activitate: string;
    id_contact: string;
    data_activitate: Date | string;
    obs: string;
    data_followup: Date | string;
    flag_oferta: number;
    data_last_modif: Date | string;
    tema: string;
    flag_mednews_advertising: number;
    flag_mednews_article: number;
    flag_mednews_account: number;
    flag_mednews_subscription: number;
    eval_point: number;
    flag_catalog: number;
    flag_prospect_ecografie: number;
    flag_prospect_radiologie: number;
    flag_prospect_ati: number;
    flag_prospect_altele: number;
    flag1: number;
    flag2: number;
    flag3: number;
    iduser: string;
    idtip_activitate: string;
    idtip_interes: string;
}

export class Followup {
    id: number;
    idfollowup: string;
    data_followup: Date | string;
    text_followup: string;
    data_reminder: Date | string;
    tip_followup: string;
    iduser: string;
}

export class SpecialitateMedicala {
    id: number;
    idspec_med: string;
    stamp: Date;
    nume: string;
    lunainceput: number;
    lunasfarsit: number;
}

export class Nomenclator {
    id: number;
    stamp: Date;
    iduser: string;
    idstatus: string;
    nume: string;
    color: string;
    tipstatus: string;
    lunainceput: number;
    lunasfarsit: number;
    oldid: string;

}

export class EntMed {
    id: number;
    stamp: Date;
    id_ent_med: string;
    nume: string;
    idtara: string;
    idloc: string;
    idjud: string;
    strada: string;
    numar: string;
    bloc: string;
    ap: string;
    cp: string;
    tel1: string;
    tel2: string;
    email: string;
    site: string;
    idtip_ent_med: string;
    iduser: string;
    cui: string;
    jud: string;
    loc: string;
    nr_reg_com: string;
}

export class Producator {
    idprd: number;
    id_producator: string;
    nume: string;
    adresa: string;
    telefon: string;
    email: string;
    website: string;
    obs: string;
    is_inactiv: number;
    iduser: string;
    stamp: Date;
}

export class Prodcat {
    idcat: number;
    stamp: Date;
    id_categorie: string;
    nume: string;
    text_cat: string;
    ord: number;
    is_inactiv: number;
    iduser: string;
}

export class Produse {
    id_prod: string; 
    nume_prod: string; 
    text_prod: string; 
    optional: string; 
    tech_prod: string; 
    link_prod: string; 
    flag_news: number; 
    ord: number; 
    pretftva: number; 
    valtva: number; 
    pretvanzare: number; 
    valuta: number; 
    procentdiscount: number; 
    valdiscount: number; 
    pretcudiscount: number; 
    obs: string; 
    id_producator: string; 
    procent_tva_prod: number; 
    id_categorie: string; 
    iduser: string; 
    stamp: Date;
    is_inactiv: number;
    id_tiptva: string;
}

