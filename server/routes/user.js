const router = require('express').Router();
const { createUser,
    getUser,
    updateUser,
    deleteUser, getAllUsers, loginUser, 
    createBills,
    deleteBills} = require('../controller/user');

router.post('/create', createUser);
router.get('/all', getAllUsers);
router.get('/:id', getUser);
router.post('/login', loginUser);
router.put('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser);

router.post('/bills/create', createBills);
router.delete('/bills/delete', deleteBills);

module.exports = router;
