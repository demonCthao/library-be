export type BookSearchResult = {
    id: number
    title: string
    pages: number | null
    category_id: number | null
    avatar_path: string | null
    publish_year: number | null
    book_copies: {
        id: number
        book_id: number
    }[]
}
