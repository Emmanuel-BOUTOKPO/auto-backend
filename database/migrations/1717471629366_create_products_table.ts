import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title', 95).notNullable()
      table.string('imgprod', 255).notNullable() 
      table.decimal('price', 12, 2).notNullable() 
      table.text('description', 'mediumtext ').notNullable() 
      table.json('prodimgs').notNullable()
      table.integer('stock', 100).notNullable()
      table.integer('availability', 100).notNullable()
      table.integer('category_id').unsigned().references('categories.id').onDelete('CASCADE')    
      table.integer('brand_id').unsigned().references('brands.id').onDelete('CASCADE')    
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE') 

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}