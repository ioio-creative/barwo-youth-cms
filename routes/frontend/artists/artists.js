const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const { generalErrorHandle } = require('../../../utils/errorHandling');
const { Artist, artistResponseTypes } = require('../../../models/Artist');
const { getArraySafe } = require('../../../utils/js/array/isNonEmptyArray');
