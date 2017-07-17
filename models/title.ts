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
    constructor() {
        this.retrieved = new Date()
    }
}

export { Title }