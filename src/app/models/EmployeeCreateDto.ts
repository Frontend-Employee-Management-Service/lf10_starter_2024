export class EmployeeCreateDto {
    constructor(
        public lastName?: string,
        public firstName?: string,
        public street?: string,
        public postcode?: string,
        public city?: string,
        public phone?: string) {
    }
}
