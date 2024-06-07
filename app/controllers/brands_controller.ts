import Brand from '#models/brand';
import { createBrand, updatedBrands } from '#validators/brand';
import stringHelpers from '@adonisjs/core/helpers/string';
import type { HttpContext } from '@adonisjs/core/http'

export default class BrandsController {
  /**
   * Display a list of resource
   */
  async index({response}: HttpContext) {
    const brand = await Brand.all();
    response.status(200).json(brand)
}

  /**
   * Display form to create a new record
   */
  async create({request, response}: HttpContext) {
    const {brand} = await request.validateUsing(createBrand);
        await Brand.create({brand})
        response.status(201).json({messages : 'Brand created successfuly !'})

  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
      const {id} = params;
        const brand = await Brand.find(id);
        response.status(200).json(brand)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({params, request, response}: HttpContext) {
    const {id} = params;
        const {brand} = await request.validateUsing(updatedBrands);
        const cat = await Brand.findByOrFail('id', id);
        const brands = cat.brand !== brand && stringHelpers.slug(brand)
        if(brands) cat.merge({brand}).save();
        
        response.status(201).json({messages : 'Brand updated successfuly'})
   
  }

  /**
   * Delete record
   */
  async destroy({params, response}: HttpContext) {
    const {id} = params;
    const brand = await Brand.findByOrFail('id', id);
    await brand.delete()
    response.status(201).json({message : 'Brand deleted successfuly'})

  }
}