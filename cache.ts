import * as redis from 'redis'

interface HitCallback {
    (any): void
}

interface MissCallback {
    (HitCallback): void
}

class Cache {
    private redis: redis.RedisClient
    private inMemory: Object = {}

    constructor() {
        if (process.env.REDIS_URL)
            this.redis = redis.createClient(process.env.REDIS_URL)
    }

    // miss may be called and expected to call the callback with a value for ID
    // hit will be called at the end with a valid value for id
    get(id: string, miss: MissCallback, hit: HitCallback) {
        if (this.redis) {
            this.redis.get(id, (err, reply) => {
                console.log('from redis: ' + reply)
                if (!err && reply) {
                    try {
                        hit(JSON.parse(reply))
                    } catch (e) {
                        this.redis.del(id)
                        this.set(id, miss, hit)
                    }
                } else
                    this.set(id, miss, hit)
            })
        } else {
            if (this.inMemory.hasOwnProperty(id))
                hit(JSON.parse(this.inMemory[id]))
            else
                this.set(id, miss, hit)
        }
    }

    private set(id: string, miss: MissCallback, hit: HitCallback) {
        console.log('Cache miss for ' + id);
        miss((value: any) => {
            let encodedValue = JSON.stringify(value)
            console.log('to redis: ' + encodedValue)
            if (this.redis)
                this.redis.set(id, encodedValue)
            else
                this.inMemory[id] = encodedValue;
            hit(value)
        })
    }
}

export { Cache }