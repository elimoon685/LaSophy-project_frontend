
export interface Response<T> {
    data: T ,
    errorCode:string | null,
    errorMessage:string | null,
    message:string | null,
    succeed: boolean
}
