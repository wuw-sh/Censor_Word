import { schema, modal, SchemaTypes } from './beapi_modules/BEAPI_CORE_SCRIPT.js';
import { profanity } from './Profanity_Word/profanity.js';
const sS = schema({ censorWord: SchemaTypes.Array, start: SchemaTypes.Number }); //stats schema type
const S = modal('stats', sS); //stats modal
var sD = S.findAll({})[0]; //stats data from database
if (!sD) { //if not found data
    sD = S.write({
        censorWord: [],
        start: 0 //set start to 0
    });
}
if (sD.start === 0) { //if start is 0 (first time)
    sD.censorWord = profanity; //set profanity word to censor word
    sD.start = 1; //set start to 1 (not first time)
    sD.save(); //save data to database
}
export var cwData = sD; //export data
