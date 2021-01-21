import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('categories', (table) => {
    table.unique(['name', 'user_id']);
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('categories', (table) => {
    table.dropUnique(['name', 'user_id']);
  })
}

