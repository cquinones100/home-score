import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('homes', (table) => {
    table.string('image_urls');
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('homes', (table) => {
    table.dropColumn('image_urls');
  })
}

