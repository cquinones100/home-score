import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('categories_homes', (table) => {
    table.unique(['home_id', 'category_id']);
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('categories_homes', (table) => {
    table.dropUnique(['home_id', 'category_id']);
  })
}
