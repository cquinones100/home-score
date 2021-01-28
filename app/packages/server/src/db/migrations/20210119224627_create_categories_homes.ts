import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('categories_homes', (table) => {
    table.bigInteger('home_id').references('home_id').inTable('homes');
    table.bigInteger('category_id').references('category_id').inTable('categories');
    table.integer('value');
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('categories_homes');
}

