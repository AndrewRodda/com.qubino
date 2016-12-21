'use strict';

const path = require('path');
const ZwaveDriver = require('node-homey-zwavedriver');

module.exports = new ZwaveDriver(path.basename(__dirname), {
	capabilities: {
		onoff: {
			command_class: 'COMMAND_CLASS_SWITCH_BINARY',
			command_get: 'SWITCH_BINARY_GET',
			command_set: 'SWITCH_BINARY_SET',
			command_set_parser: value => ({
				'Switch Value': (value) ? 'on/enable' : 'off/disable',
			}),
			command_report: 'SWITCH_BINARY_REPORT',
			command_report_parser: report => {
				if (typeof report['Value'] === 'string') {
					if (report['Value'] === 'on/enable') {
						return true;
					} else if (report['Value'] === 'off/disable') {
						return false;
					}
				} else if (report.hasOwnProperty('Value (Raw)')) {
					if (report['Value (Raw)'][0] > 0) {
						return true;
					} else {
						return false;
					}
				}
				return null;
			},
		},
		dim: {
			command_class: 'COMMAND_CLASS_SWITCH_MULTILEVEL',
			command_get: 'SWITCH_MULTILEVEL_GET',
			command_set: 'SWITCH_MULTILEVEL_SET',
			command_set_parser: value => ({
				Value: value * 100,
				'Dimming Duration': 1,
			}),
			command_report: 'SWITCH_MULTILEVEL_REPORT',
			command_report_parser: report => {
				if (report && report['Value (Raw)']) return report['Value (Raw)'][0] / 100;
				return null;
			},
		},
		measure_power: {
			command_class: 'COMMAND_CLASS_METER',
			command_get: 'METER_GET',
			command_get_parser: () => ({
				Properties1: {
					Scale: 7,
					'Rate Type': 'Import'
				},
				'Scale 2': 1
			}),
			command_report: 'METER_REPORT',
			command_report_parser: report => {
				if (report.hasOwnProperty('Properties2')
					&& report.Properties2.hasOwnProperty('Scale bits 10')
					&& report.Properties2['Scale bits 10'] === 2) {
					return report['Meter Value (Parsed)'];
				}
				return null;
			},
		},
		meter_power: {
			command_class: 'COMMAND_CLASS_METER',
			command_get: 'METER_GET',
			command_get_parser: () => ({
				Properties1: {
					Scale: 0,
					'Rate Type': 'Import'
				},
				'Scale 2': 1
			}),
			command_report: 'METER_REPORT',
			command_report_parser: report => {
				if (report.hasOwnProperty('Properties2')
					&& report.Properties2.hasOwnProperty('Scale bits 10')
					&& report.Properties2['Scale bits 10'] === 0) {
					return report['Meter Value (Parsed)'];
				}
				return null;
			},
		},
		measure_temperature: {
			command_class: 'COMMAND_CLASS_SENSOR_MULTILEVEL',
			command_get: 'SENSOR_MULTILEVEL_GET',
			command_get_parser: () => ({
				'Sensor Type': 'Temperature (version 1)',
				Properties1: {
					Scale: 0,
				},
			}),
			command_report: 'SENSOR_MULTILEVEL_REPORT',
			command_report_parser: report => report['Sensor Value (Parsed)'],
			optional: true,
		},
	},
	settings: {
		input_1_type: {
			index: 1,
			size: 1,
		},
		deactivate_ALL_ON_ALL_OFF: {
			index: 10,
			size: 2,
		},
		automatic_turning_off_output_after_set_time: {
			index: 11,
			size: 2,
		},
		automatic_turning_on_output_after_set_time: {
			index: 12,
			size: 2,
		},
		state_of_device_after_power_failure: {
			index: 30,
			size: 1,
		},
		power_report_on_power_change: {
			index: 40,
			size: 1,
		},
		power_report_by_time_interval: {
			index: 42,
			size: 2,
		},
		maximum_dimming_value: {
			index: 61,
			size: 1,
		},
		minimum_dimming_value: {
			index: 60,
			size: 1,
		},
		dimming_time_soft_on_off: {
			index: 65,
			size: 1,
		},
		dimming_time_when_key_pressed: {
			index: 66,
			size: 1,
		},
	},
});
