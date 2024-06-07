import vine from '@vinejs/vine'


export const signupValidator = vine.compile(
    vine.object({
      fullName: vine.string().trim().minLength(6),
      email: vine.string().trim().minLength(4).unique(async (db, value) => {
        const user = await db
          .from('users')
          .where('email', value)
          .first()
        return !user
      }),
      password: vine.string().trim().escape().minLength(8)
    })
    
  )

  export const signinValidator = vine.compile(
    vine.object({
      email: vine.string().trim().minLength(4).email(),
      password: vine.string().trim().escape().minLength(8)
    })
  )