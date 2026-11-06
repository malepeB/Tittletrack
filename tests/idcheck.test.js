import test from 'node:test';
import assert from 'node:assert/strict';
import { checkID } from '../lib/idcheck.js';
const VALID = '9001015000085';
test('FR01 valid ID accepted with details', () => { const r = checkID(VALID); assert.ok(r.ok); assert.equal(r.gender, 'Male'); assert.equal(r.citizenship, 'SA citizen'); });
test('FR01 wrong length rejected', () => assert.equal(checkID('12345').ok, false));
test('FR01 letters rejected', () => assert.equal(checkID('90010150000AB').ok, false));
test('FR01 bad checksum rejected', () => assert.equal(checkID(VALID.slice(0, 12) + ((+VALID[12] + 1) % 10)).ok, false));
test('FR01 impossible birth date rejected', () => assert.equal(checkID('9013325000080').ok, false));
