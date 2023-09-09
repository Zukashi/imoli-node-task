import {Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Film} from "../../Film/entities/Film.entity";

@Entity()
export class Favorite {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @ManyToMany(() => Film)
    @JoinTable()
    films:Film[]
}