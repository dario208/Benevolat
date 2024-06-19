import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Etudiants } from "./Etudiants";

@Entity("status_professionnels", { schema: "SESAME" })
export class StatusProfessionnels {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "description", nullable: true, length: 255 })
  description: string | null;

  @OneToMany(() => Etudiants, (etudiants) => etudiants.status)
  etudiants: Etudiants[];
}
