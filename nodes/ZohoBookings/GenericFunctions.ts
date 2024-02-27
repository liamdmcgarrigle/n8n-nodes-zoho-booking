import {
	IExecuteFunctions,
	IHttpRequestOptions,
	INode,
	NodeOperationError,
} from "n8n-workflow";
const { DateTime } = require("luxon");

/**
 * Checks to ensure timezone exists and is formatted to match `America/New_York`
 *
 * First will return error if `/` is not in the string
 *
 * Then checks Luxon to see if it is valid
 *
 * Pass in `this.getNode()` for the `node` parameter
 */
export function checkTimeZone (node: INode,  timeZone: string, itemIndex: number ) {
	if (timeZone.indexOf('/') === -1) {
		const description = `The timezone '${timeZone || ' '}' in the 'Time Zone' field isn't valid. Hint: Format your timezone like 'America/New_York', format a DateTime using '.format('z')', or use the expression '{{ $now.format('z') }}' to get the current workflows default time zone in the correct format.`;
		throw new NodeOperationError(node, 'Invalid time zone', {
			description,
			itemIndex,
		});
	} else {
		const tzTest = DateTime.local().setZone(timeZone);
		if(!tzTest.isValid) {
			const description = `The timezone '${timeZone || ' '}' in the 'Time Zone' field isn't valid. Luxon reason: ${tzTest.invalidReason}`;
			throw new NodeOperationError(node, 'Time zone not valis', {
				description,
				itemIndex,
			});
		}
	}

	return
}

/**
 * Checks to ensure the start time happens before the end time
 *
 * Pass in `this.getNode()` for the `node` parameter
 */
export function checkStartBeforeEnd(node: INode, startTime: typeof DateTime, endTime: typeof DateTime, itemIndex: number) {
  if (startTime > endTime) {
    const description = `The start time '${startTime.toFormat('LLL dd yyyy HH:mm:ss') || ' '}' happens after the end time '${endTime.toFormat('LLL dd yyyy HH:mm:ss') || ' '}'.`;
    throw new NodeOperationError(node, 'Start time is after the end time', {
      description,
      itemIndex,
    });
  }

	return
}

/**
 * Checks to ensure the start and end time exist
 *
 * Pass in the field values before they are converted to DateTime so this is what throws the error
 *
 * Pass in `this.getNode()` for the `node` parameter
 */
export function checkTimesExist (node: INode,  time: string, itemIndex: number ) {
	if (time === '' || time === undefined) {
		const description = `The start time and end time are required`;
		throw new NodeOperationError(node, 'Start time and/or end time is missing', {
			description,
			itemIndex,
		});
	}

	return
}

export const countryDomains = [
	{
		name: 'United States of America',
		value: '.com',
	},
	{
		name: 'European Union',
		value: '.eu',
	},
	{
		name: 'India',
		value: '.in',
	},
	{
		name: 'Australia',
		value: '.com.au',
	},
	{
		name: 'China',
		value: '.com.cn',
	},
]
export interface defaultCustomerFields {
	"name": string,
	"email": string,
	"phone_number"?: string
}

export interface customCustomerFields {
	[key: string]: any
}

export interface keyValueInputCustomerFields {
	"name":string,
	"value":string
}

export interface createBookingBody {
	"service_id": string,
	"staff_id"?: string,
	"from_time": Date,
	"customer_details": string,
	"time_zone"?: string,
	"resource_id"?: string,
	"group_id"?: string,
	"additional_fields"?: string,
}

export interface rescheduleBookingBody {
	"staff_id"?: string,
	"booking_id": string,
	"start_time"?: string,
	"iso_start_time"?: string
	"time_zone"?: string,
}




export async function getBookingDetails(executeDetails: IExecuteFunctions, baseUrl: string, bookingId: string)  {

	const options: IHttpRequestOptions = {
		url: `${baseUrl}/getappointment?booking_id=${bookingId.replace('#', '')}`,
		method: 'GET',
		json: false,
		headers: {
			"content-type":"multipart/form-data"
		}
	};

		return await executeDetails.helpers.httpRequestWithAuthentication.call(
			executeDetails,
			'zohoBookingsOAuth2Api',
			options,
	);

}


export async function updateBookingStatus(executeDetails: IExecuteFunctions, baseUrl: string, bookingId: string, updatedStatus: "completed" | "cancel" | "noshow" )  {


	let formData = {
		"booking_id": bookingId,
		"action": updatedStatus,
	}

	const options: IHttpRequestOptions = {
		url: `${baseUrl}/updateappointment`,
		method: 'POST',
		json: false,
		body: formData,
		headers: {
			"content-type":"multipart/form-data"
		}
	};

		return await executeDetails.helpers.httpRequestWithAuthentication.call(
			executeDetails,
			'zohoBookingsOAuth2Api',
			options,
	);

}


/**
 * Returns an array of dates in dd-MMM-yyyy 00:00:00` format (The time is always `00:00:00`) from a given start and end date.
 *
 * Any date input string will work and it will be used automatically using the luxon library
 *
 * Can accept date range longer than 60 days but will only create the list up to 60 dates
 */
export function makeListOfDates(
	startDateIn: string,
	endDateIn: string
 ) {
	const startDate = DateTime.fromISO(startDateIn, { zone: 'utc' });
  const endDate = DateTime.fromISO(endDateIn, { zone: 'utc' }).startOf('day');
  const dates: string[] = [];

  let currentDate = startDate.startOf('day');
  const maxDays = 60;

  while (currentDate <= endDate && dates.length < maxDays) {
    dates.push(currentDate.toFormat("dd-MMM-yyyy"));
    currentDate = currentDate.plus({ days: 1 });
  }

  return dates.map(date => `${date} 00:00:00`);

}


/**
 * Gets a availability for a specific staff on a specific date
 *
 * Pass in Date string in format `dd-MMM-yyyy HH:mm:ss`
 *
 * Pass in `this` into first parameter
 */
export async function getAvailabilityForSingleDate(
	executeDetails: IExecuteFunctions,
	baseUrl: string,
	serviceId: string,
	staffId: string,
	date: string,
	)  {


	let qsData = {
		"service_id": serviceId,
		"staff_id": staffId,
		"selected_date":date
	}

	const options: IHttpRequestOptions = {
		url: `${baseUrl}/availableslots`,
		method: 'GET',
		qs: qsData,
	};

		return await executeDetails.helpers.httpRequestWithAuthentication.call(
			executeDetails,
			'zohoBookingsOAuth2Api',
			options,
	);
}


export async function getAvailabilityForDateRange(
	executeDetails: IExecuteFunctions,
	baseUrl: string,
	serviceId: string,
	staffId: string,
	startDateIn: string,
	endDateIn: string
) {

	const dates = makeListOfDates(
		startDateIn,
		endDateIn
	 )

	let availableTimes = [];

	for(const date of dates) {
		const response = await getAvailabilityForSingleDate(
			executeDetails,
			baseUrl,
			serviceId,
			staffId,
			date,
		)

		const formattedDate = date.split(' ')[0]

		if(response.response.returnvalue.data !== 'Slots Not Available'){
			for(const time of response.response.returnvalue.data) {
				availableTimes.push(`${formattedDate} ${time}`);
			}
		}

	}

	return availableTimes;
}


export async function fetchStaff(executeDetails: IExecuteFunctions, baseUrl: string, staffId?: string, serviceId?: string)  {

	let options: IHttpRequestOptions;
	if(staffId){
		options = {
			url: `${baseUrl}/staffs?&staff_id=${staffId}`,
			method: 'GET',
		};
	} else if(serviceId) {
		options = {
			url: `${baseUrl}/staffs?&service_id=${serviceId}`,
			method: 'GET',
		};
	} else {
		options = {
			url: `${baseUrl}/staffs`,
			method: 'GET',
		};
	}

		return await executeDetails.helpers.httpRequestWithAuthentication.call(
			executeDetails,
			'zohoBookingsOAuth2Api',
			options,
	);

}

export async function fetchWorkspace(executeDetails: IExecuteFunctions, baseUrl: string, workspaceId?: string)  {

	let options: IHttpRequestOptions;
	if(workspaceId){
		options = {
			url: `${baseUrl}/workspaces?&workspace_id=${workspaceId}`,
			method: 'GET',
		};
	} else {
		options = {
			url: `${baseUrl}/workspaces`,
			method: 'GET',
		};
	}

		return await executeDetails.helpers.httpRequestWithAuthentication.call(
			executeDetails,
			'zohoBookingsOAuth2Api',
			options,
	);

}

export async function fetchService(executeDetails: IExecuteFunctions, baseUrl: string, workspaceId: string, staffId?: string, serviceId?: string)  {

	let options: IHttpRequestOptions;
	if(staffId){
		options = {
			url: `${baseUrl}/services?&workspace_id=${workspaceId}&staff_id=${staffId}`,
			method: 'GET',
		};
	} else if(serviceId) {
		options = {
			url: `${baseUrl}/services?&workspace_id=${workspaceId}&service_id=${serviceId}`,
			method: 'GET',
		};
	} else {
		options = {
			url: `${baseUrl}/services?&workspace_id=${workspaceId}`,
			method: 'GET',
		};
	}

		return await executeDetails.helpers.httpRequestWithAuthentication.call(
			executeDetails,
			'zohoBookingsOAuth2Api',
			options,
	);

}

export async function fetchResource(executeDetails: IExecuteFunctions, baseUrl: string, resourcesId?: string, serviceId?: string)  {

	let options: IHttpRequestOptions;
	if(resourcesId){
		options = {
			url: `${baseUrl}/resources?&resource_id=${resourcesId}`,
			method: 'GET',
		};
	} else if(serviceId) {
		options = {
			url: `${baseUrl}/resources?service_id=${serviceId}`,
			method: 'GET',
		};
	} else {
		options = {
			url: `${baseUrl}/resources?`,
			method: 'GET',
		};
	}

		return await executeDetails.helpers.httpRequestWithAuthentication.call(
			executeDetails,
			'zohoBookingsOAuth2Api',
			options,
	);

}



