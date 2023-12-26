import { parseClippings } from './controllers/parse_clippings.js';
import * as fs from 'fs';

// Read the input data from a file
const inputData = fs.readFileSync('My Clippings.txt', 'utf-8');

// Parse the clippings
const parsedBooks = parseClippings(inputData);
console.log(parsedBooks);
