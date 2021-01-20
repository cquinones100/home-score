import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('homes', (table) => {
    table.increments('home_id');
    table.string('address');
    table.string('url');
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('homes');
}

