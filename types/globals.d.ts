interface Tag {
    _id: string;
    name: string;
}

interface author{
    _id: string;
    name: string;
    image: string
    value: string
}
interface Question {
    _id: string;
    title: string;
    description: string;
    tags: Tag[];
    author: author;
    createdAt: Date;
    upvotes: number;
    views: number;
    answers: number;
}