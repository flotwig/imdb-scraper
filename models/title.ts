import { Name } from './name'

class Title {
    id: string = ''
    title: string = ''
    year: string = ''
    genres: string[] = []
    plot: string = ''
    runtime: string = ''
    rating: string = ''
    votes: string = ''
    retrieved: Date
    photoUrl: string = ''
    directors: Name[] = []
    writers: Name[] = []
    stars: Name[] = []
    constructor() {
        this.retrieved = new Date()
    }
}

export { Title }