import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("categorie_emplois", { schema: "SESAME" })
export class CategorieEmplois {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "categorie", nullable: true, length: 255 })
  categorie: string | null;
}
