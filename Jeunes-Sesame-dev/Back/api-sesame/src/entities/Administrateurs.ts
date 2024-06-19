import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Emplois } from "./Emplois";

@Entity("administrateurs", { schema: "SESAME" })
export class Administrateurs {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "nom", nullable: true, length: 255 })
  nom: string | null;

  @Column("varchar", { name: "prenoms", length: 255 })
  prenoms: string;

  @Column("varchar", { name: "email", length: 255 })
  email: string;

  @Column("varchar", { name: "fonction", length: 50, default: () => "'admin'" })
  fonction: string;

  @Column("varchar", { name: "description", nullable: true, length: 255 })
  description: string | null;

  @Column("varchar", { name: "profil_path", nullable: true, length: 255 })
  profilPath: string | null;

  @Column("text", { 
    name: "password", 
    nullable: true,
    default: () => "SHA2('admin_Jeunes-S', 256)"  
  })
  password: string | null;

  @Column("text", { name: "refresh_token", nullable: true })
  refreshToken: string | null;

  @Column("datetime", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("datetime", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @Column("int", { name: "actif", default: () => "'1'" })
  actif: number;

  @OneToMany(() => Emplois, (emplois) => emplois.admnistrateur)
  emplois: Emplois[];
}
