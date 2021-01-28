import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('users', (table) => {
    table.string('password');
    table.unique(['name']);
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('users', (table) => {
    table.dropColumn('password');
    table.dropUnique(['name']);
  });
}
