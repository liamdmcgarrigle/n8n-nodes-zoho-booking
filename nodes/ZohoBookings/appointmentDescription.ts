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
				name: 'Update Appointment Detals',
				value: 'updateAppointment',
				action: 'Update appointment',
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
	// 					SIMILAR FIELDS
	// --------------------------------------
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
		placeholder: '#appt-00084',


	},

	{
		displayName: 'Appointment ID',
		name: 'appointmentId',
		required: true,
		type: 'string',
		default: '',
		description: 'The "Booking ID" field on the appointment page. It is unfortunately not available through the URL.',
		placeholder: '#appt-00084',


		displayOptions: {
					show: {
						operation: [
							'rescheduleAppointment',
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
				]
			},
		},
	},

	{
		displayName: 'The customer details is not handled very well by the Zoho API. PUT HERE WHETHER PUTTING THE SAME INFO WILL RESULT IN IT MATCHING OR MAKING A NEW ONE See the docs on github for more details.',
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





	// {
	// 	displayName: 'Custom Customer Values',
	// 	name: 'customCustomerValues',
	// 	type: 'fixedCollection',
	// 	default: {},
	// 	typeOptions: {
	// 		multipleValues: true,
	// 	},
	// 	options: [
	// 		{
	// 			name: 'additional_fields',
	// 			displayName: 'Additional Fields',
	// 			values: [
	// 				{
	// 					displayName: 'Name',
	// 					name: 'name',
	// 					type: 'string',
	// 					default: '',
	// 					placeholder: 'Favorite_Color',
	// 					description: 'Exact name of your custom contact/customer field',
	// 				},
	// 				{
	// 					displayName: 'Value',
	// 					name: 'value',
	// 					type: 'string',
	// 					default: '',
	// 					placeholder: 'Blue',
	// 					description: 'Value to set for the custom field',
	// 				},
	// 			],
	// 		},
	// 	],
	// 	displayOptions: {
	// 		show: {
	// 			operation: [
	// 				'bookAppointment',
	// 			]
	// 		},
	// 	},
	// },















	// Event uid for get event details

	// new calendar id
	// {
	// 	displayName: 'New Calendar UID',
	// 	name: 'newCalendarId',
	// 	required: true,
	// 	type: 'string',
	// 	default: '',
	// 	placeholder: '79dc7305aede44d8e7874351d00f9641',
	// 	description: 'The UID of the calendar you want to move the event to',
	// 	displayOptions: {
	// 		show: {
	// 			operation: [
	// 				'moveEvent',
	// 			]
	// 		},
	// 	},
	// },
	{
		displayName: 'Event Title',
		name: 'eventTitle',
		required: true,
		type: 'string',
		default: '',
		placeholder: 'My Really Cool Event',
		description: 'Title of the event to be added',
		displayOptions: {
			show: {
				operation: [
					'createNewEvent',
				]
			},
		},
	},
	{
		displayName: 'Update Event Title',
		name: 'updateEventTitle',
		type: 'string',
		default: '',
		placeholder: 'My Really Cool Event',
		description: 'Update title of event. Leave blank to keep original name.',
		displayOptions: {
			show: {
				operation: [
					'updateEvent',
				]
			},
		},
	},
	{
		displayName: 'Start Time',
		name: 'startTime',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: {
				operation: [
					'createNewEvent',
				]
			},
		},
	},
	{
		displayName: 'End Time',
		name: 'endTime',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: {
				operation: [
					'createNewEvent',

				]
			},
		},
	},
	{
		displayName: 'Change Start Time',
		name: 'startTime',
		type: 'dateTime',
		default: '',
		description: 'Leave blank to keep the same start time',
		displayOptions: {
			show: {
				operation: [
					'updateEvent',
				]
			},
		},
	},
	{
		displayName: 'Change End Time',
		name: 'endTime',
		type: 'dateTime',
		default: '',
		description: 'Leave blank to keep the same end time',
		displayOptions: {
			show: {
				operation: [
					'updateEvent',

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
	{
		displayName: 'Time Zone',
		name: 'timeZone',
		type: 'string',
		default: '={{ $now.format(\'z\') }}',
		required: true,
		description: 'The time zone of the event',
		displayOptions: {
			show: {
				operation: [
					'createNewEvent',
					'getEventsList',
				]
			},
		},
	},
	{
		displayName: 'Time Zone',
		name: 'timeZone',
		type: 'string',
		default: '',
		description: 'The updated time zone of the event. Leave blank to keep the same. If changed without new time input, it will convert the currect event time to the new time zone.',
		displayOptions: {
			show: {
				operation: [
					'updateEvent',
				]
			},
		},
	},
	{
		displayName: 'Event Description',
		name: 'eventDescription',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		default: '',
		placeholder: 'Liam\'s birthday party. Don\'t forget a gift.',
		displayOptions: {
			show: {
				operation: [
					'createNewEvent',
					'updateEvent',
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
				// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
				options: [
					...countryDomains
				],
				// eslint-disable-next-line n8n-nodes-base/node-param-default-wrong-for-options
				default: '.com', // The initially selected option
			},


		],
	},
	// attachment id for get attachment details
	{
		displayName: 'File ID',
		name: 'attachmentId',
		required: true,
		type: 'string',
		default: '',
		placeholder: '08cfc73476024a75a957c0524691a250@zoho.com',
		description: 'The ID of the attachement you want. Find the ID by using a \'Get Event Details\' node first.',
		displayOptions: {
			show: {
				operation: [
					'downloadAttachment',
				]
			},
		},
	},
]

