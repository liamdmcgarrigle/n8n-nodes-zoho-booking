import { INodeProperties } from "n8n-workflow";
import { countryDomains } from "./GenericFunctions";

export const otherOperations: INodeProperties[] = [

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
					'otherActions',
				]
			},
		},
		// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
		options: [
			{
				name: 'Get Available Times',
				value: 'getAvailability',
				action: 'Get availabile times',
				description: 'Gets a list of available times in a date range',
			},
			{
				name: 'Get Staff',
				value: 'getStaff',
				action: 'Get staff',
				description: 'Gets a list of staff from a service',
			},
			{
				name: 'Get Workspaces',
				value: 'getWorkspaces',
				action: 'Get workspaces',
				description: 'Gets a list of workspaces on accont',
			},
			{
				name: 'Get Services',
				value: 'getServices',
				action: 'Get services',
				description: 'Gets a list of services offered under a workspace',
			},
			{
				name: 'Get Resources',
				value: 'getResources',
				action: 'Get resources',
				description: 'Gets a list of resources on account',
			},
		],
		default: 'getAvailability',
	},
]

export const otherFields: INodeProperties[] = [
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
				resource: [
					'otherActions',
				],
				operation: [
					'getAvailability',
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
					'getAvailability',
				]
			},
		},
	},

	{
		displayName: 'Only search the days you need. Each day in the range will be another API call which will increate runtime and use more API quota and increase loading time. Search will be limited to first 60 days in the range. See more details in the docs.',
		name: 'notice',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				operation: [
					'getAvailability',
				]
			},
		},
	},
	{
		displayName: 'Start Of Search Range',
		name: 'startOfSearchRangeTime',
		type: 'dateTime',
		required: true,
		description: 'Start DateTime for range to get availability from',
		default: '',
		displayOptions: {
			show: {
				operation: [
					'getAvailability',
				]
			},
		},
	},
	{
		displayName: 'End Of Search Range',
		name: 'endOfSearchRangeTime',
		type: 'dateTime',
		required: true,
		description: 'End DateTime for range to get availability from',
		default: '',
		displayOptions: {
			show: {
				operation: [
					'getAvailability',
				]
			},
		},
	},
	//
	//
	// ADDITINAL FIELDS ONLY REGION
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
					'getAvailability',
				]
			},
		},
		options: [
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

