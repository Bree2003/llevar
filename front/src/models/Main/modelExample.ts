import { ExampleDataResponse } from "services/Main/get-example-data";

export interface ExampleModel { 
    name: string;
    age: number;
};



const ExampleDataToModel = (data: ExampleDataResponse[]): ExampleModel[] => {
    const output: ExampleModel[] = [];
    for(const val of data){
        output.push({
            name: val.name,
            age: val.age,
        });
    }
    return output;
}

export default ExampleDataToModel;
