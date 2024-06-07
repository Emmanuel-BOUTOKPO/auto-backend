import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Category from './category.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Brand from './brand.js'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  
  @column()
  declare title: string

  @column()
  declare imgprod: string  

  @column()
  declare price: number

  @column()
  declare description: string  

  @column({
    prepare: (value: string[]) => JSON.stringify(value),
  })

  declare prodimgs: string[]
 

  @column()
  declare stock: number

  @column()
  declare availability: number

  @column()
  public categoryId?: number
  
  @belongsTo(() => Category)
  declare categories: BelongsTo<typeof Category>

  @column()
  public brandId?: number
  
  @belongsTo(() => Brand)
  declare brands: BelongsTo<typeof Brand>

  @column()
  declare userId: number

  @belongsTo(() => User)
  declare users: BelongsTo<typeof User>

  @hasMany(() => Product)
  declare products: HasMany<typeof Product>
 
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}