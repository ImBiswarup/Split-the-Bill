const router = require('express').Router();
const { createGroup, getGroup, updateGroup, deleteGroup, addUserToGroup, createGroupBill } = require('../controller/group');

router.post('/create', createGroup);
router.post('/add', addUserToGroup);
router.post('/:id/bills', createGroupBill); // New route for creating bills in groups
router.get('/:id', getGroup);
router.put('/:id', updateGroup);
router.delete('/:id', deleteGroup);


module.exports = router;