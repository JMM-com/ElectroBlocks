"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jasmine");
const blockHelper = require("../frame/blockly_helper");
const blockly = require("../frame/block");
const function_1 = require("./function");
const arduino_frame_1 = require("../arduino/arduino_frame");
describe('functions', () => {
    describe('procedures_callnoreturn_block', () => {
        it('should generate frames for a custom block', () => {
            const functionDefinitionBlock = {
                type: 'procedures_defnoreturn',
                id: 'asdfasdfasdfas',
                getProcedureDef() {
                    return ['func_name', [], false, [
                            {
                                type: 'Number',
                                name: 'var1',
                                value: 3
                            },
                            {
                                type: 'String',
                                name: 'var2',
                                value: 'hello'
                            }
                        ]];
                }
            };
            const block2 = {
                type: 'anotherblock'
            };
            const blocklyMock = {
                mainWorkspace: {
                    getTopBlocks: () => {
                        return [
                            functionDefinitionBlock,
                            block2
                        ];
                    }
                }
            };
            const functionCallBlock = {
                id: 'fadssdf',
                getProcedureCall() {
                    return 'func_name';
                }
            };
            spyOn(blockly, 'getBlockly').and.returnValue(blocklyMock);
            const getInputValueSpy = spyOn(blockHelper, 'getInputValue');
            getInputValueSpy.withArgs(functionCallBlock, 'ARG0', 0, undefined)
                .and.returnValue(34);
            getInputValueSpy.withArgs(functionCallBlock, 'ARG1', '', undefined)
                .and.returnValue('Hello World');
            spyOn(blockHelper, 'generateFrameForInputStatement')
                .withArgs(functionDefinitionBlock, 'STACK', jasmine.any(arduino_frame_1.ArduinoFrame))
                .and.returnValue([arduino_frame_1.ArduinoFrame.makeEmptyFrame('block_23'), arduino_frame_1.ArduinoFrame.makeEmptyFrame('block_23423')]);
            const frames = function_1.procedures_callnoreturn_block(functionCallBlock);
            expect(frames.length).toBe(4);
            const definitionFrameBlock = frames[1];
            expect(definitionFrameBlock.variables['var1'].type).toBe('Number');
            expect(definitionFrameBlock.variables['var1'].name).toBe('var1');
            expect(definitionFrameBlock.variables['var1'].value).toBe(34);
            expect(definitionFrameBlock.variables['var2'].value).toBe('Hello World');
            expect(definitionFrameBlock.variables['var2'].name).toBe('var2');
            expect(definitionFrameBlock.variables['var2'].type).toBe('String');
        });
    });
});
//# sourceMappingURL=function.spec.js.map