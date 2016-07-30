"use strict";

const path			= require('path');
const ZwaveDriver	= require('homey-zwavedriver');

module.exports = new ZwaveDriver( path.basename(__dirname), {
		debug: true,
	capabilities: {

				'onoff': {
					'command_class'				: 'COMMAND_CLASS_SWITCH_MULTILEVEL',
					'command_get'				: 'SWITCH_MULTILEVEL_GET',
					'command_set'				: 'SWITCH_MULTILEVEL_SET',
					'command_set_parser'		: function( value ){
						return {
							'Value': value
						}
					},
				'command_report'			: 'SWITCH_MULTILEVEL_REPORT',
				'command_report_parser'		: function( report ){
					if( typeof report['Value'] === 'string' ) {
							return report['Value'] === 'on/enable';
						} else {
							return report['Value (Raw)'][0] > 0;
						}
					},
				},

				'dim': {
					'command_class'				: 'COMMAND_CLASS_SWITCH_MULTILEVEL',
					'command_get'				: 'SWITCH_MULTILEVEL_GET',
					'command_set'				: 'SWITCH_MULTILEVEL_SET',
					'command_set_parser'		: function( value ){
						return {
							'Value': value * 100
						}
					},
					'command_report'			: 'SWITCH_MULTILEVEL_REPORT',
					'command_report_parser'		: function( report ){
						if( typeof report['Value'] === 'string' ) {
							return ( report['Value'] === 'on/enable' ) ? 1.0 : 0.0;
						} else {
							return report['Value (Raw)'][0] / 100;
						}
					},
				},
			},
		settings: {
			"Input_1_type": {
			"index": 1,
			"size": 1,
			"parser": function( input ) {
				return new Buffer([ parseInt(input) ]);
				}
			}
		}
})
