export interface ApiResponse <T = void> {
    success : boolean;
    message : string;
    data? : T;
    error? : object;
}