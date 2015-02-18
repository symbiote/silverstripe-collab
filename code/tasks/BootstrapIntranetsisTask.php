<?php

/**
 * @author <marcus@silverstripe.com.au>
 * @license BSD License http://www.silverstripe.org/bsd-license
 */
class BootstrapIntranetsisTask extends BuildTask {
	public function run($request) {
		Restrictable::set_enabled(false);
		Versioned::reading_stage('Stage');
		
		$admin = Security::findAnAdministrator();
		Session::set("loggedInAs", $admin->ID);
		
		$home = SiteTree::get()->filter('URLSegment', 'home')->first();
		if ($home) {
			$this->o("Home page already exists, _not_ bootstrapping");
			return;
		}
		
		$site = Multisites::inst()->getCurrentSite();
		
		$dashboard = SiteDashboardPage::create(array(
			'Title'		=> 'Dashboard',
			'URLSegment'	=> 'dashboard',
			'ParentID'		=> $site->ID
		));
		$dashboard->write();
		$this->o("Created Dashboard");
		
		$home = RedirectorPage::create(array(
			'Title'	=> 'Home',
			'URLSegment'	=> 'home',
			'ParentID'		=> $site->ID
		));
		$home->LinkToID = $dashboard->ID;
		$home->write();
		$this->o("Created homepage");
		
		$group = Group::create(array(
			'Title'		=> 'All members',
		));
		
		$group->write();
		$this->o("Created All Members group");
		
		$site->Theme = 'ssau-minimalist';
		$site->LoggedInGroups()->add($group);
		$site->write();
		$this->o("Configured Site object");
		
		$site->doPublish();
		$home->doPublish();
		$dashboard->doPublish();
		$this->o("Published everything");
		
		Restrictable::set_enabled(true);
	}
	
	private function o($txt) {
		if (PHP_SAPI == 'cli') {
			echo "$txt\n";
		} else {
			echo "$txt<br/>\n";
		}
	}
}
