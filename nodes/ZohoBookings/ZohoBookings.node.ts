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
	checkStartBeforeEnd,
	checkTimeZone,
	checkTimesExist,
	createBookingBody,
	customCustomerFields,
	defaultCustomerFields,
	fetchResource,
	fetchService,
	fetchStaff,
	fetchWorkspace,
	getAvailabilityForDateRange,
	getBookingDetails,
	keyValueInputCustomerFields,
	updateBookingStatus,
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
						if( this.getNodeParameter('operation', 0) === 'rescheduleAppointment' ) {

	// This is very annoyingly not working. I tried to debug their api for hours but the issue is definitly on their side
	// I am moving on for now and will come back to this.
	// i posed here https://help.zoho.com/portal/en/community/topic/issues-with-reschedule-api
	// hopefully someone will help me



						// 	const bookingId = this.getNodeParameter('bookingId', itemIndex, '') as string;
						// 	const startTime = this.getNodeParameter('startTime', itemIndex, '') as string;
						// 	const additionalFields = this.getNodeParameter('additionalFields', itemIndex) as IDataObject;
						// 	const timeZone = additionalFields.timeZone as string;

						// 	// const apptInfo = await getBookingDetails(this, baseUrl, bookingId);

						// 	let formData: rescheduleBookingBody = {
						// 		"booking_id": bookingId,
						// 		// "start_time": DateTime.fromFormat(startTime, "yyyy-MM-dd HH:mm:ss").toFormat('dd-MMM-yyyy HH:mm:ss'),
						// 		"start_time": DateTime.fromFormat(startTime, "yyyy-MM-dd HH:mm:ss").toFormat('dd-MMM-yyyy HH:mm:ss'),

						// 		// "staff_id": apptInfo.response.returnvalue.staff_id,
						// 	}

						// 	if(timeZone){
						// 		checkTimeZone(this.getNode(), timeZone, itemIndex);
						// 		formData.time_zone = timeZone;
						// 	}

						// 	const options: IHttpRequestOptions = {
						// 		url: `${baseUrl}/rescheduleappointment`,
						// 		method: 'POST',
						// 		body:formData,
						// 		json: false,
						// 		headers: {
						// 			"content-type":"multipart/form-data",
						// 		}
						// 	};

						// 		const response = await this.helpers.httpRequestWithAuthentication.call(
						// 		this,
						// 		'zohoBookingsOAuth2Api',
						// 		options,
						// 	);

						// 	item.json['zohoResponse'] = response;

							}



						// --------------------------------------------------------------------------------
						// ---------------------------- Get Appointment Details ---------------------------
						// --------------------------------------------------------------------------------
						if( this.getNodeParameter('operation', 0) === 'getAppointment' ) {

							const bookingId = this.getNodeParameter('bookingId', itemIndex, '') as string;


							const response = await getBookingDetails(this, baseUrl, bookingId);


							item.json['zohoResponse'] = response;

						}


						// --------------------------------------------------------------------------------
						// ------------------------------ Cancel Appointment  -----------------------------
						// --------------------------------------------------------------------------------
						if( this.getNodeParameter('operation', 0) === 'cancelAppointment' ) {

							const bookingId = this.getNodeParameter('bookingId', itemIndex, '') as string;

							const response = await updateBookingStatus(
								this,
								baseUrl,
								bookingId,
								"cancel"
								)


							item.json['zohoResponse'] = response;

						}

						// --------------------------------------------------------------------------------
						// -------------------------------- Set as No Show  -------------------------------
						// --------------------------------------------------------------------------------
						if( this.getNodeParameter('operation', 0) === 'markAsNoShow' ) {

							const bookingId = this.getNodeParameter('bookingId', itemIndex, '') as string;

							const response = await updateBookingStatus(
								this,
								baseUrl,
								bookingId,
								"noshow"
								)


							item.json['zohoResponse'] = response;

						}

						// --------------------------------------------------------------------------------
						// ------------------------------ Set as Completed  -------------------------------
						// --------------------------------------------------------------------------------
						if( this.getNodeParameter('operation', 0) === 'markAsCompleted' ) {

							const bookingId = this.getNodeParameter('bookingId', itemIndex, '') as string;

							const response = await updateBookingStatus(
								this,
								baseUrl,
								bookingId,
								"completed"
								)


							item.json['zohoResponse'] = response;

						}


					} // appt operations

					if( this.getNodeParameter('resource', 0) === 'otherActions' ) {

						// --------------------------------------------------------------------------------
						// ------------------------------ Get Availability  -------------------------------
						// --------------------------------------------------------------------------------
						if( this.getNodeParameter('operation', 0) === 'getAvailability' ) {

							const serviceId = this.getNodeParameter('serviceId', itemIndex, '') as string;
							const staffId = this.getNodeParameter('staffId', itemIndex, '') as string;
							const startDate = this.getNodeParameter('startOfSearchRangeTime', itemIndex, '') as string;
							const endDate = this.getNodeParameter('endOfSearchRangeTime', itemIndex, '') as string;

							checkTimesExist(this.getNode(),startDate, itemIndex);
							checkTimesExist(this.getNode(),endDate, itemIndex);
							checkStartBeforeEnd(this.getNode(), startDate, endDate, itemIndex);




							const response = await getAvailabilityForDateRange(
								this,
								baseUrl,
								serviceId,
								staffId,
								startDate,
								endDate
							)

							item.json['availableTimeSlots'] = response;

						}



						// --------------------------------------------------------------------------------
						// ---------------------------------- Get Staff -----------------------------------
						// --------------------------------------------------------------------------------
						if( this.getNodeParameter('operation', 0) === 'getStaff' ) {

							const staffId = this.getNodeParameter('staffId', itemIndex, '') as string;
							const serviceId = this.getNodeParameter('serviceId', itemIndex, '') as string;


							const response = await fetchStaff(
								this,
								baseUrl,
								staffId,
								serviceId
							)


							item.json['staffInfo'] = response;

						}

						// --------------------------------------------------------------------------------
						// ------------------------------- Get Workspace(s) -------------------------------
						// --------------------------------------------------------------------------------
						if( this.getNodeParameter('operation', 0) === 'getWorkspace' ) {
							const workspaceId = this.getNodeParameter('workspaceId', itemIndex, '') as string;


							const response = await fetchWorkspace(
								this,
								baseUrl,
								workspaceId
							)


							item.json['workspaceInfo'] = response;

						}

						// --------------------------------------------------------------------------------
						// -------------------------------- Get Services ----------------------------------
						// --------------------------------------------------------------------------------
						if( this.getNodeParameter('operation', 0) === 'getServices' ) {

							const staffId = this.getNodeParameter('staffId', itemIndex, '') as string;
							const workspaceId = this.getNodeParameter('workspaceId', itemIndex, '') as string;
							const serviceId = this.getNodeParameter('serviceId', itemIndex, '') as string;


							const response = await fetchService(
								this,
								baseUrl,
								workspaceId,
								staffId,
								serviceId
							)


							item.json['serviceInfo'] = response;

						}

						// --------------------------------------------------------------------------------
						// ------------------------------- Get Resources ----------------------------------
						// --------------------------------------------------------------------------------
						if( this.getNodeParameter('operation', 0) === 'getResources' ) {

							const resourcesId = this.getNodeParameter('resourcesId', itemIndex, '') as string;
							const serviceId = this.getNodeParameter('serviceId', itemIndex, '') as string;


							const response = await fetchResource(
								this,
								baseUrl,
								resourcesId,
								serviceId,
							)


							item.json['resourcesInfo'] = response;

						}



					} // other operations




				} catch (error) {

					if (this.continueOnFail()) {
						items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
					} else {

						if (error.context) {

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
