import {Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Film} from "../../Film/entities/Film.entity";

@Entity()
export class Character {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @ManyToOne(() => Film, (film) => film.characters)
    film: Film;
}