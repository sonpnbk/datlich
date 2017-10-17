export class ListModel{
    constructor(
        public thoigian:string,
        public id:number
    ){}

    static fromJson(data:any){
        if(!data.thoigian || !data.id){
            throw(new Error("Invalid argument: argument structure do not match with model"));
        }

        return new ListModel(data.thoigian, data.id);
    }
}