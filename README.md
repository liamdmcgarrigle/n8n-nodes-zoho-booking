# Table of Contents
- [Table of Contents](#table-of-contents)
- [Overview of Community Zoho Calendar n8n Node](#overview-of-community-zoho-calendar-n8n-node)
- [If you want a custom node](#if-you-want-a-custom-node)
- [Bugs/Contributing/Feature Request](#bugscontributingfeature-request)
- [Documentation](#documentation)
	- [How to install](#how-to-install)
	- [Set up your Zoho OAuth Client](#set-up-your-zoho-oauth-client)
	- [Unexpected Error Trouble Shooting](#unexpected-error-trouble-shooting)
		- [Handling Errors](#handling-errors)
	- [Book Appointment](#book-appointment)
		- [Resource Booking](#resource-booking)
		- [Group Booking (Multiple Customers)](#group-booking-multiple-customers)
		- [Collective Booking (Multiple Staff)](#collective-booking-multiple-staff)
		- [Mark as Completed/No Show](#mark-as-completedno-show)

# Overview of Community Zoho Calendar n8n Node
I created this node because an organization I am affiliated with uses Zoho software and I would like to make it easier for our users to automate with n8n.  \
Also, many of my clients use Zoho products, so making a suite of Zoho nodes will help get them aboard the n8n train! Choo chooooo 🚂


I will focus more on the documentation and readme after I am finished making the functionality of the actual node.

# If you want a custom node
Please reach out to me using the info on [my GitHub page](https://github.com/liamdmcgarrigle).  \
Nodes can be built for the community as well as privately just for one organization.

# Bugs/Contributing/Feature Request

If you have a bug to report or a feature request, please [submit a GitHub issue](https://github.com/liamdmcgarrigle/n8n-nodes-zoho-bookings/issues/new) with as much detail as you're able to give.

Feel free to submit PRs, but please get in touch with me first to make sure I am willing to add the feature before you spend the time on it.

# Documentation
## How to install
This can only be installed if you are self-hosting n8n.

In n8n, go to the settings
On the bottom of the left sidebar, press "Community nodes"
Press the Install button and add the package name n8n-nodes-zoho-bookings
Check the box and press install. It should now be available for you to use in workflows
Set Up Credentials
Go to create a new credential in n8n It is named "Zoho Bookings OAuth2 API"

## Set up your Zoho OAuth Client

Go [here](https://api-console.zoho.com/) and create a "Server-based Application"
In the homepage url field add your n8n instances url.

In the Authorized Redirect URIs field, add the redirect URI from the n8n credential page as well as `https://bookings.zoho.com/`

Then press the "Create" button

Copy and Paste your client and secret ID into n8n's credential page

Press the Connect My Account button and agree to the popup

## Unexpected Error Trouble Shooting
Due to the nature of Zoho Bookings, the customizable settings, and the limits of their API, the errors are unforgiving and don't give much info.  \
Normally to counteract these types of unexpected errors I would add a search API call step before any PUT call, but the GET calls don't return much info and leave out the customized settings.

Here is a list that I will try to keep updated of areas to check if you're getting unexpected vague errors.
- The appointment was set in the past
- The appointment is too soon in the future and conflicts with your preferences
- Setting resource appointments without the resource ID in _"Additional Fields"_

### Handling Errors
You should manually check in your workflow to ensure you won't meet any of those conditions that cause unexpected errors.  \
For example, check with a time node to ensure your start time is enough distance away for your custom policies.

## Book Appointment 
WARNING: You need to include all of your own custom required fields for each  _"item"_ in your Bookings account.  \
If you have added more required fields in the Zoho Bookings settings, they will not show up. You must add them under the _"Custom Customer Fields"_ section in the node. 

Zoho does not let you see the API names from their UI. One way you can get them is by making a request without them included and they will send you a list of the API names that are missing. You can copy and paste from that list.

To dynamically add data from a previous lookup step, change the _"Custom Customer Fields"_ input type to _"JSON"_.

### Resource Booking
You will first need to create a _"Resource Booking"_ in your service page in Zoho Bookings.

To book that _"Resource Booking"_ appointment in this node, pass the ID of that resource service you just made into the _"Service ID"_ Field and then add the Resource ID in the _"Resource ID"_ Field under _"Additional Fields"_

Unfortunately, at the time of writing this, it does not seem possible to book appointments with both a staff and a resource associated, even for group and collective bookings.  \
You could work around this with an n8n workflow and create a resource booking whenever a specific service is created and edit it when edited, etc. 

### Group Booking (Multiple Customers)
Book with a group booking by passing:
- The service ID made for the group in the services section
- The staff ID assigned to the the group in the services section

Everything else can be filled an normal.

### Collective Booking (Multiple Staff)
This does not currently seem possible due to the staff group IDs not being public.  \
I left the _"Group ID"_ field under _"Additional Fields"_, though it is not tested because I could not find any staff group IDs to test it with.  

It should work by passing in the service ID in the corresponding field and passing the group ID in the _"Group ID"_ field.


If you figure out how to access the group IDs please [let me know](https://github.com/liamdmcgarrigle)!

### Mark as Completed/No Show
You can not mark an appointment as completed or as a no-show before the start time. It needs to be after the start time.

If you want to set as no-show or complete beforehand, you can make a workaround using n8n. Have a workflow specifically for this use.  \
Have the workflow check the start time of the appointment, then have a wait node set to `resume` at `At Specified Time` and use the appointment start time + a few minutes. 
Then have the node after that be the no-show or completed step. 

There will be a delay, but this is the only option Zoho Bookings gave us.
