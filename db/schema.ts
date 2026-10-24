import {sqliteTable,text,integer} from 'drizzle-orm/sqlite-core';
export const demoBoards=sqliteTable('demo_boards',{
 owner:text('owner').primaryKey(),
 payload:text('payload').notNull(),
 version:integer('version').notNull().default(0),
 updatedAt:integer('updated_at').notNull()
});
