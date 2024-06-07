import vine from '@vinejs/vine'

export const createBrand = vine.compile(
    vine.object({
      brand: vine.string().trim().minLength(4).unique(async (db, value) => {
        const brand = await db
          .from('brands')
          .where('brand', value)
          .first()
        return !brand
      }),
    })
    
)

export const updatedBrands = vine.compile(
  vine.object({
    brand: vine.string().trim().minLength(4).unique(async (db, value,field) => {
      const brand = await db
        .from('brands')
        .whereNot('id', field.data.params.id)
        .where('brand', value)
        .first()
      return !brand
    }),
  })
  
)