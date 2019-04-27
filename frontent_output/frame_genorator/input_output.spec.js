"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jasmine");
const input_output_1 = require("./input_output");
const arduino_frame_1 = require("../arduino/arduino_frame");
const command_1 = require("../frame/command");
const input_state_1 = require("../frame/input_state");
const pin_1 = require("../arduino/pin");
const blockHelper = require("../frame/blockly_helper");
describe('input output frame generators', () => {
    let block;
    let getFieldValueSpy;
    let addBlockCallSpy;
    let getInputValueSpy;
    beforeEach(() => {
        block = {
            getFieldValue(fieldName) {
            }
        };
        getInputValueSpy = spyOn(blockHelper, 'getInputValue');
        addBlockCallSpy = spyOn(input_state_1.inputState, 'addBlockCall');
        getFieldValueSpy = spyOn(block, 'getFieldValue');
    });
    describe('digital_write_block', () => {
        it(' create a digital write high from block', () => {
            const previousFrame = new arduino_frame_1.ArduinoFrame('asdf', { 'hello': {
                    name: 'hello', type: 'String', value: 'Hello'
                } }, [], new command_1.EmptyCommand(), { location: 'loop', iteration: 0 });
            getFieldValueSpy.withArgs('PIN').and.returnValue('3');
            getFieldValueSpy.withArgs('STATE').and.returnValue('ON');
            const [frame] = input_output_1.digital_write_block(block, { location: 'loop', iteration: 3 }, previousFrame);
            expect(frame.nextCommand().command).toBe('M-P-D:3:1|');
            expect(frame.variables['hello'].name).toBe('hello');
            expect(frame.variables['hello'].value).toBe('Hello');
            expect(frame.variables['hello'].type).toBe('String');
        });
        it('should create a digital write frame that has the led off', () => {
            getFieldValueSpy.withArgs('PIN').and.returnValue('3');
            getFieldValueSpy.withArgs('STATE').and.returnValue('OFF');
            const [frame] = input_output_1.digital_write_block(block, { location: 'loop', iteration: 3 });
            expect(frame.nextCommand().command).toBe('M-P-D:3:0|');
        });
        it('should not generate another component but replace the old one if it exists', () => {
            getFieldValueSpy.withArgs('PIN').and.returnValue('1');
            const previousFrame = new arduino_frame_1.ArduinoFrame('asdf', { 'hello': {
                    name: 'hello', type: 'String', value: 'Hello'
                } }, [new pin_1.Pin(pin_1.ARDUINO_UNO_PINS.PIN_1, pin_1.PIN_TYPE.ANALOG, 30)], new command_1.EmptyCommand(), { location: 'loop', iteration: 0 });
            getInputValueSpy.withArgs(block, 'WRITE_VALUE', 0, previousFrame).and.returnValue(130);
            const [frame] = input_output_1.analog_write_block(block, { location: 'loop', iteration: 3 }, previousFrame);
            expect(frame.components.length).toBe(1);
            expect(frame.components[0].usbCommand().command).toBe('M-P-A:1:130|');
        });
    });
});
//# sourceMappingURL=input_output.spec.js.map