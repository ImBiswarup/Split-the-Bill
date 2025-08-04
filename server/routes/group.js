const router = require('express').Router();
const { createGroup, getGroup, updateGroup, deleteGroup } = require('../controller/group');

router.post('/create', createGroup);
router.get('/:id', getGroup);
router.put('/:id', updateGroup);
router.delete('/:id', deleteGroup);


module.exports = router;