const express = require('express');

const router = new express.Router();
router.get('/:customer', require('./{id}/get'));
router.post('/:customer', require('./{id}/post'));
router.delete('/:_id([0-9a-fA-F]{24})', require('./{id}/delete'));

module.exports = router;
