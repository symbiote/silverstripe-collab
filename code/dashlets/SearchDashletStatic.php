<?php

/**
 * Search listing.
 *
 * @author Nathan Glasl <nathan@silverstripe.com.au>
 */

class SearchDashletStatic extends SearchDashlet {
	public static $title = "Static Search Results";
	public static $cmsTitle = "Static Search Results";
	public static $description = "List of Static Search Results";
	
	private static $db = array(
		'SearchTerm' => 'Varchar'
	);
	
	public function getCMSFields() {
		$fields = parent::getCMSFields();
		$input = new TextField('SearchTerm', 'Search');
		$input->setAttribute('Placeholder', 'Search Term');
		$fields->push($input);
		return $fields;
	}
	
	public function getDashletFields() {
		$fields = parent::getDashletFields();
		$input = new TextField('SearchTerm', 'Search');
		$input->setAttribute('Placeholder', 'Search Term');
		$fields->push($input);
		return $fields;
	}
}

class SearchDashletStatic_Controller extends SearchDashlet_Controller {
	
	private static $allowed_actions = array('SearchForm');
	
	public function SearchForm() {
		
		// Create a form with the current search term.
		
		$term = $this->SearchTerm;
		
		$input = new TextField('Search', '', $term);
		$input->addExtraClass('search-input');
		$fields = new FieldList($input);
		$submit = new FormAction('results', 'Search');
		$submit->addExtraClass('search-submit');
		$actions = new FieldList($submit);
		$form = new SearchForm($this, "SearchForm", $fields, $actions);
		$form->addExtraClass('search-dashlet-form');
		$form->addExtraClass('static-search-dashlet-form');
		
		return $form;
	}
}