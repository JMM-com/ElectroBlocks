import { defineBlocksWithJsonArray } from 'blockly';
import { selectedBoard } from '../types/pins';
import * as Blockly from 'blockly/core';
import { loopTimes } from './debug_extensions';
import { COLOR_THEME } from './color_theme';

defineBlocksWithJsonArray([
  {
    type: 'bluetooth_get_message',
    message0: '%1 bluetooth get message. %2 message (readonly) %3',
    args0: [
      {
        type: 'field_image',
        src: './assets/blocks/bluetooth/bluetooth.png',
        width: 15,
        height: 15,
        alt: '*',
        flipRtl: false
      },
      {
        type: 'input_dummy'
      },
      {
        type: 'field_input',
        name: 'SIMPLE_DEBUG',
        text: ''
      }
    ],
    output: 'String',
    colour: COLOR_THEME.COMPONENTS,
    tooltip: '',
    helpUrl: '',
    extensions: ['debug']
  },
  {
    type: 'bluetooth_has_message',
    message0:
      '%1 Is bluetooth receiving message? %2 Is receiving message? (readonly) %3',
    args0: [
      {
        type: 'field_image',
        src: './assets/blocks/bluetooth/bluetooth.png',
        width: 15,
        height: 15,
        alt: '*',
        flipRtl: false
      },
      {
        type: 'input_dummy'
      },
      {
        type: 'field_checkbox',
        name: 'SIMPLE_DEBUG',
        checked: false
      }
    ],
    output: 'Boolean',
    colour: COLOR_THEME.COMPONENTS,
    tooltip: '',
    helpUrl: ''
  },
  {
    type: 'bluetooth_send_message',
    message0: '%1 bluetooth send message. %2',
    args0: [
      {
        type: 'field_image',
        src: './assets/blocks/bluetooth/bluetooth.png',
        width: 15,
        height: 15,
        alt: '*',
        flipRtl: false
      },
      {
        type: 'input_value',
        name: 'MESSAGE',
        check: 'String'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: COLOR_THEME.COMPONENTS,
    tooltip: '',
    helpUrl: ''
  }
]);

Blockly.Blocks['bluetooth_setup'] = {
  init: function() {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage(
          './assets/blocks/bluetooth/bluetooth.png',
          15,
          15,
          { alt: '*', flipRtl: 'FALSE' }
        )
      )
      .appendField('Bluetooth Setup');
    this.appendDummyInput()
      .appendField('RX Pin# ')
      .appendField(new Blockly.FieldDropdown(selectedBoard().digitalPins), 'RX')
      .appendField('TX Pin#')
      .appendField(
        new Blockly.FieldDropdown(selectedBoard().digitalPins),
        'TX'
      );
    this.appendDummyInput('SHOW_CODE_VIEW').appendField(
      '-----------------------------------------'
    );
    this.appendDummyInput()
      .appendField('Loop')
      .appendField(new Blockly.FieldDropdown(() => loopTimes()), 'LOOP');
    this.appendDummyInput()
      .appendField('Receiving Message? ')
      .appendField(
        new Blockly.FieldCheckbox('TRUE', (value) => {
          if ('FALSE' === value) {
            this.getField('message').setValue('');
          }
          return value;
        }),
        'receiving_message'
      );
    this.appendDummyInput()
      .appendField('Message:')
      .appendField(
        new Blockly.FieldTextInput('message', (value) => {
          if (this.getFieldValue('receiving_message') === 'FALSE') {
            return null;
          }
          return value;
        }),
        'message'
      );
    this.setColour(COLOR_THEME.COMPONENTS);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
