import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { parseClippings } from './controllers/parse_clippings.js';
import NotionSyncController from './controllers/sync_notion.js';

dotenv.config();

// Parse the clippings
const inputData = fs.readFileSync('My Clippings.txt', 'utf-8');
let parsedBooks = parseClippings(inputData);

// sync to notion
const notionSyncController = new NotionSyncController(
  process.env.NOTION_SECRET || '',
  process.env.DATABASE_ID_BOOKS || '',
  process.env.DATABASE_ID_HIGHLIGHTS || ''
)
const booksHighlightIds = await notionSyncController.syncBooks(parsedBooks)
await notionSyncController.syncHighlights(parsedBooks, booksHighlightIds)