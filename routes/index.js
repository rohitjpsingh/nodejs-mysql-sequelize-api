const { Router } =  require('express');
require('../passport');
const router = Router();
const v1Router = require('./v1')
const v2Router = require('./v2')
const v3Router = require('./v3')

router.use('/v1', v1Router);
router.use('/v2', v2Router);
router.use('/v3', v3Router);



module.exports = router;