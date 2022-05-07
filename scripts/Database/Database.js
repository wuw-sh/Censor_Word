import { schema, modal, SchemaTypes } from '../beapi_modules/BEAPI_CORE_SCRIPT.js';
import { profanity } from '../Profanity/index.js';
const Schema = schema({ censorWord: SchemaTypes.Array, start: SchemaTypes.Number }); //stats schema type
export const Modal = modal('stats', Schema); //stats modal
var Data = Modal.findAll({})[0]; //stats data from database
if (!Data) { //if not found data
    Data = Modal.write({
        censorWord: [],
        start: 0 //set start to 0
    });
}
if (Data.start === 0) { //if start is 0 (first time)
    Data.censorWord = profanity; //set profanity word to censor word
    Data.start = 1; //set start to 1 (not first time)
    Data.save(); //save data to database
}
export var Database = Data; //export data
