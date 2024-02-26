import { INodeProperties } from "n8n-workflow";
import { countryDomains } from "./GenericFunctions";

export const appointmentOperations: INodeProperties[] = [

	// 					METHOD SELECTOR
	// --------------------------------------
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'appointmentActions',
				]
			},
		},
		// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
		options: [
			{
				name: 'Book Appointment',
				value: 'bookAppointment',
				action: 'Book appointment',
			},
			{
				name: 'Reschedule Appointment',
				value: 'rescheduleAppointment',
				action: 'Reschedule appointment',
			},
			{
				name: 'Get Appointment Details',
				value: 'getAppointment',
				action: 'Get appointment',
			},
			{
				name: 'Cancel Appointment',
				value: 'cancelAppointment',
				action: 'Cancel appointment',
			},
			{
				name: 'Mark As No Show',
				value: 'markAsNoShow',
				action: 'Mark as no show',
			},
			{
				name: 'Mark As Completed',
				value: 'markAsCompleted',
				action: 'Mark as completed',
			},
		],
		default: 'bookAppointment',

	},
]

export const appointmentFields: INodeProperties[] = [

	// TEMP WHILE RESCHEDULE DOESNT WORK
	{
		displayName: 'This functionality currently does not work due to Zoho\'s API being broken. I intend to get this updated as soon as Zoho support gets back to me and fixes the issue.',
		name: 'notice',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				operation: [
					'rescheduleAppointment',
				]
			},
		},
	},
	{
		displayName: 'This will only work after the appointment has started. See docs for more info.',
		name: 'notice',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				operation: [
					'markAsNoShow',
					'markAsCompleted',
				]
			},
		},
	},


	// 					SIMILAR FIELDS
	// --------------------------------------
	{
		displayName: 'Booking ID',
		name: 'bookingId',
		required: true,
		type: 'string',
		default: '',
		description: 'The Booking ID listed under the "Booking ID" field on the appointment page',
		placeholder: '#appt-06594',
		displayOptions: {
			show: {
				operation: [
					// 'rescheduleAppointment',
					'updateAppointment',
					'getAppointment',
					'cancelAppointment',
					'markAsNoShow',
					'markAsCompleted',
				]
			},
		},
	},
	{
		displayName: 'Service ID',
		name: 'serviceId',
		required: true,
		type: 'string',
		default: '',
		description: 'The service ID. It is the number in the URL field when in the service page.',
		placeholder: '4378218000000746058',
		displayOptions: {
			show: {
				operation: [
					'bookAppointment',
				]
			},
		},
	},

	{
		displayName: 'Staff ID',
		name: 'staffId',
		required: true,
		type: 'string',
		default: '',
		placeholder: '4378218000009548412',
		displayOptions: {
			show: {
				operation: [
					'bookAppointment',
				]
			},
		},
	},

	{
		displayName: 'Start Time',
		name: 'startTime',
		type: 'dateTime',
		default: '',
		description: "Match format: dd-MMM-yyyyTHH:mm:ss",
		placeholder: "30-Apr-2019T22:30:00",
		displayOptions: {
			show: {
				operation: [
					'bookAppointment',
					// 'rescheduleAppointment',
				]
			},
		},
	},

	{
		displayName: 'The customer details is not handled very well by the Zoho API. This will merge with an exising customer if the info matches. See the docs on github for more details.',
		name: 'notice',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				operation: [
					'bookAppointment',
				]
			},
		},
	},


	{
		displayName: 'Customer Full Name',
		name: 'customerName',
		type: 'string',
		placeholder: 'John Smith',
		default: '',
		required: true,
		displayOptions: {
			show: {
				operation: [
					'bookAppointment',
				]
			},
		},

	},
	{
		displayName: 'Customer Email',
		name: 'customerEmail',
		type: 'string',
		default: '',
		placeholder: 'name@email.com',
		required: true,
		displayOptions: {
			show: {
				operation: [
					'bookAppointment',
				]
			},
		},

	},
	{
		displayName: 'Customer Phone',
		placeholder: '(215) 555-5555',
		name: 'customerPhone',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				operation: [
					'bookAppointment',
				]
			},
		},

	},


	{
		displayName: 'Custom Fields Input Type',
		name: 'customFieldsInputType',
		type: 'options',
		displayOptions: {
			show: {
				operation: [
					'bookAppointment',
				]
			},
		},
		options: [
			{
				name: 'Key Value',
				value: 'keyValue',
			},
			{
				name: 'JSON',
				value: 'json',
			},
		],
		default: 'keyValue',
		description: 'Content-Type to use to send custom fields',
	},

	{
		displayName: 'Custom Customer Fields',
		name: 'customCustomerFeildsKeyValue',
		type: 'fixedCollection',
		default: {},
		typeOptions: {
			multipleValues: true,
		},
		options: [
			{
				name: 'additional_fields',
				displayName: 'Additional Fields',
				values: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						placeholder: 'Street Address',
						description: 'Exact name of your custom contact/customer field',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: '1234 Street rd Philadelphia PA',
						description: 'Value to set for the custom field',
					},
				],
			},
		],
		displayOptions: {
			show: {
				operation: [
					'bookAppointment',
				],
				customFieldsInputType: [
					'keyValue',
				]
			},
		},
	},
	{
		displayName: 'Custom Customer Fields',
		name: 'customCustomerFeildsJson',
		type: 'json',
		default: '{ \n  "fieldname":"field value",\n  "fieldname2":"field value2" \n}',

		displayOptions: {
			show: {
				operation: [
					'bookAppointment',
				],
				customFieldsInputType: [
					'json',
				]
			},
		},
	},

	// Range for get events search
	{
		displayName: 'Start Of Search Range',
		name: 'startOfSearchRangeTime',
		type: 'dateTime',
		required: true,
		description: 'Start DateTime for range to get calendar events from. Range must be under 31 days.',
		default: '',
		displayOptions: {
			show: {
				operation: [
					'getEventsList',
				]
			},
		},
	},
	{
		displayName: 'End Of Search Range',
		name: 'endOfSearchRangeTime',
		type: 'dateTime',
		required: true,
		description: 'End DateTime for range to get calendar events from. Range must be under 31 days.',
		default: '',
		displayOptions: {
			show: {
				operation: [
					'getEventsList',
				]
			},
		},
	},



	//
	//
	// ADDITINAL FIELDS FOR MAKING NEW APPOINTMENT
	//

	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		default: {},
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				operation: [
					'bookAppointment',
				]
			},
		},
		options: [
			{
				displayName: 'Resource ID',
				name: 'resourceId',
				type: 'string',
				default: '',
				placeholder: '#appt-00084',

				routing: {
					request: {
						body: {
							"resource_id":"=${{value}}"
						}
					},
				},
			},

			{
				displayName: 'Group ID',
				name: 'groupId',
				type: 'string',
				default: '',
				description: 'For collective booking a group ID is required',
				placeholder: '#appt-00084',

				routing: {
					request: {
						body: {
							"group_id":"=${{value}}"
						}
					},
				},
			},
			{
				displayName: 'Time Zone',
				name: 'timeZone',
				type: 'string',
				default: '={{ $now.format(\'z\') }}',
				description: 'The time zone of the event. Format like "America/New_York".',
			},
			{
				displayName: 'Zoho Region',
				name: 'region',
				type: 'options',
				noDataExpression: true,
				options: [
					...countryDomains
				],
				// eslint-disable-next-line n8n-nodes-base/node-param-default-wrong-for-options
				default: '.com',
			},


		],
	},

	//
	//
	// ADDITINAL FIELDS FOR UPDATING APPOINTMENT
	//

	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		default: {},
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				operation: [
					// 'rescheduleAppointment',
				]
			},
		},
		options: [
			{
				displayName: 'Time Zone',
				name: 'timeZone',
				type: 'string',
				default: '={{ $now.format(\'z\') }}',
				description: 'The time zone of the event. Format like "America/New_York".',
			},
			{
				displayName: 'Zoho Region',
				name: 'region',
				type: 'options',
				noDataExpression: true,
				options: [
					...countryDomains
				],
				// eslint-disable-next-line n8n-nodes-base/node-param-default-wrong-for-options
				default: '.com',
			},


		],
	},

]

