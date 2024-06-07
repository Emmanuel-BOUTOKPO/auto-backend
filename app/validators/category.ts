import vine from '@vinejs/vine'

export const cats = vine.compile(
    vine.object({
      category: vine.string().trim().minLength(4).unique(async (db, value) => {
        const cat = await db
          .from('categories')
          .where('category', value)
          .first()
        return !cat
      }),
      imgcat: vine.file({
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg', ]
      }),
    })
    
)
