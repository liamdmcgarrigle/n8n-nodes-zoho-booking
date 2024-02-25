import {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import {
	appointmentOperations,
	appointmentFields
} from './appointmentDescription';
import {
	otherFields,
	otherOperations
} from './otherDescription';
import {
	checkTimeZone,
	createBookingBody,
	customCustomerFields,
	defaultCustomerFields,
	keyValueInputCustomerFields
} from './GenericFunctions';
const { DateTime } = require("luxon");


export class ZohoBookings implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Zoho Bookings',
		name: 'zohoBookings',
		icon: 'file:zohoBookingsLogo.svg',
		group: ['input'],
		version: 1,
		subtitle: "={{$parameter['operation']}}",
		//serviceId
		description: 'Node for Zoho Bookings',
		defaults: {
			name: 'Zoho Bookings',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'zohoBookingsOAuth2Api',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
				options: [
					{
						name: 'Appointment',
						value: 'appointmentActions',
						action: 'Appointment actions',

					},
					{
						name: 'Other',
						value: 'otherActions',
						action: 'Other retrieval actions',
					},
				],
				default: 'appointmentActions',
			},
			...appointmentOperations,
			...appointmentFields,
			...otherOperations,
			...otherFields,

			]
		};



		async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
			const items = this.getInputData();
			let item: INodeExecutionData;

			for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
				try {
					item = items[itemIndex];
					let regionalTdl: string | IDataObject = this.getNodeParameter('additionalFields', itemIndex, '') as IDataObject;
					regionalTdl = regionalTdl.region ? regionalTdl.region as string : '.com';
					const baseUrl = `https://www.zohoapis${regionalTdl}/bookings/v1/json`;

					if( this.getNodeParameter('resource', 0) === 'appointmentActions' ) {

						// --------------------------------------------------------------------------------
						// ------------------------------ CREATE NEW Booking ------------------------------
						// --------------------------------------------------------------------------------
						if( this.getNodeParameter('operation', 0) === 'bookAppointment' ) {

							const serviceId = this.getNodeParameter('serviceId', itemIndex, '') as string;
							const staffId = this.getNodeParameter('staffId', itemIndex, '') as string;
							const startTime = this.getNodeParameter('startTime', itemIndex, '') as string;
							const customerName = this.getNodeParameter('customerName', itemIndex, '') as string;
							const customerEmail = this.getNodeParameter('customerEmail', itemIndex, '') as string;
							const customerPhone = this.getNodeParameter('customerPhone', itemIndex, '') as string;
							const additionalFields = this.getNodeParameter('additionalFields', itemIndex) as IDataObject; // gets values under additionalFields
							const resourceId = additionalFields.resourceId as string;
							const groupId = additionalFields.groupId as string;
							const timeZone = additionalFields.timeZone as string;

							// conditionally assign key value custom customer data
							let customCustomerFeildsKeyValue: IDataObject | Array<keyValueInputCustomerFields>  = this.getNodeParameter('customCustomerFeildsKeyValue', itemIndex, '') as IDataObject;
							if(customCustomerFeildsKeyValue){
								customCustomerFeildsKeyValue = customCustomerFeildsKeyValue.additional_fields as Array<keyValueInputCustomerFields>;
							}

							// conditionally assign json custom customer data
							const customCustomerFeildsJsonGetter = this.getNodeParameter('customCustomerFeildsJson', itemIndex, '') as string;
							let customCustomerFeildsJson: customCustomerFields | undefined;
							if(customCustomerFeildsJsonGetter){
								customCustomerFeildsJson = JSON.parse(customCustomerFeildsJsonGetter) as customCustomerFields;
							}

							// Set custom customer data based on field inputs
							let customCustomerDetails: customCustomerFields;
							if(customCustomerFeildsJson){
								customCustomerDetails = customCustomerFeildsJson;
							} else {
								customCustomerDetails = {};
							}

							let defaultcustomerDetails: defaultCustomerFields = {
								"name": customerName,
								"email": customerEmail,
							}

							if(customerPhone){
								defaultcustomerDetails['phone_number'] = customerPhone;
							}

							if(customCustomerFeildsKeyValue){
								customCustomerFeildsKeyValue.forEach(data => {
									customCustomerDetails[data.name] = data.value;
								});
							}


							let formData: createBookingBody = {
								"service_id": serviceId,
								"staff_id": staffId,
								"from_time": DateTime.fromFormat(startTime, "yyyy-MM-dd HH:mm:ss").toFormat('dd-MMM-yyyy HH:mm:ss'),
								// "customer_details": JSON.stringify({...defaultcustomerDetails, ...customCustomerDetails})
								"customer_details": JSON.stringify({...defaultcustomerDetails,})
							}

							if(customCustomerDetails){
								formData.additional_fields = JSON.stringify(customCustomerDetails);
							}

							if(resourceId) {
								formData.resource_id = resourceId;
							}

							if(groupId) {
								formData.group_id = groupId;
							}

							if(timeZone){
								checkTimeZone(this.getNode(), timeZone, itemIndex);
								formData.time_zone = timeZone;
							}



							const options: IHttpRequestOptions = {

								url: `${baseUrl}/appointment`,
								method: 'POST',
								body:formData,
								json: false,
								headers: {
									"content-type":"multipart/form-data"
								}
							};

							 const response = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'zohoBookingsOAuth2Api',
								options,
							);

							item.json['zohoResponse'] = response;

						}


						// --------------------------------------------------------------------------------
						// ---------------------------- Reschedule Appointment ----------------------------
						// --------------------------------------------------------------------------------
						// if( this.getNodeParameter('operation', 0) === 'rescheduleAppointment' ) {

				// 			const serviceId = this.getNodeParameter('serviceId', itemIndex, '') as string;
				// 			const staffId = this.getNodeParameter('staffId', itemIndex, '') as string;
				// 			const startTime = this.getNodeParameter('startTime', itemIndex, '') as string;
				// 			const customerName = this.getNodeParameter('customerName', itemIndex, '') as string;
				// 			const customerEmail = this.getNodeParameter('customerEmail', itemIndex, '') as string;
				// 			const customerPhone = this.getNodeParameter('customerPhone', itemIndex, '') as string;
				// 			const additionalFields = this.getNodeParameter('additionalFields', itemIndex) as IDataObject; // gets values under additionalFields
				// 			const resourceId = additionalFields.resourceId as string;
				// 			const groupId = additionalFields.groupId as string;
				// 			const timeZone = additionalFields.timeZone as string;

				// 			// conditionally assign key value custom customer data
				// 			let customCustomerFeildsKeyValue: IDataObject | Array<keyValueInputCustomerFields>  = this.getNodeParameter('customCustomerFeildsKeyValue', itemIndex, '') as IDataObject;
				// 			if(customCustomerFeildsKeyValue){
				// 				customCustomerFeildsKeyValue = customCustomerFeildsKeyValue.additional_fields as Array<keyValueInputCustomerFields>;
				// 			}

				// 			// conditionally assign json custom customer data
				// 			const customCustomerFeildsJsonGetter = this.getNodeParameter('customCustomerFeildsJson', itemIndex, '') as string;
				// 			let customCustomerFeildsJson: customCustomerFields | undefined;
				// 			if(customCustomerFeildsJsonGetter){
				// 				customCustomerFeildsJson = JSON.parse(customCustomerFeildsJsonGetter) as customCustomerFields;
				// 			}

				// 			// Set custom customer data based on field inputs
				// 			let customCustomerDetails: customCustomerFields;
				// 			if(customCustomerFeildsJson){
				// 				customCustomerDetails = customCustomerFeildsJson;
				// 			} else {
				// 				customCustomerDetails = {};
				// 			}

				// 			let defaultcustomerDetails: defaultCustomerFields = {
				// 				"name": customerName,
				// 				"email": customerEmail,
				// 			}

				// 			if(customerPhone){
				// 				defaultcustomerDetails['phone_number'] = customerPhone;
				// 			}

				// 			if(customCustomerFeildsKeyValue){
				// 				customCustomerFeildsKeyValue.forEach(data => {
				// 					customCustomerDetails[data.name] = data.value;
				// 				});
				// 			}


				// 			let formData: createBookingBody = {
				// 				"service_id": serviceId,
				// 				"staff_id": staffId,
				// 				"from_time": DateTime.fromFormat(startTime, "yyyy-MM-dd HH:mm:ss").toFormat('dd-MMM-yyyy HH:mm:ss'),
				// 				// "customer_details": JSON.stringify({...defaultcustomerDetails, ...customCustomerDetails})
				// 				"customer_details": JSON.stringify({...defaultcustomerDetails,})
				// 			}

				// 			if(customCustomerDetails){
				// 				formData.additional_fields = JSON.stringify(customCustomerDetails);
				// 			}

				// 			if(resourceId) {
				// 				formData.resource_id = resourceId;
				// 			}

				// 			if(groupId) {
				// 				formData.group_id = groupId;
				// 			}

				// 			if(timeZone){
				// 				checkTimeZone(this.getNode(), timeZone, itemIndex);
				// 				formData.time_zone = timeZone;
				// 			}



				// 			const options: IHttpRequestOptions = {

				// 				url: `${baseUrl}/appointment`,
				// 				method: 'POST',
				// 				body:formData,
				// 				json: false,
				// 				headers: {
				// 					"content-type":"multipart/form-data"
				// 				}
				// 			};

				// 				const response = await this.helpers.httpRequestWithAuthentication.call(
				// 				this,
				// 				'zohoBookingsOAuth2Api',
				// 				options,
				// 			);

				// 			item.json['zohoResponse'] = response;

				// 		}


				}


				} catch (error) {

					// This node should never fail but we want to showcase how
					// to handle errors.
					if (this.continueOnFail()) {
						items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
					} else {
						// Adding `itemIndex` allows other workflows to handle this error
						if (error.context) {
							// If the error thrown already contains the context property,
							// only append the itemIndex
							error.context.itemIndex = itemIndex;
							throw error;
						}
						throw new NodeOperationError(this.getNode(), error, {
							itemIndex,
						});
					}
				}
			}

			return this.prepareOutputData(items);
		}



}
