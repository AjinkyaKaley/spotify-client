export class Message{
    type: string;
    content: string;
    timestamp: number;
    constructor(type: string,content: string){
        this.type = type;
        this.content = content;
        this.timestamp = Date.now();
    }
}