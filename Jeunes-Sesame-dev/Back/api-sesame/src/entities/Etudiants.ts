import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Competences } from "./Competences";
import { Distinctions } from "./Distinctions";
import { Projets } from "./Projets";
import { Experiences } from "./Experiences";
import { Formations } from "./Formations";
import { DomaineCompetences } from "./DomaineCompetences";
import { Regions } from "./Regions";
import { StatusProfessionnels } from "./StatusProfessionnels";
import { Promotions } from "./Promotions";
import { Filieres } from "./Filieres";

@Index("fk_status_id_etudiants", ["statusId"], {})
@Index("fk_filiere_id_etudiants", ["filiereId"], {})
@Index("fk_domaine_id_etudiants", ["domaineId"], {})
@Index("fk_region_id_etudiants", ["regionId"], {})
@Index("fk_promotion_id_etudiants", ["promotionId"], {})
@Entity("etudiants", { schema: "SESAME" })
export class Etudiants {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "nom", length: 255 })
  nom: string;

  @Column("varchar", { name: "prenoms", length: 255 })
  prenoms: string;

  @Column("varchar", {
    name: "fonction",
    length: 50,
    default: () => "'etudiants'",
  })
  fonction: string;

  @Column("varchar", { name: "ecole", nullable: true, length: 255 })
  ecole: string | null;

  @Column("varchar", { name: "niveau_etude", nullable: true, length: 255 })
  niveauEtude: string | null;

  @Column("varchar", { name: "tel1", nullable: true, length: 20 })
  tel1: string | null;

  @Column("varchar", { name: "tel2", nullable: true, length: 20 })
  tel2: string | null;

  @Column("varchar", { name: "email", length: 255 })
  email: string;

  @Column("varchar", { name: "linkedin", nullable: true, length: 255 })
  linkedin: string | null;

  @Column("varchar", { name: "facebook", nullable: true, length: 255 })
  facebook: string | null;

  @Column("varchar", { name: "lien_cv", nullable: true, length: 255 })
  lienCv: string | null;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("text", { 
    name: "password", 
    nullable: true,
    default: () => "SHA2('Jeunes-S', 256)"
  })
  password: string | null;

  @Column("text", { name: "refresh_token", nullable: true })
  refreshToken: string | null;

  @Column("int", { name: "region_id", nullable: true })
  regionId: number | null;

  @Column("int", { name: "domaine_id", nullable: true })
  domaineId: number | number;

  @Column("int", { name: "filiere_id", nullable: true })
  filiereId: number | null;

  @Column("int", { name: "status_id", nullable: true })
  statusId: number | null;

  @Column("datetime", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("datetime", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @Column("int", { name: "promotion_id", nullable: true })
  promotionId: number | number;

  @Column("varchar", { name: "pdp", nullable: true, length: 255 })
  pdp: string | null;

  @Column("varchar", { name: "pdc", nullable: true, length: 255 })
  pdc: string | null;

  @Column("int", { name: "popularity", default: () => "'0'" })
  popularity: number;

  @Column("int", { name: "actif", default: () => "'1'" })
  actif: number;

  @OneToMany(() => Competences, (competences) => competences.etudiant)
  competences: Competences[];

  @OneToMany(() => Distinctions, (distinctions) => distinctions.etudiant)
  distinctions: Distinctions[];

  @OneToMany(() => Projets, (projets) => projets.etudiant)
  projets: Projets[];

  @OneToMany(() => Experiences, (experiences) => experiences.etudiant)
  experiences: Experiences[];

  @OneToMany(() => Formations, (formations) => formations.etudiant)
  formations: Formations[];

  @ManyToOne(
    () => DomaineCompetences,
    (domaineCompetences) => domaineCompetences.etudiants,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "domaine_id", referencedColumnName: "id" }])
  domaine: DomaineCompetences;

  @ManyToOne(() => Regions, (regions) => regions.etudiants, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "region_id", referencedColumnName: "id" }])
  region: Regions;

  @ManyToOne(
    () => StatusProfessionnels,
    (statusProfessionnels) => statusProfessionnels.etudiants,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "status_id", referencedColumnName: "id" }])
  status: StatusProfessionnels;

  @ManyToOne(() => Promotions, (promotions) => promotions.etudiants, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "promotion_id", referencedColumnName: "id" }])
  promotion: Promotions;

  @ManyToOne(() => Filieres, (filieres) => filieres.etudiants, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "filiere_id", referencedColumnName: "id" }])
  filiere: Filieres;
}
