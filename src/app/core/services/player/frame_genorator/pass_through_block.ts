import { Block } from 'blockly';
import { FrameLocation } from '../frame/frame';
import { ArduinoFrame } from '../arduino/arduino_frame';
import { ArduinoState } from '../arduino/state/arduino.state';

export const temp_setup_block = (
  block: Block,
  frameLocation: FrameLocation,
  previousFrame?: ArduinoFrame
): ArduinoFrame[] => {
  const state = previousFrame
    ? previousFrame.state
    : ArduinoState.makeEmptyState();

  return [new ArduinoFrame(block.id, state, frameLocation)];
};

export const ir_remote_setup_block = temp_setup_block;
export const soil_sensor_setup_block = temp_setup_block;
export const bluetooth_setup_block = temp_setup_block;
export const rfid_setup_block = temp_setup_block;
export const push_button_setup_block = temp_setup_block;
export const message_setup_block = temp_setup_block;
export const time_setup_block = temp_setup_block;
export const digital_read_setup_block = temp_setup_block;
export const analog_read_setup_block = temp_setup_block;
export const ultra_sonic_sensor_setup_block = temp_setup_block;
