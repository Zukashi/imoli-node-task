import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Film} from "../Film/entities/Film.entity";

@Entity()
export class Favorite {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @ManyToMany(() => Film, { cascade: true })
    @JoinTable()
    films: Film[];
}