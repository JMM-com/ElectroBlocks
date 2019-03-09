"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const arduino_frame_1 = require("./../arduino/arduino_frame");
const blockly_helper_1 = require("../frame/blockly_helper");
const variables_set_number_block = (block, previousFrame) => {
    return setVariable(block, 'Number', 0, previousFrame);
};
exports.variables_set_number_block = variables_set_number_block;
const variables_get_number_block = (block, previousFrame) => {
    return parseInt(getVariable(block, 0, previousFrame));
};
exports.variables_get_number_block = variables_get_number_block;
const variables_set_colour_block = (block, previousFrame) => {
    return setVariable(block, 'Colour', { r: 0, g: 0, b: 0 }, previousFrame);
};
exports.variables_set_colour_block = variables_set_colour_block;
const variables_get_colour_block = (block, previousFrame) => {
    return getVariable(block, { r: 0, g: 0, b: 0 }, previousFrame);
};
exports.variables_get_colour_block = variables_get_colour_block;
const variables_set_string_block = (block, previousFrame) => {
    return setVariable(block, 'String', '', previousFrame);
};
exports.variables_set_string_block = variables_set_string_block;
const variables_get_string_block = (block, previousFrame) => {
    return getVariable(block, '', previousFrame);
};
exports.variables_get_string_block = variables_get_string_block;
const variables_set_boolean_block = (block, previousFrame) => {
    return setVariable(block, 'Boolean', true, previousFrame);
};
exports.variables_set_boolean_block = variables_set_boolean_block;
const variables_get_boolean_block = (block, previousFrame) => {
    return getVariable(block, true, previousFrame);
};
exports.variables_get_boolean_block = variables_get_boolean_block;
const getVariable = (block, defaultValue, previousFrame) => {
    let variableName = getVariableName(block);
    if (!previousFrame) {
        return defaultValue;
    }
    if (!previousFrame.variables[variableName]) {
        return defaultValue;
    }
    let value = previousFrame.variables[variableName].value;
    if (isBooleanVariableReturningValue(getVariableType(block), value)) {
        return value;
    }
    return value || defaultValue;
};
function setVariable(block, type, defaultValue, previousFrame) {
    previousFrame = previousFrame || arduino_frame_1.ArduinoFrame.makeEmptyFrame(block.id);
    let variableName = getVariableName(block);
    let value = blockly_helper_1.getInputValue(block, 'VALUE', previousFrame, defaultValue);
    if (!isBooleanVariableReturningValue(type, value)) {
        value = value || defaultValue;
    }
    let variableList = previousFrame.variables;
    variableList[variableName] = {
        name: variableName,
        type,
        value
    };
    return [new arduino_frame_1.ArduinoFrame(block.id, variableList, previousFrame.components, previousFrame.lastMovedComponent)];
}
const isBooleanVariableReturningValue = (type, value) => {
    if (type != 'Boolean') {
        return false;
    }
    return value === false;
};
const getVariableName = (block) => {
    return Blockly.mainWorkspace.getVariableById(block.getFieldValue('VAR')).name;
};
const getVariableType = (block) => {
    return Blockly.mainWorkspace.getVariableById(block.getFieldValue('VAR')).type;
};
//# sourceMappingURL=variables.js.map