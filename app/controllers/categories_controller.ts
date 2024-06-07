import Category from '#models/category';
import { cats } from '#validators/category';
import { cuid } from '@adonisjs/core/helpers';
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app';
import { normalize, sep } from 'path';
 
export default class CategoriesController {
    catCreated = async ({request, response} : HttpContext) =>{
        const {category,imgcat} = await request.validateUsing(cats);
        await imgcat.move(app.makePath('uploads'), {
          name: `${cuid()}.${imgcat.extname}`,
        })
        const processEnv = process.env.API
        const imgprodPath = `${processEnv}uploads/${imgcat?.fileName}`;
    
        await Category.create({category:category, imgcat : imgprodPath})
        response.status(201).json({messages : 'category created successfuly !'})
    }

    getAll = async ({response} : HttpContext) =>{
        const category = await Category.all();
        response.status(200).json(category)
    }

    getOnly = async ({params, response} : HttpContext) =>{
        const {id} = params;
        const category = await Category.find(id);
        response.status(200).json(category)
    }

    updated = async ({params, request, response} : HttpContext) =>{
      try {
        const {id} = params;
        const data = request.only(['category'])
        const categories = await Category.findOrFail(id)
        categories.category = data.category;
        const imgcat = request.file('imgcat');
        const processEnv = process.env.API

        if (imgcat) {
          await imgcat.move(app.makePath('uploads'), {
            name: `${cuid()}.${imgcat.extname}`
          })
          if (imgcat.filePath) {
            categories.imgcat = `${processEnv}uploads/${imgcat?.fileName}`;
          }
        }
        await categories.save()
        
        response.status(201).json({messages : 'category updated sucesfully'})
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
    
      
    deleted = async ({params, response} : HttpContext) =>{
        const {id} = params;
        const cat = await Category.findByOrFail('id', id);
        await cat.delete()
        response.status(201).json({message : 'category deleted sucesfully'})

    }
}