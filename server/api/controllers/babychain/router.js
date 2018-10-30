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
  .post('/uploadImageJSEncoding',controller.uploadImageJSEncoding)
  .get('/readImageJSDecoding/:key',controller.readImageJSDecoding)
  .post('/uploadImageCCEncoding',controller.uploadImageCCEncoding)
  .get('/readImageCCDecoding/:key',controller.readImageCCDecoding)
  .get('/delete/:key',controller.delete)
  .post('/uploadImage',controller.uploadImage)
  .get('/readImage/:key',controller.readImage);

