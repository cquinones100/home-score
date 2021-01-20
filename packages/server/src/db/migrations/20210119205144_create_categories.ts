import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('categories', (table) => {
    table.increments('category_id');
    table.bigInteger('user_id').references('user_id').inTable('users');
    table.float('weight').defaultTo(1);
    table.string('name');
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('categories');
}

