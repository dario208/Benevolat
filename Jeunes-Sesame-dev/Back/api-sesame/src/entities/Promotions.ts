import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Etudiants } from "./Etudiants";

@Entity("promotions", { schema: "SESAME" })
export class Promotions {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "annee_promotion" })
  anneePromotion: number;

  @Column("varchar", { name: "nom_promotion", nullable: true, length: 255 })
  nomPromotion: string | null;

  @OneToMany(() => Etudiants, (etudiants) => etudiants.promotion)
  etudiants: Etudiants[];
}
