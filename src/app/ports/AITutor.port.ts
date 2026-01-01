export interface AITutorPort {
    ask(text: string): Promise<any>;
}