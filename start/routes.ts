/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import BrandsController from '#controllers/brands_controller'
import CategoriesController from '#controllers/categories_controller'
import ProductsController from '#controllers/products_controller'
import UsersController from '#controllers/users_controller'
import router from '@adonisjs/core/services/router'

router.post('/register', [UsersController, 'signup'] )
router.post('/login', [UsersController, 'login'] )

/*Categorie routes*/
router.post('/cat/post', [CategoriesController, 'catCreated'] )
router.get('/cat/getAll', [CategoriesController, 'getAll'] )
router.get('/cat/getOn/:id', [CategoriesController, 'getOnly'] )
router.put('/cat/update/:id', [CategoriesController, 'updated'] )
router.delete('/cat/delete/:id', [CategoriesController, 'deleted'] )

/*Crew routes*/
router.post('/crew/post', [BrandsController, 'create'] )
router.get('/crew/getAll', [BrandsController, 'index'] )
router.get('/crew/getOn/:id', [BrandsController, 'show'] )
router.put('/crew/update/:id', [BrandsController, 'update'] )
router.delete('/crew/delete/:id', [BrandsController, 'destroy'] )


/*Post routes*/
router.post('/post/post', [ProductsController, 'create'] )
router.get('/post/alls', [ProductsController, 'getAlls'] )
router.get('/post/getAll', [ProductsController, 'index'] )
router.get('/post/getOn/:id', [ProductsController, 'show'] )
router.get('/post/get/:categorie', [ProductsController, 'showByCat'] )
router.get('/post/getNew/', [ProductsController, 'showDispo'] )
router.get('/post/getFitre/', [ProductsController, 'showbyfiltre'] )
router.put('/post/update/:id', [ProductsController, 'update'] )
router.delete('/post/delete/:id', [ProductsController, 'destroy'] )
router.get('/uploads/*', [ProductsController, 'imgeStore'])
