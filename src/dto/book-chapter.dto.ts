export class BookChapterDTO {
    id: number;
    title: string;
    currentChapterIndex: number;
    chapterContent: string;
    totalChapters: number;
    avatar_path: string | null;
    isbn: string | null;
    description: string | null;

    constructor(
        id: number,
        title: string,
        currentChapterIndex: number,
        chapterContent: string,
        totalChapters: number,
        avatar_path: string | null,
        isbn: string | null,
        description: string | null
    ) {
        this.id = id;
        this.title = title;
        this.currentChapterIndex = currentChapterIndex;
        this.chapterContent = chapterContent;
        this.totalChapters = totalChapters;
        this.avatar_path = avatar_path;
        this.isbn = isbn;
        this.description = description;
    }
}