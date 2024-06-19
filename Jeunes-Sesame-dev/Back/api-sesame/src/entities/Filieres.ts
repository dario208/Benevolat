import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Etudiants } from "./Etudiants";
import { DomaineCompetences } from "./DomaineCompetences";

@Index("fk_domaine_id_filieres", ["domaineId"], {})
@Entity("filieres", { schema: "SESAME" })
export class Filieres {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "nom_filiere", nullable: true, length: 255 })
  nomFiliere: string | null;

  @Column("int", { name: "domaine_id" })
  domaineId: number;

  @OneToMany(() => Etudiants, (etudiants) => etudiants.filiere)
  etudiants: Etudiants[];

  @ManyToOne(
    () => DomaineCompetences,
    (domaineCompetences) => domaineCompetences.filieres,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "domaine_id", referencedColumnName: "id" }])
  domaine: DomaineCompetences;
}
