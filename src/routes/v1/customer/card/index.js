const express = require('express');

const router = new express.Router();
router.get('/single/:card([0-9a-fA-F]{24})', require('./{id}/single/get'));
router.get('/:customer([0-9a-fA-F]{24})', require('./{id}/get'));
router.post('/:customer([0-9a-fA-F]{24})', require('./{id}/post'));
router.delete('/:_id([0-9a-fA-F]{24})', require('./{id}/delete'));
router.patch('/:_id([0-9a-fA-F]{24})', require('./{id}/patch'));

module.exports = router;
