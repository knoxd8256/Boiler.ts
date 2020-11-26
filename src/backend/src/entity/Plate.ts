import { ObjectID } from "mongodb";
import { Column, Entity, ObjectIdColumn } from "typeorm";
import { IPlate } from "../index.d";

@Entity()
export class Plate implements IPlate{
  @ObjectIdColumn()
  _id!: ObjectID;

  @Column({length: 100})
  name!: string;

  @Column('array')
  tags!: string[];

  @Column('string')
  repo!: string;

  @Column('text')
  description!: string;

  @Column('array')
  commands!: string[];
}
