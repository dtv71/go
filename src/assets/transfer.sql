/*
UPDATE users_ro set useridold=userid, iduser=CONCAT('U_', UCASE(REPLACE( UUID(),'-', '')));
UPDATE users_ro SET pwdclar=pwd;
UPDATE users_ro SET isinactiv=1 WHERE flag_activ=0;

INSERT INTO specmed_go(spec_med, lunainceput)
SELECT DISTINCT 
	spec_med_contact 
	,200001
	FROM contact3_ro WHERE spec_med_contact !='';
UPDATE specmed_go SET idspec_med=	CONCAT('SM_', UCASE(REPLACE( UUID(),'-', '')));

UPDATE  contact_go c
LEFT JOIN
        specmed_go s
ON      c.spec_med_contact = s.spec_med 
SET     c.idspec_med=s.idspec_med


select c.*, CONCAT(c.nume_contact, ' ', c.prenume_contact) AS numeprenume
	    FROM contact_go c WHERE 1 ORDER by c.nume_contact, c.prenume_contact

UPDATE  contact_go c
LEFT JOIN
        users_ro s
ON      c.set_contact_userid = s.userid
SET     c.iduser=s.iduser

-- NOMENCLATOARE	    
INSERT INTO nomenclator_go(oldid,`status`,tipstatus,idstatus,iduser,color,lunainceput,lunasfarsit)
VALUES
-- (1,'Inalta','tipprioritate',CONCAT('TP_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#FFFFFF',200001,999912),
-- (2,'Medie','tipprioritate',CONCAT('TP_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#FFFFFF',200001,999912),
-- (3,'Scazuta','tipprioritate',CONCAT('TP_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#FFFFFF',200001,999912)
-- (1,'InCurs','tipstatus',CONCAT('TS_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#FFFFFF',200001,999912),
-- (2,'Finalizat','tipstatus',CONCAT('TS_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#FFFFFF',200001,999912),
-- (3,'Anulat','tipstatus',CONCAT('TS_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#FFFFFF',200001,999912),
-- (0,'Programare vizita','tipactivitate',CONCAT('TA_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#FFFFFF',200001,999912),
-- (1,'Vizita','tipactivitate',CONCAT('TA_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#000066',200001,999912),
-- (2,'Demo','tipactivitate',CONCAT('TA_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#FF6600',200001,999912),
-- (3,'Prezentare','tipactivitate',CONCAT('TA_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#003300',200001,999912),
-- (4,'Expozitie','tipactivitate',CONCAT('TA_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#FF3399',200001,999912),
-- (5,'Program administrativ','tipactivitate',CONCAT('TA_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#CC9900',200001,999912),
-- (6,'Concediu','tipactivitate',CONCAT('TA_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#000000',200001,999912),
-- (7,'Concediu medical','tipactivitate',CONCAT('TA_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#f00000',200001,999912),
-- (8,'Zi libera','tipactivitate',CONCAT('TA_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#009900',200001,999912),
-- (9,'Instalare','tipactivitate',CONCAT('TA_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#0000CC',200001,999912),
-- (10,'Training','tipactivitate',CONCAT('TA_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#04B404',200001,999912),
-- (11,'Service','tipactivitate',CONCAT('TA_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#8A0808',200001,999912),
-- (1,'-','tipinteres',CONCAT('TI_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#FFFFFF',200001,999912),
-- (2,'A','tipinteres',CONCAT('TI_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#FFFFFF',200001,999912),
-- (3,'B','tipinteres',CONCAT('TI_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#FFFFFF',200001,999912),
-- (4,'C','tipinteres',CONCAT('TI_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#FFFFFF',200001,999912),
-- (1,'Lead','tipcontact',CONCAT('TC_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#FFFFFF',200001,999912),
-- (2,'Contact','tipcontact',CONCAT('TC_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#FFFFFF',200001,999912),
-- (3,'Account','tipcontact',CONCAT('TC_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#FFFFFF',200001,999912),
-- (0,'-','tipentmed',CONCAT('TE_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#FFFFFF',200001,999912),
-- (1,'Spital de stat','tipentmed',CONCAT('TE_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#FFFFFF',200001,999912),
-- (2,'Clinica privata','tipentmed',CONCAT('TE_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#FFFFFF',200001,999912),
-- (3,'Cabinet medical privat/MF','tipentmed',CONCAT('TE_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#FFFFFF',200001,999912),
-- (1,'InCurs','tipstatustask',CONCAT('TST_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#FFFFFF',200001,999912),
-- (2,'Finalizat','tipstatustask',CONCAT('TST_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#FFFFFF',200001,999912),
-- (3,'Depasit','tipstatustask',CONCAT('TST_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#FFFFFF',200001,999912),
-- (1,'Produs','tipoferta',CONCAT('TO_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#FFFFFF',200001,999912),
-- (2,'Lista','tipoferta',CONCAT('TO_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#FFFFFF',200001,999912),
-- (0,'-','tiptitlu',CONCAT('TT_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#FFFFFF',200001,999912),
-- (1,'Dl.','tiptitlu',CONCAT('TT_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#FFFFFF',200001,999912),
-- (2,'D-na.','tiptitlu',CONCAT('TT_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#FFFFFF',200001,999912),
-- (3,'D-ra.','tiptitlu',CONCAT('TT_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#FFFFFF',200001,999912),
-- (0,'-.','tipfunctie',CONCAT('TF_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#FFFFFF',200001,999912),
-- (1,'Dr.','tipfunctie',CONCAT('TF_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#FFFFFF',200001,999912),
-- (2,'Prof.','tipfunctie',CONCAT('TF_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#FFFFFF',200001,999912),
-- (3,'Sef sectie','tipfunctie',CONCAT('TF_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#FFFFFF',200001,999912),
-- (4,'Director','tipfunctie',CONCAT('TF_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#FFFFFF',200001,999912),
-- (5,'Director medical','tipfunctie',CONCAT('TF_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#FFFFFF',200001,999912),
-- (6,'Director economic','tipfunctie',CONCAT('TF_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#FFFFFF',200001,999912),
-- (7,'Manager','tipfunctie',CONCAT('TF_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#FFFFFF',200001,999912),
-- (8,'Sef serviciu aprovizionare','tipfunctie',CONCAT('TF_', UCASE(REPLACE( UUID(),'-', ''))),'U_75C5E5B82EDB47568A35D2629FBBC97B','#FFFFFF',200001,999912)

-- TIP TITLU
UPDATE  contact_go c
LEFT JOIN
        nomenclator_go n
ON      c.titlu_contact = n.oldid AND n.tipstatus='tiptitlu'
SET     c.idtitlu_contact=n.idstatus
-- FUNCTIE CONTACT
UPDATE  contact_go c
LEFT JOIN
        nomenclator_go n
ON      c.functie_contact = n.oldid AND n.tipstatus='tipfunctie'
SET     c.idfunctie_contact=n.idstatus

-- TIP CONTACT
UPDATE  contact_go c
LEFT JOIN
        nomenclator_go n
ON      c.tip_contact = n.oldid AND n.tipstatus='tipcontact'
SET     c.idtip_contact=n.idstatus

INSERT INTO entmed_go (nume, idtara, loc, jud, strada, numar, cp, cui, idtip_ent_med, iduser)
			SELECT DISTINCT ent_med_contact, 'RO', loc_contact, jud_contact, str_contact, nr_contact, cp_contact, cui_contact, idtip_ent_med, iduser FROM contact_go;

UPDATE entmed_go set id_ent_med=CONCAT('E_', UCASE(REPLACE( UUID(),'-', ''))) where id_ent_med IS NULL;
DELETE FROM entmed_go WHERE nume='-';
DELETE FROM entmed_go WHERE nume='';


UPDATE contact_go SET oldidentmed=id_ent_med
UPDATE contact_go c SET c.id_ent_med = (SELECT id_ent_med FROM entmed_go e WHERE e.nume=c.ent_med_contact AND e.jud=c.jud_contact AND e.loc=c.loc_contact AND e.strada=c.str_contact AND e.numar=c.nr_contact LIMIT 1)


SELECT e.*,
te.Nume AS tipentitatemedicala,
u.unume,
u.uprenume,
CONCAT(u.unume,
' ',
u.uprenume)as utilizator,
u.email as usermail,
u.isadmin,
u.datauser,
u.issupervizor,
u.isinactiv 
FROM entmed_go e 
LEFT JOIN nomenclator_go te ON e.idtip_ent_med=te.idstatus AND te.tipstatus='tipentmed'
LEFT JOIN users_ro u ON e.iduser=u.iduser WHERE 1 AND e.iduser='U_75C5E5B82EDB47568A35D2629FBBC97B'ORDER by e.nume ASC

-- PRODUCATOR
UPDATE  producator_go c
LEFT JOIN
        users_ro s
ON      c.userid = s.userid
SET     c.iduser=s.iduser

update nomenclator_go set isCLient=0
-- activitate
UPDATE  activitate_go c
LEFT JOIN
        users_ro s
ON      c.userid = s.userid
SET     c.iduser=s.iduser


update activitate_go set df=data_followup

UPDATE users_ro u set u.iduser=(select a.iduser FROM activitate_go a WHERE a.userid=u.useridold limit 1)

update cat_go set id_categorie=CONCAT('CAT_', UCASE(REPLACE( UUID(),'-', '')));
update cat_go set stamp=NOW()
update cat_go set is_inactiv=1 where flag_activ=0

-- PRODUSE
UPDATE  prod_go c
LEFT JOIN
        users_ro s
ON      c.userid = s.userid
SET     c.iduser=s.iduser

UPDATE  prod_go c
LEFT JOIN
        cat_go s
ON      c.id_cat = s.idcat
SET     c.id_categorie=s.id_categorie

update prod_go set stamp=NOW()
update prod_go set is_inactiv=1 where flag_activ=0

-- FOTO

update foto_go set url_media = CONCAT('http://localhost/go.srv/media/prod/',id_prod, '[', nr_foto, '].jpg')
update foto_go set id_foto=CONCAT('PRD_', UCASE(REPLACE( UUID(),'-', '')));

--accessorii
update accesoriu_go set id_accesoriu=CONCAT('AC_', UCASE(REPLACE( UUID(),'-', ''))), staMP=now();

-- TIP TVA
update tiptva_go set id_tiptva=CONCAT('TVA_', UCASE(REPLACE( UUID(),'-', ''))), staMP=now();

--VALUTA
update valuta_go set id_valuta=CONCAT('VAL_', UCASE(REPLACE( UUID(),'-', ''))), staMP=now();

-- oferta_go
UPDATE  oferta_go c
LEFT JOIN
        users_ro s
ON      c.userid = s.userid
SET     c.iduser=s.iduser

UPDATE  oferta_go c
LEFT JOIN
        nomenclator_go s
ON      c.tip_oferta = s.oldid AND s.tipstatus='tipoferta'
SET     c.idtip_oferta=s.idstatus

UPDATE  oferta_go c
LEFT JOIN
        tiptva_go s
ON      c.procent_tva = s.procent
SET     c.id_tiptva=s.id_tiptva

UPDATE  oferta_go c
LEFT JOIN
        valuta_go s
ON      c.valutaof = s.nume
SET     c.id_valuta=s.id_valuta


UPDATE  oferta_go c
LEFT JOIN
        nomenclator_go s
ON      c.status = s.nume AND s.tipstatus='tipstatus'
SET     c.idtip_status=s.idstatus

UPDATE  oferta_go c
LEFT JOIN
        nomenclator_go s
ON      c.priority = s.nume AND s.tipstatus='tipprioritate'
SET     c.idtip_prioritate=s.idstatus

*/


SELECT
			o.id 
		   ,o.id_ofprod 
		   ,o.nume 
		   ,o.client 
		   ,o.id_project 
		   ,o.priority 
		   ,o.data_priority 
		   ,o.status 
		   ,o.data_status 
		   ,o.followup 
		   ,o.pretvanzareof 
		   ,o.pretftvaof 
		   ,o.procentdiscountof 
		   ,o.valdiscountof 
		   ,o.pretoferta 
		   ,o.modplata 
		   ,o.termen_garantie 
		   ,o.termen_livrare 
		   ,o.instalare 
		   ,o.valabilitate_oferta 
		   ,o.tech_prodof 
		   ,o.optional_prodof 
		   ,o.obsof 
		   ,o.noteof 
		   ,o.data_oferta 
		   ,o.userid 
		   ,o.tip_oferta 
		   ,o.valutaof 
		   ,o.id_tiptva
		   ,o.id_valuta
		   ,o.idtip_oferta
		   ,o.data_reminder
		   ,o.data_demo
		   ,o.procent_tva
		   ,o.iduser
		   ,o.idtip_oferta
		   ,o.idtip_status
		   ,o.idtip_prioritate
		   ,c.id_contact 
		   ,c.data_contact 
		   ,c.idspec_med 
		   ,c.nume_contact 
		   ,c.prenume_contact 
		   ,c.numeprenume 
		   ,c.loc_contact 
		   ,c.jud_contact 
		   ,c.str_contact 
		   ,c.nr_contact 
		   ,c.cp_contact 
		   ,c.tel1_contact 
		   ,c.tel2_contact 
		   ,c.fax_contact 
		   ,c.email_contact 
		   ,c.www_contact 
		   ,c.cui_contact 
		   ,c.obs_contact 
		   ,c.tip_contact 
		   ,c.contactat_cum 
		   ,c.interesat_de 
		   ,c.id_firma 
		   ,c.flag_ecograf 
		   ,c.bl_contact 
		   ,c.set_contact_userid 
		   ,c.id_ent_med 
		   ,c.setmain 
		   ,c.flag_blocat 
		   ,c.iduser AS iduser_contact
		   ,c.idtitlu_contact 
		   ,c.idfunctie_contact 
		   ,c.idtip_contact 
		   ,c.idtip_ent_med 
		   ,c.ap_contact 
		   ,op.nume AS numeoferta
		   ,op.text_prod AS text_prod_oferta
		   ,op.pretftva
		   ,op.pretprodftva
		   ,op.bucprod
			,e.Nume AS unitate
			,CONCAT(c.nume_contact, ' ', c.prenume_contact) AS numeprenume
			,sm.nume AS spec_med 
			,tt.nume AS titlucontact
			,tc.nume AS tipcontact
			,tf.nume AS functiecontact
            ,u.unume
            ,u.uprenume
			,CONCAT(u.unume, ' ', u.uprenume) as utilizator
			,u.email
            ,u.isadmin
            ,u.datauser
            ,u.issupervizor
            ,u.isinactiv
			,tof.nume as tipoferta
			,tva.nume as tiptva
			,v.nume as valuta
			,tp.nume AS tipprioritate
			,ts.nume AS tipstatus
	    FROM oferta_go o 
		LEFT JOIN ofertaprod_go op ON o.id_ofprod=op.id_ofprod AND op.flag_main=1
		LEFT JOIN prod_go pr ON op.id_prod=pr.id_prod
		LEFT JOIN contact_go c ON o.id_contact=c.id_contact
		LEFT JOIN entmed_go e ON c.id_ent_med=e.id_ent_med
		LEFT JOIN users_ro u  ON o.iduser=u.iduser 
		LEFT JOIN specmed_go sm  ON c.idspec_med=sm.idspec_med 
		LEFT JOIN nomenclator_go tt  ON c.idtitlu_contact=tt.idstatus AND tt.tipstatus='titlucontact'
		LEFT JOIN nomenclator_go tf  ON c.idfunctie_contact=tf.idstatus AND tf.tipstatus='tipfunctie'
		LEFT JOIN nomenclator_go tc  ON c.idtip_contact=tc.idstatus AND tc.tipstatus='tipcontact' 
		LEFT JOIN nomenclator_go tof  ON o.idtip_oferta=tof.idstatus AND tof.tipstatus='tipoferta' 
		LEFT JOIN nomenclator_go tp  ON o.idtip_prioritate=tp.idstatus AND tp.tipstatus='tipprioritate' 
		LEFT JOIN nomenclator_go ts  ON o.idtip_status=ts.idstatus AND ts.tipstatus='tipstatus' 
		LEFT JOIN tiptva_go tva ON o.id_tiptva=tva.id_tiptva
		LEFT JOIN valuta_go v ON o.id_valuta=v.id_valuta