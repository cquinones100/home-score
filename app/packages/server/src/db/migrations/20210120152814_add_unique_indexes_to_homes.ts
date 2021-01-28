import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('homes', (table) => {
    table.unique(['address']);
    table.unique(['url']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('homes', (table) => {
    table.dropUnique(['address']);
    table.dropUnique(['url']);
  })
}
