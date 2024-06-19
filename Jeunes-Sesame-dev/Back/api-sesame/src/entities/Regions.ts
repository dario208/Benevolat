import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Etudiants } from "./Etudiants";

@Entity("regions", { schema: "SESAME" })
export class Regions {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "nom_region", nullable: true, length: 255 })
  nomRegion: string | null;

  @Column("text", { name: "path_region", nullable: true })
  pathRegion: string | null;

  @OneToMany(() => Etudiants, (etudiants) => etudiants.region)
  etudiants: Etudiants[];
}
