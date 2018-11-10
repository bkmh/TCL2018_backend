/**
 *
 * Copyright 2018 KT All Rights Reserved.
 *
 */

import * as express from 'express';
import controller from './controller';

export default express
  .Router()
  .post('/register', controller.register)
  .get('/:key', controller.getBaby)
  .post('/modify',controller.modify)
  .post('/delete',controller.postdelete)
  .get('/delete/:key',controller.delete)
  .post('/uploadImage',controller.uploadImage)
  .get('/readImage/:key',controller.readImage)
  .post('/uploadImageToText',controller.uploadImageToText)
  .post('/readImageToText',controller.readImageToText)
  .post('/modifyImageToText',controller.modifyImageToText)
  .post('/deleteImageToText',controller.deleteImageToText)
  .post('/uploadImageAndValues',controller.uploadImageAndValues)
  ;

