const router = require('express').Router();
const { createGroup, getGroup, updateGroup, deleteGroup, addUserToGroup } = require('../controller/group');

router.post('/create', createGroup);
router.post('/add', addUserToGroup);
router.get('/:id', getGroup);
router.put('/:id', updateGroup);
router.delete('/:id', deleteGroup);


module.exports = router;