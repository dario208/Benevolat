import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Etudiants } from "./Etudiants";

@Index("fk_etudiant_id_experiences", ["etudiantId"], {})
@Entity("experiences", { schema: "SESAME" })
export class Experiences {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

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

  @Column("varchar", { name: "nom_experience", nullable: true, length: 255 })
  nomExperience: string | null;

  @ManyToOne(() => Etudiants, (etudiants) => etudiants.experiences, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "etudiant_id", referencedColumnName: "id" }])
  etudiant: Etudiants;
}
