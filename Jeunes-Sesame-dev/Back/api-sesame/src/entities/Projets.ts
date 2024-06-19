import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Etudiants } from "./Etudiants";

@Index("fk_etudiant_id_projets", ["etudiantId"], {})
@Entity("projets", { schema: "SESAME" })
export class Projets {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "nom", length: 255 })
  nom: string;

  @Column("varchar", { name: "description", nullable: true, length: 255 })
  description: string | null;

  @Column("text", { name: "lien", nullable: true })
  lien: string | null;

  @Column("text", { name: "img", nullable: true })
  img: string | null;

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

  @ManyToOne(() => Etudiants, (etudiants) => etudiants.projets, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "etudiant_id", referencedColumnName: "id" }])
  etudiant: Etudiants;
}
