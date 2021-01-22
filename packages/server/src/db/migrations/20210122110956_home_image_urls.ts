import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('home_image_urls', (table) => {
    table.increments('home_image_url_id');
    table.bigInteger('home_id').references('home_id').inTable('homes');
    table.string('url');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('home_image_urls');
}
