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
  .post('/uploadtest',controller.uploadtest)
  .get('/delete/:key',controller.delete);
