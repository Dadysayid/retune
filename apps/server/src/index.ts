// src/index.ts
import { Elysia } from 'elysia'
import { node }   from '@elysiajs/node'

const app = new Elysia({ adapter: node() })   // 👈  adaptateur ici
  .get('/', () => 'Hello Elysia on Node!')
  .listen(4000)

console.log('🟢  Server ready → http://localhost:4000')
