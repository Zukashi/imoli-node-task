import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Film} from "../../Film/entities/Film.entity";

@Entity()
export class Favorite {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    name: string;

    @ManyToMany(() => Film)
    @JoinTable()
    films:Film[]
}