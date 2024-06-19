import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Etudiants } from "./Etudiants";

@Index("fk_etudiant_id_competences", ["etudiantId"], {})
@Entity("competences", { schema: "SESAME" })
export class Competences {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "nom_competence", nullable: true, length: 255 })
  nomCompetence: string | null;

  @Column("varchar", { name: "liste", nullable: true, length: 255 })
  liste: string | null;

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

  @ManyToOne(() => Etudiants, (etudiants) => etudiants.competences, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "etudiant_id", referencedColumnName: "id" }])
  etudiant: Etudiants;
}
