import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("consultations", { schema: "SESAME" })
export class Consultations {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "description", nullable: true, length: 255 })
  description: string | null;
}
