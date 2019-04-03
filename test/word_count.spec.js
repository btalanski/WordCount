const assert = require('assert')
const fs = require("fs");
const path = require("path");
const word_count = require('../word_count.js');
const expect = require('chai').expect;

it('should return true', () => {
    const text = fs.readFileSync(path.join(__dirname, 'fixture/Backdi_e_Bio_g3_Bonde_da_Juju.txt'), 'utf8');
    const words = [
        'Quem',
        'mete',
        'Porra',
        'Nóis',
        'porta',
        'Oakley',
        'bonde',
        'Juliet',
        'Juliet',
        'Romeo',
        'Double',
        'Shox',
        'pescoço',
        'Ecko',
        'Nike',
        'Shox',
        'Juliet',
        'Romeo',
        'Double',
        'Shox',
        'Vale',
        'mais',
        'barão',
        'esse',
        'bonde',
        'Oakley'
    ]
    expect(word_count(text)).to.be.deep.equal(words);
})