import BabyChainService from '../../services/babychain/babychain.service';

export class Controller {
  getBaby(req, res) {
    BabyChainService
      .getBaby(req, res)
      .then(r => {
        if (r) res.json(r);
        else res.status(404).end();
      });
  }
 
  register(req, res) {
    BabyChainService
      .register(req, res)
      .then(r => {
        if (r) res.json(r);
        else res.status(404).end();
      });
  }


  modify(req, res) {
    BabyChainService
      .modify(req, res)
      .then(r => {
        if (r) res.json(r);
        else res.status(404).end();
      });
  }

  delete(req, res) {
    BabyChainService
      .delete(req, res)
      .then(r => {
        if (r) res.json(r);
        else res.status(404).end();
      });
  }
}
export default new Controller();
