<?php

/**
 *	A dashlet to list upcoming and past events from multiple calendars.
 *	@author Nathan Glasl <nathan@silverstripe.com.au>
 */

class EventDashlet extends Dashlet {

	private static $db = array(
		'OnlyUpcoming' => 'Boolean'
	);

	private static $defaults = array(
		'OnlyUpcoming' => 1
	);

	private static $many_many = array(
		'Calendars' => 'Calendar'
	);

	public static $title = 'Events';

	public static $cmsTitle = 'Events';

	public static $description = 'View Upcoming Events';

	public function getCMSFields() {

		$fields = parent::getCMSFields();
		$fields->push(CheckboxField::create('OnlyUpcoming'));
		$fields->push(MultiSelect2Field::create(
			'Calenders',
			'Calenders',
			Calendar::get()->map()->toArray()
		));
		return $fields;
	}

	public function getDashletFields() {

		$fields = parent::getDashletFields();
		$fields->push(CheckboxField::create('OnlyUpcoming'));
		$fields->push(MultiSelect2Field::create(
			'Calenders',
			'Calenders',
			Calendar::get()->map()->toArray()
		));
		return $fields;
	}

}

class EventDashlet_Controller extends Dashlet_Controller {

	public function getEvents() {

		// Retrieve and merge events for each calendar selection.

		$events = ArrayList::create();
		foreach($this->data()->Calendars() as $calendar) {
			$events->merge($calendar->getEventList(null, null));
		}
		return $events;
	}

}
