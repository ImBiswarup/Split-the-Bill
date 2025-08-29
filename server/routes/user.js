const router = require('express').Router();
const { createUser,
    getUser,
    updateUser,
    deleteUser, getAllUsers, loginUser, 
    createBills,
    deleteBills,
    splitBillAmongUsers,
    handleGoogleAuth } = require('../controller/user');

router.post('/create', createUser);
router.get('/all', getAllUsers);
router.get('/:id', getUser);
router.post('/login', loginUser);
router.post('/auth/google', handleGoogleAuth);
router.put('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser);

router.post('/bills/create', createBills);
router.delete('/bills/delete', deleteBills);
router.post('/bills/split', splitBillAmongUsers);

module.exports = router;
