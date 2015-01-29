<?php

/**
 * Search listing.
 *
 * @author Nathan Glasl <nathan@silverstripe.com.au>
 */

class SearchDashlet extends Dashlet {
	public static $title = "Search Results";
	public static $cmsTitle = "Search Results";
	public static $description = "List of Search Results";
}

class SearchDashlet_Controller extends Dashlet_Controller {

	private static $allowed_actions = array(
		'SearchForm',
		'results'
	);

	public function init() {
		parent::init();
		Requirements::javascript(THIRDPARTY_DIR . '/jquery-entwine/dist/jquery.entwine-dist.js');
		Requirements::javascript('mysite/javascript/dashlet-searchdashlet.js');
	}

	public function SearchForm() {
		$input = new TextField('Search', '');
		$input->setAttribute('Placeholder', 'Search Term');
		$fields = new FieldList($input);
		$submit = new FormAction('results', 'Search');
		$actions = new FieldList($submit);
		$form = new SearchForm($this, "SearchForm", $fields, $actions);
		$form->addExtraClass('search-dashlet-form');

		return $form;
	}

	public function results($data, $form) {
		$query = $form->getSearchQuery();
		$results = $form->getResults(5);
		
		foreach ($results as $item) {
			$item->URL = $item->hasMethod('Link') ? $item->Link() : $item->URLSegment;
		}

		// We want to add a content type so the application knows it will be dealing with json.

		$this->response->addHeader('Content-Type', 'application/json');

		// We require an associative array at the top level, so we'll create this and insert our search results.

		$data = array('list' => $results->toNestedArray(), 'query' => array($query));

		// Convert this list to json so we can interate through using javascript.

		return Convert::array2json($data);
    }
}