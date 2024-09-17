export class GoodEntity {
  id!: string;
  category!: string;
  fullname!: string;
  description!: string;
  priceCents!: number;
  createdAt!: Date;

  constructor(entity: GoodEntity) {
    Object.assign(this, entity);
  }
}
