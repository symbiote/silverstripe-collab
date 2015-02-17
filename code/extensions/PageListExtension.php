<?php

/**
 * @author <marcus@silverstripe.com.au>
 * @license BSD License http://www.silverstripe.org/bsd-license
 */
class PageListExtension extends SiteTreeExtension {
	
	/**
	 * Return an array that represents how this page should be stored for favourites
	 */
	public function updateMapForList(&$d) {
		$d['Title']		= $this->owner->Title;
		$d['ID']		= $this->owner->ID;
		$d['Content']	= $this->owner->obj('Content')->forTemplate();
		$d['Link']		= $this->owner->AbsoluteLink();
	}
}
