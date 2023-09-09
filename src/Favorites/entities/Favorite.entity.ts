import {Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Film} from "../../Film/entities/Film.entity";

@Entity()
export class Favorite {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;


}