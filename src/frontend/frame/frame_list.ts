import { Frame } from './frame';
import { Block } from './block';
import { 
    variables_set_boolean_block,
    variables_set_string_block,
    variables_set_colour_block,
    variables_set_number_block,

    variables_get_boolean_block,
    variables_get_string_block,
    variables_get_colour_block,
    variables_get_number_block,
} from '../frame_genorator/variables';


let valueGeneratingBlocks: { [key: string] : (block: Block, previousFrame?: Frame) =>  number|string|boolean|Array<number|string|boolean> };

let frameGeneratingBlocks: { [key: string] : (block: Block, previousFrame?: Frame) =>  Frame[] };

frameGeneratingBlocks = {
    variables_set_boolean_block,
    variables_set_string_block,
    variables_set_colour_block,
    variables_set_number_block,
};

valueGeneratingBlocks = {
    variables_get_boolean_block,
    variables_get_string_block,
    variables_get_colour_block,
    variables_get_number_block,
}

export {
    frameGeneratingBlocks,
    valueGeneratingBlocks
};