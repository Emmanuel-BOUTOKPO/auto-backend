import vine from '@vinejs/vine'

export const postValidator = vine.compile(
    vine.object({
        title: vine.string().trim(),
        imgprod: vine.file({
            size: '2mb',
            extnames: ['jpg', 'png', 'jpeg']
          }),
        price: vine.number(),
        description: vine.string().escape(),
        prodimgs: vine.array(
            vine.file({
              size: '2mb',
              extnames: ['jpg', 'png', 'jpeg']
            })
          ),
          stock: vine.number(),
          availability: vine.number(),

        categoryId: vine.number(),
        userId: vine.number(),
        brandId: vine.number(),
    })
    
)
