import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Etudiants } from "./Etudiants";

@Index("fk_etudiant_id_formations", ["etudiantId"], {})
@Entity("formations", { schema: "SESAME" })
export class Formations {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "nom_formation", nullable: true, length: 255 })
  nomFormation: string | null;

  @Column("varchar", { name: "lieu", nullable: true, length: 255 })
  lieu: string | null;

  @Column("varchar", { name: "annee", nullable: true, length: 255 })
  annee: string | null;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("int", { name: "etudiant_id" })
  etudiantId: number;

  @Column("datetime", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("datetime", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @ManyToOne(() => Etudiants, (etudiants) => etudiants.formations, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "etudiant_id", referencedColumnName: "id" }])
  etudiant: Etudiants;
}
