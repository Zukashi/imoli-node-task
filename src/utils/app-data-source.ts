import { DataSource } from "typeorm"

export const myDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "",
    database: "imoli",
    entities: ["src/entity/*.ts"],
    logging: true,
    synchronize: true,
})