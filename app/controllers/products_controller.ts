import Category from '#models/category'
import Product from '#models/product'
import {postValidator } from '#validators/product'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { normalize, sep } from 'path'

export default class ProductsController {
  /**
   * Display a list of resource
   */
    async getAlls({response} : HttpContext) { 
      const products = await Product.query()
      .preload('categories')
      .preload('brands')
      .preload('users')
      .exec();
    response.status(200).json(products)
}

// async index({ response }: HttpContext) {
//   try {
//     // Récupérer les catégories distinctes avec leur nom et leur photo
//     const categories = await Category.query().select('category', 'category', 'imgcat').distinctOn('category')

//     if (categories.length === 0) {
//       return response.status(404).json({ message: 'Category not found!' })
//     }

//     // Initialiser l'objet pour stocker les produits par catégorie
//     const productByCategory: { [key: string]: { category: string, imgcat: string, products: Product[] } } = {}
//     const categoryNames = categories.map(category => category.category)

//     // Fonction pour récupérer les produits par catégorie
//     const fetchBooksForCategory = async (categoryName: string) => {
//       const category = await Category
//         .query()
//         .where('category', categoryName)
//         .preload('products', (postsQuery) => {
//           postsQuery.limit(4)
//         })
//         .first()

//       if (category && category.products) {
//         const categoryData = categories.find(cat => cat.category === categoryName)
//         productByCategory[categoryName] = {
//           category: categoryData!.category,
//           imgcat: categoryData!.imgcat,
//           products: category.products
//         }
//       }
//     }

//     // Exécuter la fonction pour chaque catégorie
//     await Promise.all(categoryNames.map(fetchBooksForCategory))

//     // Retourner les catégories avec leurs produits
//     return response.json(productByCategory)
//   } catch (error) {
//     console.error('Erreur lors de la récupération des catégories et des livres:', error)
//     return response.status(500).send(error)
//   }
// }

 
  async index({ response }: HttpContext) {
    try {
      const categories = await Category.query().distinct('category')

      if (categories.length === 0) {
        return response.status(404).json({ message: 'Category not found!' })
      }

      const productByCategory: { [key: string]: Product[] } = {}
      const categoryNames = categories.map(category => category.category)

      const fetchBooksForCategory = async (categoryName: string) => {
        const category = await Category
          .query()
          .where('category', categoryName)
          .preload('products', (postsQuery) => {
            postsQuery.limit(4)
          })
          .first()

        if (category && category.products) {
          productByCategory[categoryName] = category.products
        }
      }

      await Promise.all(categoryNames.map(fetchBooksForCategory))

      return response.json(productByCategory)
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories et des livres:', error)
      return response.status(500).send(error)
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const postId = params.id

      const post = await Product.query()
        .where('id', postId)
        .preload('categories')
        .preload('users')
        .firstOrFail()

      return response.status(200).json(post)
    } catch (error) {

      console.error('Erreur lors de la récupération du post :', error)
      return response.status(404).json({ message: 'Post non trouvé' })
    }
  }

  async showByCat({ params, response }: HttpContext) {
    const { categorie } = params
    const decodedCategory = decodeURIComponent(categorie)
    try {
    
      const category = await Category.query().where('category', decodedCategory).first()
      
      if (!category) {
        return response.status(404).json({ message: 'Category not found!' })
      }

      
      const query = Product.query()
        .where('category_id', category.id)
    
      const results = await query

      return response.json(results)
    } catch (err) {
      console.error(`Erreur lors de la récupération des posts pour la catégorie ${categorie}:`, err)
      return response.status(500).json({ error: 'Une erreur s\'est produite' })
    }
  }
  
  async showbyfiltre({request, response }: HttpContext) {
    try {

      const { minPrice, maxPrice, category, brand, availability } = request.qs()

      const query = Product.query()

      // Ajout des filtres à la requête
      if (minPrice) {
        query.andWhere('price', '>=', minPrice)
      }
      if (maxPrice) {
        query.andWhere('price', '<=', maxPrice)
      }
      if (category) {
        query.andWhere('category_id', category)
      }
      if (brand) {
        query.andWhere('brand_id', brand)
      }
      if (availability !== undefined) {
        query.andWhere('availability', availability)
      }

      query.preload('categories')
      query.preload('users')

      const post = await query.first()

      return response.status(200).json(post)
    } catch (error) {
      console.error('Erreur lors de la récupération du post :', error)
      return response.status(404).json({ message: 'Post non trouvé' })
    }
  }

  async showDispo({response }: HttpContext) {
    try {

      const product = await Product.query()
        .where('availability', '>', 0)
        .preload('categories') // Assurez-vous que ces relations sont définies dans votre modèle Product
        .preload('users')
        .preload('brands')
      
      return response.status(200).json(product)
    } catch (error) {
      console.error('Erreur lors de la récupération du produit :', error)
      return response.status(404).json({ message: 'Produit non trouvé' })
    }
  }

  /**
   * Display form to create a new record
   */

  async create({request, response}: HttpContext) {
    const {
      title,
      imgprod,
      price,
      description,
      prodimgs,
      stock,
      availability,
      categoryId,
      userId,
      brandId
    } = await request.validateUsing(postValidator);
    
    await imgprod.move(app.makePath('uploads'), {
      name: `${cuid()}.${imgprod.extname}`,
    })
    const processEnv = process.env.API
    const imgprodPath = `${processEnv}uploads/${imgprod?.fileName}`;

    const prodimgsPaths: string[] = []
    for (let file of prodimgs) {
      await file.move(app.makePath('uploads'), {
        name: `${cuid()}.${file.extname}`,
      })
      const prodimgPath = `${processEnv}uploads/${file?.fileName}`
      prodimgsPaths.push(prodimgPath)
    }

      await Product.create({
      title: title,
      imgprod: imgprodPath,
      price: price,
      description: description,
      prodimgs: prodimgsPaths,
      stock : stock,
      availability : availability,
      categoryId: categoryId,
      userId: userId,
      brandId: brandId,
    })

    return response.status(201).json({message: "Product created succefuly"})
  }

  async update({ params, request, response }: HttpContext) {
  try {
    const postId = params.id
    const data = request.only(['title', 'price', 'description', 'stock','availability', 'categoryId', 'userId', 'brandId'])
    const post = await Product.findOrFail(postId)

    post.title = data.title
    post.price = data.price
    post.description = data.description
    post.stock = data.stock
    post.availability = data.availability
    post.categoryId = data.categoryId
    post.userId = data.userId
    post.brandId = data.brandId

    const imgprod = request.file('imgprod')
    const prodimgs = request.files('prodimgs')
     const processEnv = process.env.API

    if (imgprod) {
      await imgprod.move(app.makePath('uploads'), {
        name: `${cuid()}.${imgprod.extname}`
      })
      if (imgprod.filePath) {
        post.imgprod = `${processEnv}uploads/${imgprod?.fileName}`;
      }
    }

    if (prodimgs && prodimgs.length > 0) {
      const prodimgPaths: string[] = []
      for (const prodimg of prodimgs) {
        await prodimg.move(app.makePath('uploads'), {
          name: `${cuid()}.${prodimg.extname}`,
        })
        if (prodimg.filePath) {
          const prodimgPath = `${processEnv}uploads/${prodimg?.fileName}`
          prodimgPaths.push(prodimgPath)
        }
      }
      post.prodimgs = prodimgPaths
    }
    await post.save()

    return response.status(200).json(post)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du post :', error)
    return response.status(500).json({ message: 'Erreur lors de la mise à jour du post' })
  }
  }

  async imgeStore({ request, response } : HttpContext) {
    const filePath = request.param('*').join(sep)
    const normalizedPath = normalize(filePath)
    const PATH_TRAVERSAL_REGEX = /(?:^|[\\/])\.\.(?:[\\/]|$)/

    if (PATH_TRAVERSAL_REGEX.test(normalizedPath)) {
      return response.badRequest('Malformed path')
    }
  
    const absolutePath = app.makePath('uploads', normalizedPath)
    return response.download(absolutePath)
  }

  async destroy({ params, response }: HttpContext) {
  try {
    const postId = params.id
    const post = await Product.findOrFail(postId)
    await post.delete()
    return response.status(200).json({ message: 'product supprimé avec succès' })
  } catch (error) {
    console.error('Erreur lors de la suppression du post :', error)
    return response.status(500).json({ message: 'Erreur lors de la suppression du post' })
  }
  }
}