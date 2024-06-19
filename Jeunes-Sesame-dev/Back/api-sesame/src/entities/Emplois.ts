import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Administrateurs } from "./Administrateurs";

@Index("fk_administrateur_id_emplois", ["admnistrateurId"], {})
@Entity("emplois", { schema: "SESAME" })
export class Emplois {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "nom_emploi", nullable: true, length: 255 })
  nomEmploi: string | null;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("datetime", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("datetime", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @Column("int", { name: "admnistrateur_id" })
  admnistrateurId: number;

  @Column("varchar", { name: "categorie_id", length: 11 })
  categorieId: string;

  @Column("int", { name: "actif", default: () => "'1'" })
  actif: number;

  @ManyToOne(
    () => Administrateurs,
    (administrateurs) => administrateurs.emplois,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "admnistrateur_id", referencedColumnName: "id" }])
  admnistrateur: Administrateurs;
}
