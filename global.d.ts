declare namespace NodeJS {
    interface Process {
        pkg?: {
            [key: string]: any;
        }
    }
}
