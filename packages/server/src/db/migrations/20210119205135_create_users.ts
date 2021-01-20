import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.increments('user_id');
    table.string('name');
    table.string('email');
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
}

