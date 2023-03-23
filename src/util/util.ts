interface UriConfig {
    q: string;
    per_page: number,
    page: number
}

export const urlBuilder = ({ q, per_page, page }: UriConfig): string => {
        return `https://api.github.com/search/repositories?q=${ q }&per_page=${per_page}&page=${page}`;
}
    
