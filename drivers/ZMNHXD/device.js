'use strict';

const constants = require('../../lib/constants');
const QubinoDevice = require('../../lib/QubinoDevice');

/**
 * 3-Phase Smart Meter (ZMNHXD)
 * Extended manual: http://qubino.com/download/2244/
 * TODO: test endpoints and add relay endpoints?
 * TODO: device misses some command classes due to the fact that SECURITY_COMMANDS_SUPPORTED_GET is not performed
 * during inclusion. Edit: the command is executed but it seems the inclusion is not complete regarding the endpoints.
 * See the (unencrypted) zniffer log from Qubino
 */
class ZMNHXD extends QubinoDevice {

	/**
	 * Method that registers custom setting parsers.
	 */
	registerSettings() {
		super.registerSettings();
	}

	/**
	 * Method that will register capabilities of the device based on its configuration.
	 * @private
	 */
	registerCapabilities() {
		this.node.CommandClass.COMMAND_CLASS_METER.on('report', report => {
			console.log('report', report);
		});
		this.log('isMultiChannelNode', this.node.isMultiChannelNode, this.node.multiChannelNodeId);
		const mcObj = {};
		if (!this.node.isMultiChannelNode) mcObj.multiChannelNodeId = 1;
		this.registerCapability(constants.capabilities.onoff, constants.commandClasses.switchBinary, mcObj);
		this.registerCapability(constants.capabilities.measureVoltage, constants.commandClasses.meter, mcObj);
		this.registerCapability(constants.capabilities.measureCurrent, constants.commandClasses.meter, mcObj);
		this.registerCapability(constants.capabilities.measurePower, constants.commandClasses.meter, mcObj);
		this.registerCapability(constants.capabilities.meterPowerImport, constants.commandClasses.meter, mcObj);
		this.registerCapability(constants.capabilities.meterPowerExport, constants.commandClasses.meter);
		this.registerCapability(constants.capabilities.powerReactive, constants.commandClasses.meter, mcObj); // TODO: validate this is in kVar
		this.registerCapability(constants.capabilities.powerTotalReactive, constants.commandClasses.meter, mcObj);
		this.registerCapability(constants.capabilities.powerTotalApparent, constants.commandClasses.meter, mcObj);
		this.registerCapability(constants.capabilities.powerFactor, constants.commandClasses.meter, mcObj);
	}
}

module.exports = ZMNHXD;