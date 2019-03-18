"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pin_1 = require("./pin");
require("jasmine");
describe('Pin Test', () => {
    it('should generate the correct command.', () => {
        let pin = new pin_1.Pin(pin_1.ARDUINO_UNO_PINS.PIN_12, pin_1.PIN_TYPE.DIGITAL, pin_1.Pin.HIGH);
        expect(pin.usbCommand()).toBe('M-P-D:12:1|');
    });
    it('digital pins should only be HIGH or LOW', () => {
        let pin = new pin_1.Pin(pin_1.ARDUINO_UNO_PINS.PIN_3, pin_1.PIN_TYPE.DIGITAL, 1000);
        expect(pin.usbCommand()).toBe('M-P-D:3:1|');
        pin = new pin_1.Pin(pin_1.ARDUINO_UNO_PINS.PIN_3, pin_1.PIN_TYPE.DIGITAL, -32);
        expect(pin.usbCommand()).toBe('M-P-D:3:1|');
    });
    it('analog pin should only do positive number values', () => {
        let pin = new pin_1.Pin(pin_1.ARDUINO_UNO_PINS.PIN_A0, pin_1.PIN_TYPE.ANALOG, -120);
        expect(pin.usbCommand()).toBe('M-P-A:A0:120|');
    });
    it('it should be able to make a copy of itself', () => {
        let pin = new pin_1.Pin(pin_1.ARDUINO_UNO_PINS.PIN_A0, pin_1.PIN_TYPE.ANALOG, -120);
        let pin2 = pin.makeCopy();
        expect(pin).not.toBe(pin2);
        expect(pin).toEqual(pin2);
        expect(pin.usbCommand()).toBe(pin2.usbCommand());
    });
    it('setup command should return nothing', () => {
        let pin = new pin_1.Pin(pin_1.ARDUINO_UNO_PINS.PIN_A0, pin_1.PIN_TYPE.ANALOG, -120);
        expect(pin.setupCommandUSB()).toBe('');
    });
});
//# sourceMappingURL=pin.spec.js.map