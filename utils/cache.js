import { Redis } from 'ioredis'

const client = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.PORT,
})

export default client