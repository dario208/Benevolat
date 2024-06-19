import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Etudiants } from "./Etudiants";
import { Filieres } from "./Filieres";

@Entity("domaine_competences", { schema: "SESAME" })
export class DomaineCompetences {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "nom_domaine", nullable: true, length: 255 })
  nomDomaine: string | null;

  @OneToMany(() => Etudiants, (etudiants) => etudiants.domaine)
  etudiants: Etudiants[];

  @OneToMany(() => Filieres, (filieres) => filieres.domaine)
  filieres: Filieres[];
}
