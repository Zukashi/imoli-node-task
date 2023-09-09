import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    JoinTable,
    ManyToOne, OneToMany
} from 'typeorm';
import {Character} from "../../Character/entities/Character.entity";
import {Favorite} from "../../Favorites/entities/Favorite.entity";

@Entity()
export class Film {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    title: string;

    @Column()
    release_date: Date;

    @OneToMany(() => Character, (character) => character.film, { cascade: true })
    characters: Character[];
}