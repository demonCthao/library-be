export abstract class BaseService<T, CreateDto = any, UpdateDto = any> {
    
    abstract store(data: CreateDto): Promise<T>;

    abstract findAll(params?: {
        page?: number;
        limit?: number;
        where?: any;
        orderBy?: any;
        include?: any;
    }): Promise<PaginatedResult<T>>;

    abstract update(id: number | string, data: UpdateDto): Promise<T>;

    abstract destroy(id: number | string): Promise<T>;
}
