import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    JoinTable,
    ManyToOne
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

    @ManyToMany(() => Character, (character) => character.films, { cascade: true })
    @JoinTable()
    characters: Character[];

    @ManyToOne(() => Favorite, (favorite) => favorite.films, { cascade: true })
    favorite: Favorite;
}