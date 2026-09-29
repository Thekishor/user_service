import { PaginationQuery } from "../schema/auth.schema";

export function parseQuery(query: PaginationQuery) {
    return {
        skip: (query.page - 1) * query.limit,
        limit: query.limit,
        search: query.search,
        orderBy: {
            [query.sortBy]: query.sortOrder === "asc" ? 1 : -1,
        } as Record<string, 1 | -1>
    }
}